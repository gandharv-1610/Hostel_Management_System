import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum("user_role", ["student", "warden", "admin"]);
export const requestStatusEnum = pgEnum("request_status", ["pending", "approved", "rejected"]);
export const genderEnum = pgEnum("gender", ["male", "female", "other"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull().default("student"),
  name: text("name").notNull(),
  phone: text("phone"),
  gender: genderEnum("gender"),
  department: text("department"),
  year: integer("year"),
  gpa: integer("gpa"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const hostels = pgTable("hostels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  gender: genderEnum("gender").notNull(),
  totalCapacity: integer("total_capacity").notNull().default(0),
  occupiedCapacity: integer("occupied_capacity").notNull().default(0),
  wardenId: varchar("warden_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const wings = pgTable("wings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hostelId: varchar("hostel_id").references(() => hostels.id).notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const floors = pgTable("floors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  wingId: varchar("wing_id").references(() => wings.id).notNull(),
  floorNumber: integer("floor_number").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rooms = pgTable("rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  floorId: varchar("floor_id").references(() => floors.id).notNull(),
  roomNumber: text("room_number").notNull(),
  capacity: integer("capacity").notNull().default(2),
  occupiedCount: integer("occupied_count").notNull().default(0),
  isUnderMaintenance: boolean("is_under_maintenance").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const roomAllotments = pgTable("room_allotments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => users.id).notNull(),
  roomId: varchar("room_id").references(() => rooms.id).notNull(),
  allottedAt: timestamp("allotted_at").defaultNow().notNull(),
  vacatedAt: timestamp("vacated_at"),
});

export const messes = pgTable("messes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  capacity: integer("capacity").notNull(),
  currentCount: integer("current_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messAllotments = pgTable("mess_allotments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => users.id).notNull(),
  messId: varchar("mess_id").references(() => messes.id).notNull(),
  allottedAt: timestamp("allotted_at").defaultNow().notNull(),
});

export const roomSwapRequests = pgTable("room_swap_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requesterId: varchar("requester_id").references(() => users.id).notNull(),
  requesterRoomId: varchar("requester_room_id").references(() => rooms.id).notNull(),
  targetStudentId: varchar("target_student_id").references(() => users.id).notNull(),
  targetRoomId: varchar("target_room_id").references(() => rooms.id).notNull(),
  status: requestStatusEnum("status").notNull().default("pending"),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
  processedBy: varchar("processed_by").references(() => users.id),
});

export const messChangeRequests = pgTable("mess_change_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => users.id).notNull(),
  currentMessId: varchar("current_mess_id").references(() => messes.id).notNull(),
  newMessId: varchar("new_mess_id").references(() => messes.id).notNull(),
  status: requestStatusEnum("status").notNull().default("pending"),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
  processedBy: varchar("processed_by").references(() => users.id),
});

export const leaveApplications = pgTable("leave_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => users.id).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  reason: text("reason").notNull(),
  destination: text("destination"),
  status: requestStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
  processedBy: varchar("processed_by").references(() => users.id),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const allotmentWindows = pgTable("allotment_windows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").notNull().default(false),
  minGpa: integer("min_gpa"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertHostelSchema = createInsertSchema(hostels);
export const insertRoomSchema = createInsertSchema(rooms);
export const insertRoomAllotmentSchema = createInsertSchema(roomAllotments);
export const insertMessAllotmentSchema = createInsertSchema(messAllotments);
export const insertRoomSwapRequestSchema = createInsertSchema(roomSwapRequests);
export const insertMessChangeRequestSchema = createInsertSchema(messChangeRequests);
export const insertLeaveApplicationSchema = createInsertSchema(leaveApplications);
export const insertNotificationSchema = createInsertSchema(notifications);

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Hostel = typeof hostels.$inferSelect;
export type Wing = typeof wings.$inferSelect;
export type Floor = typeof floors.$inferSelect;
export type Room = typeof rooms.$inferSelect;
export type RoomAllotment = typeof roomAllotments.$inferSelect;
export type Mess = typeof messes.$inferSelect;
export type MessAllotment = typeof messAllotments.$inferSelect;
export type RoomSwapRequest = typeof roomSwapRequests.$inferSelect;
export type MessChangeRequest = typeof messChangeRequests.$inferSelect;
export type LeaveApplication = typeof leaveApplications.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type AllotmentWindow = typeof allotmentWindows.$inferSelect;
