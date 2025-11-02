import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import type { User } from "@shared/schema";

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

interface AuthRequest extends Request {
  session: session.Session & Partial<session.SessionData> & { userId?: string };
}

// Auth middleware
const requireAuth = (req: AuthRequest, res: Response, next: Function) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

const requireRole = (...roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: Function) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    
    next();
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Session setup
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "hostel-management-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // ==================== AUTH ROUTES ====================
  
  // POST /api/auth/login
  app.post("/api/auth/login", async (req: AuthRequest, res: Response) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      req.session.userId = user.id;
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // POST /api/auth/logout
  app.post("/api/auth/logout", (req: AuthRequest, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  
  // GET /api/auth/me
  app.get("/api/auth/me", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ==================== STUDENT ROUTES ====================
  
  // GET /api/students
  app.get("/api/students", requireRole("admin", "warden"), async (req: AuthRequest, res: Response) => {
    try {
      const students = await storage.getAllStudents();
      const studentsWithoutPasswords = students.map(({ password, ...student }) => student);
      res.json({ students: studentsWithoutPasswords });
    } catch (error) {
      console.error("Get students error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // GET /api/students/:id
  app.get("/api/students/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const currentUser = await storage.getUser(req.session.userId!);
      
      // Students can only view their own profile unless admin/warden
      if (currentUser?.role === "student" && currentUser.id !== id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const student = await storage.getUser(id);
      if (!student || student.role !== "student") {
        return res.status(404).json({ message: "Student not found" });
      }
      
      const { password: _, ...studentWithoutPassword } = student;
      res.json({ student: studentWithoutPassword });
    } catch (error) {
      console.error("Get student error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // PATCH /api/students/:id
  app.patch("/api/students/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const currentUser = await storage.getUser(req.session.userId!);
      
      // Students can only update their own profile unless admin
      if (currentUser?.role === "student" && currentUser.id !== id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const { email, password, role, ...allowedUpdates } = req.body;
      
      // Hash password if provided
      let updates = { ...allowedUpdates };
      if (password && currentUser?.role === "admin") {
        updates.password = await bcrypt.hash(password, 10);
      }
      
      const updatedStudent = await storage.updateUser(id, updates);
      if (!updatedStudent) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      const { password: _, ...studentWithoutPassword } = updatedStudent;
      res.json({ student: studentWithoutPassword });
    } catch (error) {
      console.error("Update student error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ==================== HOSTEL/ROOM ROUTES ====================
  
  // GET /api/hostels
  app.get("/api/hostels", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const hostels = await storage.getAllHostels();
      res.json({ hostels });
    } catch (error) {
      console.error("Get hostels error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // GET /api/hostels/:id/wings
  app.get("/api/hostels/:id/wings", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const wings = await storage.getWingsByHostel(id);
      res.json({ wings });
    } catch (error) {
      console.error("Get wings error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // GET /api/rooms
  app.get("/api/rooms", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { hostelId, wingId, floorId, available } = req.query;
      
      const filters: any = {};
      if (hostelId) filters.hostelId = hostelId as string;
      if (wingId) filters.wingId = wingId as string;
      if (floorId) filters.floorId = floorId as string;
      if (available !== undefined) filters.available = available === "true";
      
      const rooms = await storage.getAllRooms(filters);
      res.json({ rooms });
    } catch (error) {
      console.error("Get rooms error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // GET /api/rooms/:id
  app.get("/api/rooms/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const room = await storage.getRoom(id);
      
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      
      res.json({ room });
    } catch (error) {
      console.error("Get room error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // POST /api/rooms/:id/allot
  app.post("/api/rooms/:id/allot", requireRole("admin", "warden"), async (req: AuthRequest, res: Response) => {
    try {
      const { id: roomId } = req.params;
      const { studentId } = req.body;
      
      if (!studentId) {
        return res.status(400).json({ message: "Student ID is required" });
      }
      
      const room = await storage.getRoom(roomId);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      
      if (room.occupiedCount >= room.capacity) {
        return res.status(400).json({ message: "Room is full" });
      }
      
      if (room.isUnderMaintenance) {
        return res.status(400).json({ message: "Room is under maintenance" });
      }
      
      const student = await storage.getUser(studentId);
      if (!student || student.role !== "student") {
        return res.status(404).json({ message: "Student not found" });
      }
      
      // Check if student already has an active room allotment
      const existingAllotments = await storage.getRoomAllotmentsByStudent(studentId);
      const activeAllotment = existingAllotments.find(a => !a.vacatedAt);
      if (activeAllotment) {
        return res.status(400).json({ message: "Student already has an active room allotment" });
      }
      
      const allotment = await storage.createRoomAllotment({
        studentId,
        roomId,
        vacatedAt: null,
      });
      
      // Create notification
      await storage.createNotification({
        userId: studentId,
        title: "Room Allotted",
        message: `You have been allotted room ${room.roomNumber}`,
        isRead: false,
      });
      
      res.json({ allotment });
    } catch (error) {
      console.error("Allot room error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // POST /api/hostels (admin only)
  app.post("/api/hostels", requireRole("admin"), async (req: AuthRequest, res: Response) => {
    try {
      const { name, gender, totalCapacity, wardenId } = req.body;
      
      if (!name || !gender || !totalCapacity) {
        return res.status(400).json({ message: "Name, gender, and total capacity are required" });
      }
      
      const hostel = await storage.createHostel({
        name,
        gender,
        totalCapacity,
        occupiedCapacity: 0,
        wardenId: wardenId || null,
      });
      
      res.json({ hostel });
    } catch (error) {
      console.error("Create hostel error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // PATCH /api/hostels/:id (admin only)
  app.patch("/api/hostels/:id", requireRole("admin"), async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const hostel = await storage.updateHostel(id, updates);
      if (!hostel) {
        return res.status(404).json({ message: "Hostel not found" });
      }
      
      res.json({ hostel });
    } catch (error) {
      console.error("Update hostel error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // POST /api/rooms (admin only)
  app.post("/api/rooms", requireRole("admin"), async (req: AuthRequest, res: Response) => {
    try {
      const { floorId, roomNumber, capacity } = req.body;
      
      if (!floorId || !roomNumber || !capacity) {
        return res.status(400).json({ message: "Floor ID, room number, and capacity are required" });
      }
      
      const room = await storage.createRoom({
        floorId,
        roomNumber,
        capacity,
        occupiedCount: 0,
        isUnderMaintenance: false,
      });
      
      res.json({ room });
    } catch (error) {
      console.error("Create room error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // PATCH /api/rooms/:id (admin/warden)
  app.patch("/api/rooms/:id", requireRole("admin", "warden"), async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const room = await storage.updateRoom(id, updates);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      
      res.json({ room });
    } catch (error) {
      console.error("Update room error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ==================== ROOM SWAP REQUESTS ====================
  
  // GET /api/room-swaps
  app.get("/api/room-swaps", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const currentUser = await storage.getUser(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      let requests;
      if (currentUser.role === "student") {
        requests = await storage.getRoomSwapRequestsByStudent(currentUser.id);
      } else if (currentUser.role === "warden") {
        // Get hostel managed by this warden
        const hostels = await storage.getAllHostels();
        const wardenHostel = hostels.find(h => h.wardenId === currentUser.id);
        
        if (wardenHostel) {
          requests = await storage.getRoomSwapRequestsByHostel(wardenHostel.id);
        } else {
          requests = [];
        }
      } else {
        // Admin can see all
        requests = Array.from((storage as any).roomSwapRequests.values());
      }
      
      res.json({ requests });
    } catch (error) {
      console.error("Get room swap requests error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // POST /api/room-swaps
  app.post("/api/room-swaps", requireRole("student"), async (req: AuthRequest, res: Response) => {
    try {
      const { targetStudentId, reason } = req.body;
      const requesterId = req.session.userId!;
      
      if (!targetStudentId) {
        return res.status(400).json({ message: "Target student ID is required" });
      }
      
      // Get requester's current room
      const requesterAllotments = await storage.getRoomAllotmentsByStudent(requesterId);
      const activeRequesterAllotment = requesterAllotments.find(a => !a.vacatedAt);
      
      if (!activeRequesterAllotment) {
        return res.status(400).json({ message: "You don't have an active room allotment" });
      }
      
      // Get target student's current room
      const targetAllotments = await storage.getRoomAllotmentsByStudent(targetStudentId);
      const activeTargetAllotment = targetAllotments.find(a => !a.vacatedAt);
      
      if (!activeTargetAllotment) {
        return res.status(400).json({ message: "Target student doesn't have an active room allotment" });
      }
      
      const request = await storage.createRoomSwapRequest({
        requesterId,
        requesterRoomId: activeRequesterAllotment.roomId,
        targetStudentId,
        targetRoomId: activeTargetAllotment.roomId,
        status: "pending",
        reason: reason || null,
      });
      
      // Create notification for target student
      await storage.createNotification({
        userId: targetStudentId,
        title: "Room Swap Request",
        message: "You have received a room swap request",
        isRead: false,
      });
      
      res.json({ request });
    } catch (error) {
      console.error("Create room swap request error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // POST /api/room-swaps/:id/approve
  app.post("/api/room-swaps/:id/approve", requireRole("warden", "admin"), async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { approved } = req.body;
      
      if (approved === undefined) {
        return res.status(400).json({ message: "Approved status is required" });
      }
      
      const request = await storage.getRoomSwapRequest(id);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      if (request.status !== "pending") {
        return res.status(400).json({ message: "Request has already been processed" });
      }
      
      const updatedRequest = await storage.updateRoomSwapRequest(id, {
        status: approved ? "approved" : "rejected",
        processedAt: new Date(),
        processedBy: req.session.userId!,
      });
      
      // Create notifications
      await storage.createNotification({
        userId: request.requesterId,
        title: `Room Swap Request ${approved ? "Approved" : "Rejected"}`,
        message: `Your room swap request has been ${approved ? "approved" : "rejected"}`,
        isRead: false,
      });
      
      await storage.createNotification({
        userId: request.targetStudentId,
        title: `Room Swap Request ${approved ? "Approved" : "Rejected"}`,
        message: `A room swap request has been ${approved ? "approved" : "rejected"}`,
        isRead: false,
      });
      
      res.json({ request: updatedRequest });
    } catch (error) {
      console.error("Approve room swap request error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ==================== MESS CHANGE REQUESTS ====================
  
  // GET /api/mess-changes
  app.get("/api/mess-changes", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const currentUser = await storage.getUser(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      let requests;
      if (currentUser.role === "student") {
        requests = await storage.getMessChangeRequestsByStudent(currentUser.id);
      } else {
        // Admin/warden can see all
        requests = Array.from((storage as any).messChangeRequests.values());
      }
      
      res.json({ requests });
    } catch (error) {
      console.error("Get mess change requests error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // POST /api/mess-changes
  app.post("/api/mess-changes", requireRole("student"), async (req: AuthRequest, res: Response) => {
    try {
      const { newMessId, reason } = req.body;
      const studentId = req.session.userId!;
      
      if (!newMessId) {
        return res.status(400).json({ message: "New mess ID is required" });
      }
      
      // Get student's current mess
      const messAllotments = await storage.getMessAllotmentsByStudent(studentId);
      if (messAllotments.length === 0) {
        return res.status(400).json({ message: "You don't have a mess allotment" });
      }
      
      const currentMessId = messAllotments[messAllotments.length - 1].messId;
      
      if (currentMessId === newMessId) {
        return res.status(400).json({ message: "New mess is same as current mess" });
      }
      
      const request = await storage.createMessChangeRequest({
        studentId,
        currentMessId,
        newMessId,
        status: "pending",
        reason: reason || null,
      });
      
      res.json({ request });
    } catch (error) {
      console.error("Create mess change request error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // POST /api/mess-changes/:id/approve
  app.post("/api/mess-changes/:id/approve", requireRole("warden", "admin"), async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { approved } = req.body;
      
      if (approved === undefined) {
        return res.status(400).json({ message: "Approved status is required" });
      }
      
      const request = await storage.getMessChangeRequest(id);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      if (request.status !== "pending") {
        return res.status(400).json({ message: "Request has already been processed" });
      }
      
      const updatedRequest = await storage.updateMessChangeRequest(id, {
        status: approved ? "approved" : "rejected",
        processedAt: new Date(),
        processedBy: req.session.userId!,
      });
      
      // If approved, create new mess allotment
      if (approved) {
        await storage.createMessAllotment({
          studentId: request.studentId,
          messId: request.newMessId,
        });
      }
      
      // Create notification
      await storage.createNotification({
        userId: request.studentId,
        title: `Mess Change Request ${approved ? "Approved" : "Rejected"}`,
        message: `Your mess change request has been ${approved ? "approved" : "rejected"}`,
        isRead: false,
      });
      
      res.json({ request: updatedRequest });
    } catch (error) {
      console.error("Approve mess change request error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ==================== MESS ROUTES ====================
  
  // GET /api/messes
  app.get("/api/messes", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const messes = await storage.getAllMesses();
      res.json({ messes });
    } catch (error) {
      console.error("Get messes error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ==================== LEAVE APPLICATIONS ====================
  
  // GET /api/leave-applications
  app.get("/api/leave-applications", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const currentUser = await storage.getUser(req.session.userId!);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      let applications;
      if (currentUser.role === "student") {
        applications = await storage.getLeaveApplicationsByStudent(currentUser.id);
      } else if (currentUser.role === "warden") {
        // Get hostel managed by this warden
        const hostels = await storage.getAllHostels();
        const wardenHostel = hostels.find(h => h.wardenId === currentUser.id);
        
        if (wardenHostel) {
          applications = await storage.getLeaveApplicationsByHostel(wardenHostel.id);
        } else {
          applications = [];
        }
      } else {
        // Admin can see all
        applications = Array.from((storage as any).leaveApplications.values());
      }
      
      res.json({ applications });
    } catch (error) {
      console.error("Get leave applications error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // POST /api/leave-applications
  app.post("/api/leave-applications", requireRole("student"), async (req: AuthRequest, res: Response) => {
    try {
      const { startDate, endDate, reason, destination } = req.body;
      const studentId = req.session.userId!;
      
      if (!startDate || !endDate || !reason) {
        return res.status(400).json({ message: "Start date, end date, and reason are required" });
      }
      
      const application = await storage.createLeaveApplication({
        studentId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        destination: destination || null,
        status: "pending",
      });
      
      res.json({ application });
    } catch (error) {
      console.error("Create leave application error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // POST /api/leave-applications/:id/approve
  app.post("/api/leave-applications/:id/approve", requireRole("warden", "admin"), async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { approved } = req.body;
      
      if (approved === undefined) {
        return res.status(400).json({ message: "Approved status is required" });
      }
      
      const application = await storage.getLeaveApplication(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      if (application.status !== "pending") {
        return res.status(400).json({ message: "Application has already been processed" });
      }
      
      const updatedApplication = await storage.updateLeaveApplication(id, {
        status: approved ? "approved" : "rejected",
        processedAt: new Date(),
        processedBy: req.session.userId!,
      });
      
      // Create notification
      await storage.createNotification({
        userId: application.studentId,
        title: `Leave Application ${approved ? "Approved" : "Rejected"}`,
        message: `Your leave application has been ${approved ? "approved" : "rejected"}`,
        isRead: false,
      });
      
      res.json({ application: updatedApplication });
    } catch (error) {
      console.error("Approve leave application error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ==================== NOTIFICATIONS ====================
  
  // GET /api/notifications
  app.get("/api/notifications", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const notifications = await storage.getNotificationsByUser(req.session.userId!);
      res.json({ notifications });
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // PATCH /api/notifications/:id/read
  app.patch("/api/notifications/:id/read", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      
      const notification = await storage.getNotification(id);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      // Verify the notification belongs to the current user
      if (notification.userId !== req.session.userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.markNotificationAsRead(id);
      
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Mark notification as read error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
