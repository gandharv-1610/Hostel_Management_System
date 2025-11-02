import { 
  type User, type InsertUser,
  type Hostel, type Wing, type Floor, type Room,
  type RoomAllotment, type Mess, type MessAllotment,
  type RoomSwapRequest, type MessChangeRequest, type LeaveApplication,
  type Notification, type AllotmentWindow
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getAllStudents(): Promise<User[]>;
  
  // Hostel methods
  getHostel(id: string): Promise<Hostel | undefined>;
  getAllHostels(): Promise<Hostel[]>;
  createHostel(hostel: Omit<Hostel, 'id' | 'createdAt'>): Promise<Hostel>;
  updateHostel(id: string, updates: Partial<Hostel>): Promise<Hostel | undefined>;
  
  // Wing methods
  getWing(id: string): Promise<Wing | undefined>;
  getWingsByHostel(hostelId: string): Promise<Wing[]>;
  createWing(wing: Omit<Wing, 'id' | 'createdAt'>): Promise<Wing>;
  
  // Floor methods
  getFloor(id: string): Promise<Floor | undefined>;
  getFloorsByWing(wingId: string): Promise<Floor[]>;
  createFloor(floor: Omit<Floor, 'id' | 'createdAt'>): Promise<Floor>;
  
  // Room methods
  getRoom(id: string): Promise<Room | undefined>;
  getAllRooms(filters?: { hostelId?: string; wingId?: string; floorId?: string; available?: boolean }): Promise<Room[]>;
  createRoom(room: Omit<Room, 'id' | 'createdAt'>): Promise<Room>;
  updateRoom(id: string, updates: Partial<Room>): Promise<Room | undefined>;
  
  // Room Allotment methods
  getRoomAllotment(id: string): Promise<RoomAllotment | undefined>;
  getRoomAllotmentsByStudent(studentId: string): Promise<RoomAllotment[]>;
  getRoomAllotmentsByRoom(roomId: string): Promise<RoomAllotment[]>;
  createRoomAllotment(allotment: Omit<RoomAllotment, 'id' | 'allottedAt'>): Promise<RoomAllotment>;
  vacateRoom(allotmentId: string): Promise<void>;
  
  // Mess methods
  getMess(id: string): Promise<Mess | undefined>;
  getAllMesses(): Promise<Mess[]>;
  createMess(mess: Omit<Mess, 'id' | 'createdAt'>): Promise<Mess>;
  
  // Mess Allotment methods
  getMessAllotmentsByStudent(studentId: string): Promise<MessAllotment[]>;
  createMessAllotment(allotment: Omit<MessAllotment, 'id' | 'allottedAt'>): Promise<MessAllotment>;
  
  // Room Swap Request methods
  getRoomSwapRequest(id: string): Promise<RoomSwapRequest | undefined>;
  getRoomSwapRequestsByStudent(studentId: string): Promise<RoomSwapRequest[]>;
  getRoomSwapRequestsByHostel(hostelId: string): Promise<RoomSwapRequest[]>;
  createRoomSwapRequest(request: Omit<RoomSwapRequest, 'id' | 'createdAt' | 'processedAt' | 'processedBy'>): Promise<RoomSwapRequest>;
  updateRoomSwapRequest(id: string, updates: Partial<RoomSwapRequest>): Promise<RoomSwapRequest | undefined>;
  
  // Mess Change Request methods
  getMessChangeRequest(id: string): Promise<MessChangeRequest | undefined>;
  getMessChangeRequestsByStudent(studentId: string): Promise<MessChangeRequest[]>;
  createMessChangeRequest(request: Omit<MessChangeRequest, 'id' | 'createdAt' | 'processedAt' | 'processedBy'>): Promise<MessChangeRequest>;
  updateMessChangeRequest(id: string, updates: Partial<MessChangeRequest>): Promise<MessChangeRequest | undefined>;
  
  // Leave Application methods
  getLeaveApplication(id: string): Promise<LeaveApplication | undefined>;
  getLeaveApplicationsByStudent(studentId: string): Promise<LeaveApplication[]>;
  getLeaveApplicationsByHostel(hostelId: string): Promise<LeaveApplication[]>;
  createLeaveApplication(application: Omit<LeaveApplication, 'id' | 'createdAt' | 'processedAt' | 'processedBy'>): Promise<LeaveApplication>;
  updateLeaveApplication(id: string, updates: Partial<LeaveApplication>): Promise<LeaveApplication | undefined>;
  
  // Notification methods
  getNotification(id: string): Promise<Notification | undefined>;
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<void>;
  
  // Allotment Window methods
  getAllotmentWindow(id: string): Promise<AllotmentWindow | undefined>;
  getActiveAllotmentWindow(): Promise<AllotmentWindow | undefined>;
  getAllAllotmentWindows(): Promise<AllotmentWindow[]>;
  createAllotmentWindow(window: Omit<AllotmentWindow, 'id' | 'createdAt'>): Promise<AllotmentWindow>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private hostels: Map<string, Hostel>;
  private wings: Map<string, Wing>;
  private floors: Map<string, Floor>;
  private rooms: Map<string, Room>;
  private roomAllotments: Map<string, RoomAllotment>;
  private messes: Map<string, Mess>;
  private messAllotments: Map<string, MessAllotment>;
  private roomSwapRequests: Map<string, RoomSwapRequest>;
  private messChangeRequests: Map<string, MessChangeRequest>;
  private leaveApplications: Map<string, LeaveApplication>;
  private notifications: Map<string, Notification>;
  private allotmentWindows: Map<string, AllotmentWindow>;

  constructor() {
    this.users = new Map();
    this.hostels = new Map();
    this.wings = new Map();
    this.floors = new Map();
    this.rooms = new Map();
    this.roomAllotments = new Map();
    this.messes = new Map();
    this.messAllotments = new Map();
    this.roomSwapRequests = new Map();
    this.messChangeRequests = new Map();
    this.leaveApplications = new Map();
    this.notifications = new Map();
    this.allotmentWindows = new Map();
    
    this.seedData();
  }

  private async seedData() {
    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin: User = {
      id: randomUUID(),
      email: "admin@svnit.ac.in",
      password: adminPassword,
      role: "admin",
      name: "Admin User",
      phone: "9876543210",
      gender: "male",
      department: "Administration",
      year: null,
      gpa: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(admin.id, admin);

    // Create hostels
    const boysHostel1: Hostel = {
      id: randomUUID(),
      name: "Boys Hostel 1",
      gender: "male",
      totalCapacity: 200,
      occupiedCapacity: 150,
      wardenId: null,
      createdAt: new Date(),
    };
    this.hostels.set(boysHostel1.id, boysHostel1);

    const girlsHostel1: Hostel = {
      id: randomUUID(),
      name: "Girls Hostel 1",
      gender: "female",
      totalCapacity: 150,
      occupiedCapacity: 100,
      wardenId: null,
      createdAt: new Date(),
    };
    this.hostels.set(girlsHostel1.id, girlsHostel1);

    // Create warden for Boys Hostel 1
    const wardenPassword = await bcrypt.hash("warden123", 10);
    const warden: User = {
      id: randomUUID(),
      email: "warden.bh1@svnit.ac.in",
      password: wardenPassword,
      role: "warden",
      name: "Dr. Rajesh Kumar",
      phone: "9876543211",
      gender: "male",
      department: "Civil Engineering",
      year: null,
      gpa: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(warden.id, warden);
    boysHostel1.wardenId = warden.id;
    this.hostels.set(boysHostel1.id, boysHostel1);

    // Create wings for Boys Hostel 1
    const wingA: Wing = {
      id: randomUUID(),
      hostelId: boysHostel1.id,
      name: "Wing A",
      createdAt: new Date(),
    };
    this.wings.set(wingA.id, wingA);

    const wingB: Wing = {
      id: randomUUID(),
      hostelId: boysHostel1.id,
      name: "Wing B",
      createdAt: new Date(),
    };
    this.wings.set(wingB.id, wingB);

    // Create floors for Wing A
    const floor1: Floor = {
      id: randomUUID(),
      wingId: wingA.id,
      floorNumber: 1,
      createdAt: new Date(),
    };
    this.floors.set(floor1.id, floor1);

    const floor2: Floor = {
      id: randomUUID(),
      wingId: wingA.id,
      floorNumber: 2,
      createdAt: new Date(),
    };
    this.floors.set(floor2.id, floor2);

    // Create rooms for Floor 1
    for (let i = 1; i <= 10; i++) {
      const room: Room = {
        id: randomUUID(),
        floorId: floor1.id,
        roomNumber: `A-101${i < 10 ? '0' + i : i}`,
        capacity: 2,
        occupiedCount: i <= 7 ? 2 : 0,
        isUnderMaintenance: i === 10,
        createdAt: new Date(),
      };
      this.rooms.set(room.id, room);
    }

    // Create messes
    const mess1: Mess = {
      id: randomUUID(),
      name: "Mess 1 - North Indian",
      capacity: 300,
      currentCount: 200,
      createdAt: new Date(),
    };
    this.messes.set(mess1.id, mess1);

    const mess2: Mess = {
      id: randomUUID(),
      name: "Mess 2 - South Indian",
      capacity: 250,
      currentCount: 150,
      createdAt: new Date(),
    };
    this.messes.set(mess2.id, mess2);

    // Create sample students
    const studentPassword = await bcrypt.hash("student123", 10);
    const roomsArray = Array.from(this.rooms.values()).filter(r => r.occupiedCount < r.capacity && !r.isUnderMaintenance);
    
    for (let i = 1; i <= 5; i++) {
      const student: User = {
        id: randomUUID(),
        email: `u${2021000 + i}@svnit.ac.in`,
        password: studentPassword,
        role: "student",
        name: `Student ${i}`,
        phone: `987654${3210 + i}`,
        gender: "male",
        department: i % 2 === 0 ? "Computer Engineering" : "Electrical Engineering",
        year: 2 + (i % 3),
        gpa: 70 + (i * 5),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.set(student.id, student);

      // Allot room to first 3 students
      if (i <= 3 && roomsArray[i - 1]) {
        const allotment: RoomAllotment = {
          id: randomUUID(),
          studentId: student.id,
          roomId: roomsArray[i - 1].id,
          allottedAt: new Date(),
          vacatedAt: null,
        };
        this.roomAllotments.set(allotment.id, allotment);
      }

      // Allot mess to all students
      const messAllotment: MessAllotment = {
        id: randomUUID(),
        studentId: student.id,
        messId: i % 2 === 0 ? mess1.id : mess2.id,
        allottedAt: new Date(),
      };
      this.messAllotments.set(messAllotment.id, messAllotment);

      // Create a sample notification
      const notification: Notification = {
        id: randomUUID(),
        userId: student.id,
        title: "Welcome to Hostel Management System",
        message: "Your account has been created successfully. Please complete your profile.",
        isRead: false,
        createdAt: new Date(),
      };
      this.notifications.set(notification.id, notification);
    }

    // Create an active allotment window
    const window: AllotmentWindow = {
      id: randomUUID(),
      name: "Spring 2025 Room Allotment",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-12-31"),
      isActive: true,
      minGpa: 60,
      createdAt: new Date(),
    };
    this.allotmentWindows.set(window.id, window);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllStudents(): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.role === "student");
  }

  // Hostel methods
  async getHostel(id: string): Promise<Hostel | undefined> {
    return this.hostels.get(id);
  }

  async getAllHostels(): Promise<Hostel[]> {
    return Array.from(this.hostels.values());
  }

  async createHostel(hostelData: Omit<Hostel, 'id' | 'createdAt'>): Promise<Hostel> {
    const id = randomUUID();
    const hostel: Hostel = { ...hostelData, id, createdAt: new Date() };
    this.hostels.set(id, hostel);
    return hostel;
  }

  async updateHostel(id: string, updates: Partial<Hostel>): Promise<Hostel | undefined> {
    const hostel = this.hostels.get(id);
    if (!hostel) return undefined;
    
    const updatedHostel = { ...hostel, ...updates };
    this.hostels.set(id, updatedHostel);
    return updatedHostel;
  }

  // Wing methods
  async getWing(id: string): Promise<Wing | undefined> {
    return this.wings.get(id);
  }

  async getWingsByHostel(hostelId: string): Promise<Wing[]> {
    return Array.from(this.wings.values()).filter(wing => wing.hostelId === hostelId);
  }

  async createWing(wingData: Omit<Wing, 'id' | 'createdAt'>): Promise<Wing> {
    const id = randomUUID();
    const wing: Wing = { ...wingData, id, createdAt: new Date() };
    this.wings.set(id, wing);
    return wing;
  }

  // Floor methods
  async getFloor(id: string): Promise<Floor | undefined> {
    return this.floors.get(id);
  }

  async getFloorsByWing(wingId: string): Promise<Floor[]> {
    return Array.from(this.floors.values()).filter(floor => floor.wingId === wingId);
  }

  async createFloor(floorData: Omit<Floor, 'id' | 'createdAt'>): Promise<Floor> {
    const id = randomUUID();
    const floor: Floor = { ...floorData, id, createdAt: new Date() };
    this.floors.set(id, floor);
    return floor;
  }

  // Room methods
  async getRoom(id: string): Promise<Room | undefined> {
    return this.rooms.get(id);
  }

  async getAllRooms(filters?: { hostelId?: string; wingId?: string; floorId?: string; available?: boolean }): Promise<Room[]> {
    let rooms = Array.from(this.rooms.values());
    
    if (filters?.floorId) {
      rooms = rooms.filter(room => room.floorId === filters.floorId);
    }
    
    if (filters?.wingId) {
      const floorIds = Array.from(this.floors.values())
        .filter(floor => floor.wingId === filters.wingId)
        .map(floor => floor.id);
      rooms = rooms.filter(room => floorIds.includes(room.floorId));
    }
    
    if (filters?.hostelId) {
      const wingIds = Array.from(this.wings.values())
        .filter(wing => wing.hostelId === filters.hostelId)
        .map(wing => wing.id);
      const floorIds = Array.from(this.floors.values())
        .filter(floor => wingIds.includes(floor.wingId))
        .map(floor => floor.id);
      rooms = rooms.filter(room => floorIds.includes(room.floorId));
    }
    
    if (filters?.available !== undefined) {
      rooms = rooms.filter(room => 
        filters.available 
          ? room.occupiedCount < room.capacity && !room.isUnderMaintenance
          : room.occupiedCount >= room.capacity || room.isUnderMaintenance
      );
    }
    
    return rooms;
  }

  async createRoom(roomData: Omit<Room, 'id' | 'createdAt'>): Promise<Room> {
    const id = randomUUID();
    const room: Room = { ...roomData, id, createdAt: new Date() };
    this.rooms.set(id, room);
    return room;
  }

  async updateRoom(id: string, updates: Partial<Room>): Promise<Room | undefined> {
    const room = this.rooms.get(id);
    if (!room) return undefined;
    
    const updatedRoom = { ...room, ...updates };
    this.rooms.set(id, updatedRoom);
    return updatedRoom;
  }

  // Room Allotment methods
  async getRoomAllotment(id: string): Promise<RoomAllotment | undefined> {
    return this.roomAllotments.get(id);
  }

  async getRoomAllotmentsByStudent(studentId: string): Promise<RoomAllotment[]> {
    return Array.from(this.roomAllotments.values())
      .filter(allotment => allotment.studentId === studentId);
  }

  async getRoomAllotmentsByRoom(roomId: string): Promise<RoomAllotment[]> {
    return Array.from(this.roomAllotments.values())
      .filter(allotment => allotment.roomId === roomId && !allotment.vacatedAt);
  }

  async createRoomAllotment(allotmentData: Omit<RoomAllotment, 'id' | 'allottedAt'>): Promise<RoomAllotment> {
    const id = randomUUID();
    const allotment: RoomAllotment = { 
      ...allotmentData, 
      id, 
      allottedAt: new Date() 
    };
    this.roomAllotments.set(id, allotment);
    
    // Update room occupied count
    const room = this.rooms.get(allotmentData.roomId);
    if (room) {
      room.occupiedCount += 1;
      this.rooms.set(room.id, room);
    }
    
    return allotment;
  }

  async vacateRoom(allotmentId: string): Promise<void> {
    const allotment = this.roomAllotments.get(allotmentId);
    if (allotment) {
      allotment.vacatedAt = new Date();
      this.roomAllotments.set(allotmentId, allotment);
      
      // Update room occupied count
      const room = this.rooms.get(allotment.roomId);
      if (room && room.occupiedCount > 0) {
        room.occupiedCount -= 1;
        this.rooms.set(room.id, room);
      }
    }
  }

  // Mess methods
  async getMess(id: string): Promise<Mess | undefined> {
    return this.messes.get(id);
  }

  async getAllMesses(): Promise<Mess[]> {
    return Array.from(this.messes.values());
  }

  async createMess(messData: Omit<Mess, 'id' | 'createdAt'>): Promise<Mess> {
    const id = randomUUID();
    const mess: Mess = { ...messData, id, createdAt: new Date() };
    this.messes.set(id, mess);
    return mess;
  }

  // Mess Allotment methods
  async getMessAllotmentsByStudent(studentId: string): Promise<MessAllotment[]> {
    return Array.from(this.messAllotments.values())
      .filter(allotment => allotment.studentId === studentId);
  }

  async createMessAllotment(allotmentData: Omit<MessAllotment, 'id' | 'allottedAt'>): Promise<MessAllotment> {
    const id = randomUUID();
    const allotment: MessAllotment = { 
      ...allotmentData, 
      id, 
      allottedAt: new Date() 
    };
    this.messAllotments.set(id, allotment);
    return allotment;
  }

  // Room Swap Request methods
  async getRoomSwapRequest(id: string): Promise<RoomSwapRequest | undefined> {
    return this.roomSwapRequests.get(id);
  }

  async getRoomSwapRequestsByStudent(studentId: string): Promise<RoomSwapRequest[]> {
    return Array.from(this.roomSwapRequests.values())
      .filter(req => req.requesterId === studentId || req.targetStudentId === studentId);
  }

  async getRoomSwapRequestsByHostel(hostelId: string): Promise<RoomSwapRequest[]> {
    const wingIds = Array.from(this.wings.values())
      .filter(wing => wing.hostelId === hostelId)
      .map(wing => wing.id);
    const floorIds = Array.from(this.floors.values())
      .filter(floor => wingIds.includes(floor.wingId))
      .map(floor => floor.id);
    const roomIds = Array.from(this.rooms.values())
      .filter(room => floorIds.includes(room.floorId))
      .map(room => room.id);
    
    return Array.from(this.roomSwapRequests.values())
      .filter(req => roomIds.includes(req.requesterRoomId) || roomIds.includes(req.targetRoomId));
  }

  async createRoomSwapRequest(requestData: Omit<RoomSwapRequest, 'id' | 'createdAt' | 'processedAt' | 'processedBy'>): Promise<RoomSwapRequest> {
    const id = randomUUID();
    const request: RoomSwapRequest = { 
      ...requestData, 
      id, 
      createdAt: new Date(),
      processedAt: null,
      processedBy: null,
    };
    this.roomSwapRequests.set(id, request);
    return request;
  }

  async updateRoomSwapRequest(id: string, updates: Partial<RoomSwapRequest>): Promise<RoomSwapRequest | undefined> {
    const request = this.roomSwapRequests.get(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, ...updates };
    this.roomSwapRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  // Mess Change Request methods
  async getMessChangeRequest(id: string): Promise<MessChangeRequest | undefined> {
    return this.messChangeRequests.get(id);
  }

  async getMessChangeRequestsByStudent(studentId: string): Promise<MessChangeRequest[]> {
    return Array.from(this.messChangeRequests.values())
      .filter(req => req.studentId === studentId);
  }

  async createMessChangeRequest(requestData: Omit<MessChangeRequest, 'id' | 'createdAt' | 'processedAt' | 'processedBy'>): Promise<MessChangeRequest> {
    const id = randomUUID();
    const request: MessChangeRequest = { 
      ...requestData, 
      id, 
      createdAt: new Date(),
      processedAt: null,
      processedBy: null,
    };
    this.messChangeRequests.set(id, request);
    return request;
  }

  async updateMessChangeRequest(id: string, updates: Partial<MessChangeRequest>): Promise<MessChangeRequest | undefined> {
    const request = this.messChangeRequests.get(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, ...updates };
    this.messChangeRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  // Leave Application methods
  async getLeaveApplication(id: string): Promise<LeaveApplication | undefined> {
    return this.leaveApplications.get(id);
  }

  async getLeaveApplicationsByStudent(studentId: string): Promise<LeaveApplication[]> {
    return Array.from(this.leaveApplications.values())
      .filter(app => app.studentId === studentId);
  }

  async getLeaveApplicationsByHostel(hostelId: string): Promise<LeaveApplication[]> {
    const studentIds = Array.from(this.users.values())
      .filter(user => user.role === "student")
      .map(user => user.id);
    
    const roomAllotments = Array.from(this.roomAllotments.values())
      .filter(allotment => studentIds.includes(allotment.studentId) && !allotment.vacatedAt);
    
    const wingIds = Array.from(this.wings.values())
      .filter(wing => wing.hostelId === hostelId)
      .map(wing => wing.id);
    const floorIds = Array.from(this.floors.values())
      .filter(floor => wingIds.includes(floor.wingId))
      .map(floor => floor.id);
    const roomIds = Array.from(this.rooms.values())
      .filter(room => floorIds.includes(room.floorId))
      .map(room => room.id);
    
    const relevantStudentIds = roomAllotments
      .filter(allotment => roomIds.includes(allotment.roomId))
      .map(allotment => allotment.studentId);
    
    return Array.from(this.leaveApplications.values())
      .filter(app => relevantStudentIds.includes(app.studentId));
  }

  async createLeaveApplication(applicationData: Omit<LeaveApplication, 'id' | 'createdAt' | 'processedAt' | 'processedBy'>): Promise<LeaveApplication> {
    const id = randomUUID();
    const application: LeaveApplication = { 
      ...applicationData, 
      id, 
      createdAt: new Date(),
      processedAt: null,
      processedBy: null,
    };
    this.leaveApplications.set(id, application);
    return application;
  }

  async updateLeaveApplication(id: string, updates: Partial<LeaveApplication>): Promise<LeaveApplication | undefined> {
    const application = this.leaveApplications.get(id);
    if (!application) return undefined;
    
    const updatedApplication = { ...application, ...updates };
    this.leaveApplications.set(id, updatedApplication);
    return updatedApplication;
  }

  // Notification methods
  async getNotification(id: string): Promise<Notification | undefined> {
    return this.notifications.get(id);
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notif => notif.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = { 
      ...notificationData, 
      id, 
      createdAt: new Date() 
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.isRead = true;
      this.notifications.set(id, notification);
    }
  }

  // Allotment Window methods
  async getAllotmentWindow(id: string): Promise<AllotmentWindow | undefined> {
    return this.allotmentWindows.get(id);
  }

  async getActiveAllotmentWindow(): Promise<AllotmentWindow | undefined> {
    return Array.from(this.allotmentWindows.values())
      .find(window => window.isActive);
  }

  async getAllAllotmentWindows(): Promise<AllotmentWindow[]> {
    return Array.from(this.allotmentWindows.values());
  }

  async createAllotmentWindow(windowData: Omit<AllotmentWindow, 'id' | 'createdAt'>): Promise<AllotmentWindow> {
    const id = randomUUID();
    const window: AllotmentWindow = { 
      ...windowData, 
      id, 
      createdAt: new Date() 
    };
    this.allotmentWindows.set(id, window);
    return window;
  }
}

export const storage = new MemStorage();
