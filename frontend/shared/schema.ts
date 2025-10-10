import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  role: text("role").notNull().default("student"),
  photoUrl: text("photo_url"),
});

// Student profiles
export const studentProfiles = pgTable("student_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  studentId: text("student_id").notNull().unique(),
  college: text("college").notNull(),
  department: text("department").notNull(),
  year: text("year").notNull(),
  studentType: text("student_type").notNull(),
});

// Security profiles
export const securityProfiles = pgTable("security_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  securityId: text("security_id").notNull().unique(),
  gate: text("gate").notNull(),
  dob: text("dob").notNull(),
  shift: text("shift").notNull(),
  address: text("address").notNull(),
});

// Gate pass table
export const gatePasses = pgTable("gate_passes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: text("date").notNull(),
  fromTime: text("from_time").notNull(),
  toTime: text("to_time").notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("pending"),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  approvals: json("approvals").notNull().default({}),
  vehicleNo: text("vehicle_no"),
});

// Visitor pass table
export const visitorPasses = pgTable("visitor_passes", {
  id: serial("id").primaryKey(),
  visitorName: text("visitor_name").notNull(),
  phone: text("phone").notNull(),
  date: text("date").notNull(),
  purpose: text("purpose").notNull(),
  concernPerson: text("concern_person").notNull(),
  concernPersonPhone: text("concern_person_phone").notNull(),
  status: text("status").notNull().default("pending"),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  vehicleNo: text("vehicle_no"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  phone: true,
  role: true,
});

export const insertStudentProfileSchema = createInsertSchema(studentProfiles).pick({
  userId: true,
  studentId: true,
  college: true,
  department: true,
  year: true,
  studentType: true,
});

export const insertSecurityProfileSchema = createInsertSchema(securityProfiles).pick({
  userId: true,
  securityId: true,
  gate: true,
  dob: true,
  shift: true,
  address: true,
});

export const insertGatePassSchema = createInsertSchema(gatePasses).pick({
  userId: true,
  date: true,
  fromTime: true,
  toTime: true,
  reason: true,
  vehicleNo: true,
});

export const insertVisitorPassSchema = createInsertSchema(visitorPasses).pick({
  visitorName: true,
  phone: true,
  date: true,
  purpose: true,
  concernPerson: true,
  concernPersonPhone: true,
  vehicleNo: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertStudentProfile = z.infer<typeof insertStudentProfileSchema>;
export type StudentProfile = typeof studentProfiles.$inferSelect;

export type InsertSecurityProfile = z.infer<typeof insertSecurityProfileSchema>;
export type SecurityProfile = typeof securityProfiles.$inferSelect;

export type InsertGatePass = z.infer<typeof insertGatePassSchema>;
export type GatePass = typeof gatePasses.$inferSelect & {
  student: {
    name: string;
    department: string;
  }
};

export type InsertVisitorPass = z.infer<typeof insertVisitorPassSchema>;
export type VisitorPass = typeof visitorPasses.$inferSelect;

// Register form validation schema
export const registerFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});
