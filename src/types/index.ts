export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  classId?: string;
}

export interface Class {
  id: string;
  name: string;
  teacherId: string;
}

export interface Attendance {
  id: string;
  date: string;
  classId: string;
  studentId: string;
  status: 'present' | 'absent';
}

export interface Fee {
  id: string;
  studentId: string;
  amount: number;
  status: 'paid' | 'pending';
  date: string;
}

export interface Announcement {
  id: string;
  title: string;
  text: string;
  date: string;
}
