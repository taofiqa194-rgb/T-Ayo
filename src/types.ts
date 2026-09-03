export type UserRole = 'student' | 'staff' | 'admin';

export type SchoolSection = 'primary' | 'secondary';

export interface Student {
  id: string;
  studentNumber: string; // e.g. TAYO/2024/001
  password?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  section: SchoolSection;
  className: string; // e.g. "Primary 5 Alpha", "SSS 2 Science", "JSS 1 Gold"
  arm?: string;
  house: 'Emerald' | 'Ruby' | 'Sapphire' | 'Topaz';
  photoUrl: string;
  status: 'Active' | 'Suspended' | 'Graduated';
  admissionYear: number;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianRelationship: string;
  address: string;
  stateOfOrigin: string;
}

export interface Staff {
  id: string;
  staffId: string; // e.g. STF-012
  email: string;
  password?: string;
  fullName: string;
  gender: 'Male' | 'Female';
  phone: string;
  qualification: string;
  roleTitle: string; // e.g. "Senior Mathematics Teacher", "Head of Science"
  assignedSection: SchoolSection | 'both';
  assignedClasses: string[]; // e.g. ["SSS 1 Science", "SSS 2 Science"]
  assignedSubjects: string[]; // e.g. ["Mathematics", "Further Mathematics"]
  photoUrl: string;
  address?: string;
  joinedDate: string;
}

export interface Administrator {
  id: string;
  adminId: string;
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
  role: 'Super Administrator' | 'Academic Principal' | 'Registrar';
  photoUrl: string;
  lastLogin?: string;
}

export interface FeeItem {
  id: string;
  title: string;
  amount: number;
  category: 'Tuition' | 'Development' | 'Exam & ICT' | 'Uniform & Materials' | 'PTA Levy';
  required: boolean;
}

export interface FeePayment {
  id: string;
  studentId: string;
  studentNumber: string;
  studentName: string;
  className: string;
  session: string;
  term: '1st Term' | '2nd Term' | '3rd Term';
  amount: number;
  totalFees: number;
  status: 'Verified' | 'Pending Verification' | 'Rejected';
  payerName: string;
  payerPhone: string;
  paymentMethod: string;
  bankName: string; // e.g. "Moniepoint"
  accountNumber: string; // e.g. "9076930244"
  accountName: string; // e.g. "Abbas Taofiq Ayomide"
  transactionRef: string;
  paymentDate: string;
  receiptNote?: string;
  createdAt: string;
}

export interface SubjectResult {
  subject: string;
  caScore: number; // Continuous Assessment (max 30)
  examScore: number; // Exam (max 70)
  totalScore: number; // Total (max 100)
  grade: 'A1' | 'B2' | 'B3' | 'C4' | 'C5' | 'C6' | 'D7' | 'E8' | 'F9';
  position: string; // e.g. "1st", "4th"
  remark: string; // e.g. "Distinction", "Excellent", "Good"
}

export interface StudentResultRecord {
  id: string;
  studentId: string;
  studentNumber: string;
  studentName: string;
  className: string;
  session: string; // e.g. "2024/2025"
  term: '1st Term' | '2nd Term' | '3rd Term';
  subjects: SubjectResult[];
  overallTotal: number;
  overallAverage: number;
  classPosition: string; // e.g. "3rd of 38"
  teacherRemark: string;
  principalRemark: string;
  timesSchoolOpened: number;
  timesPresent: number;
  status: 'Draft' | 'Submitted' | 'Published';
  updatedAt: string;
}

export interface AdmissionApplication {
  id: string;
  applicationNumber: string; // e.g. APP-2025-089
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  section: SchoolSection;
  classApplyingFor: string;
  previousSchool: string;
  parentName: string;
  parentRelationship: string;
  parentPhone: string;
  parentEmail: string;
  parentOccupation?: string;
  residentialAddress: string;
  stateOfOrigin?: string;
  passportPhoto: string; // Base64 data URL
  birthCertificateName?: string;
  previousReportCardName?: string;
  submittedAt: string;
  submittedDate?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  decisionNotes?: string;
  assignedStudentNumber?: string;
}

export interface SchoolClass {
  id: string;
  name: string; // e.g. "Primary 1", "SSS 2 Science"
  section: SchoolSection;
  classTeacherName: string;
  classTeacherId: string;
  totalStudents: number;
  capacity: number;
  prefectName: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'General' | 'Academic' | 'Primary' | 'Secondary' | 'PTA';
  publishedDate: string;
  targetAudience: 'All' | 'Students' | 'Staff' | 'Parents';
  isImportant?: boolean;
  author: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Campus' | 'Sports' | 'Science & Arts' | 'Cultural Day' | 'Graduation';
  imageUrl: string;
  description: string;
  date: string;
}

export type PageId =
  | 'home'
  | 'about'
  | 'primary'
  | 'secondary'
  | 'admission'
  | 'student-login'
  | 'staff-login'
  | 'admin-login'
  | 'contact'
  | 'news'
  | 'gallery'
  | 'student-dashboard'
  | 'staff-dashboard'
  | 'admin-dashboard';
