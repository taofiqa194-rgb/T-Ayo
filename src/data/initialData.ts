import {
  Student,
  Staff,
  Administrator,
  StudentResultRecord,
  AdmissionApplication,
  SchoolClass,
  Announcement,
  GalleryItem,
  FeePayment
} from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    studentNumber: 'TAYO/2024/014',
    password: 'password123',
    firstName: 'Oluwaseun',
    lastName: 'Adeyemi',
    middleName: 'Emmanuel',
    gender: 'Male',
    dateOfBirth: '2009-04-15',
    section: 'secondary',
    className: 'SSS 2 Science',
    arm: 'Gold',
    house: 'Emerald',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    status: 'Active',
    admissionYear: 2021,
    guardianName: 'Dr. Michael Adeyemi',
    guardianPhone: '+234 803 456 7890',
    guardianEmail: 'm.adeyemi@gmail.com',
    guardianRelationship: 'Father',
    address: 'Plot 12, Off Fate Road, GRA, Ilorin, Kwara State',
    stateOfOrigin: 'Kwara State'
  },
  {
    id: 'std-2',
    studentNumber: 'TAYO/2024/015',
    password: 'password123',
    firstName: 'Fatima',
    lastName: 'Bello',
    middleName: 'Zainab',
    gender: 'Female',
    dateOfBirth: '2010-09-22',
    section: 'secondary',
    className: 'SSS 2 Science',
    arm: 'Gold',
    house: 'Sapphire',
    photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
    status: 'Active',
    admissionYear: 2021,
    guardianName: 'Alhaji Yusuf Bello',
    guardianPhone: '+234 805 123 4455',
    guardianEmail: 'yusuf.bello@yahoo.com',
    guardianRelationship: 'Father',
    address: 'No 45, University Road, Tanke, Ilorin, Kwara State',
    stateOfOrigin: 'Kwara State'
  },
  {
    id: 'std-3',
    studentNumber: 'TAYO/2024/028',
    password: 'password123',
    firstName: 'Chidubem',
    lastName: 'Okafor',
    middleName: 'David',
    gender: 'Male',
    dateOfBirth: '2013-02-18',
    section: 'primary',
    className: 'Primary 5 Alpha',
    arm: 'Alpha',
    house: 'Ruby',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    status: 'Active',
    admissionYear: 2022,
    guardianName: 'Mrs. Ngozi Okafor',
    guardianPhone: '+234 802 888 9911',
    guardianEmail: 'ngozi.okafor@gmail.com',
    guardianRelationship: 'Mother',
    address: 'Block 3, Asa Dam Road, Ilorin, Kwara State',
    stateOfOrigin: 'Enugu State'
  },
  {
    id: 'std-4',
    studentNumber: 'TAYO/2024/035',
    password: 'password123',
    firstName: 'Amina',
    lastName: 'Suleiman',
    middleName: 'Khadijah',
    gender: 'Female',
    dateOfBirth: '2014-06-10',
    section: 'primary',
    className: 'Primary 4 Diamond',
    arm: 'Diamond',
    house: 'Topaz',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    status: 'Active',
    admissionYear: 2023,
    guardianName: 'Engr. Ibrahim Suleiman',
    guardianPhone: '+234 806 777 2200',
    guardianEmail: 'ibrahim.suleiman@gmail.com',
    guardianRelationship: 'Father',
    address: '15 Pipeline Road, Ilorin, Kwara State',
    stateOfOrigin: 'Kwara State'
  }
];

export const INITIAL_STAFF: Staff[] = [
  {
    id: 'stf-1',
    staffId: 'STF-014',
    email: 'babatunde.alabi@tayoschool.edu.ng',
    password: 'password123',
    fullName: 'Mr. Babatunde Alabi',
    gender: 'Male',
    phone: '+234 803 234 5678',
    qualification: 'B.Sc. (Ed) Mathematics (Unilorin), M.Ed',
    roleTitle: 'Senior Mathematics & Physics Tutor',
    assignedSection: 'secondary',
    assignedClasses: ['SSS 2 Science', 'SSS 1 Science', 'SSS 3 Science'],
    assignedSubjects: ['Mathematics', 'Further Mathematics', 'Physics'],
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    joinedDate: '2019-08-15'
  },
  {
    id: 'stf-2',
    staffId: 'STF-008',
    email: 'aisha.mohammed@tayoschool.edu.ng',
    password: 'password123',
    fullName: 'Mrs. Aisha Mohammed',
    gender: 'Female',
    phone: '+234 805 345 6789',
    qualification: 'B.A. (Ed) English Language, TRCN Certified',
    roleTitle: 'Head of Languages / Class Teacher SSS 2',
    assignedSection: 'secondary',
    assignedClasses: ['SSS 2 Science', 'JSS 3 Gold'],
    assignedSubjects: ['English Language', 'Literature in English'],
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    joinedDate: '2020-01-10'
  },
  {
    id: 'stf-3',
    staffId: 'STF-022',
    email: 'felicia.ogundele@tayoschool.edu.ng',
    password: 'password123',
    fullName: 'Mrs. Felicia Ogundele',
    gender: 'Female',
    phone: '+234 802 456 7890',
    qualification: 'NCE, B.Ed Primary Education',
    roleTitle: 'Lead Teacher - Primary 5 Alpha',
    assignedSection: 'primary',
    assignedClasses: ['Primary 5 Alpha'],
    assignedSubjects: ['Mathematics', 'English Studies', 'Basic Science & Tech', 'Social Studies'],
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    joinedDate: '2018-09-01'
  }
];

export const INITIAL_ADMIN: Administrator = {
  id: 'adm-1',
  adminId: 'ADM-001',
  fullName: 'Dr. (Mrs.) Folashade O. Adeyinka',
  email: 'admin@tayoschool.edu.ng',
  phone: '09076930244',
  password: 'adminpassword',
  role: 'Super Administrator',
  photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  lastLogin: '2025-01-15 08:30 AM'
};

export const INITIAL_RESULTS: StudentResultRecord[] = [
  {
    id: 'res-1',
    studentId: 'std-1',
    studentNumber: 'TAYO/2024/014',
    studentName: 'Oluwaseun Emmanuel Adeyemi',
    className: 'SSS 2 Science',
    session: '2024/2025',
    term: '1st Term',
    subjects: [
      { subject: 'Mathematics', caScore: 28, examScore: 64, totalScore: 92, grade: 'A1', position: '1st', remark: 'Distinction' },
      { subject: 'English Language', caScore: 25, examScore: 58, totalScore: 83, grade: 'A1', position: '3rd', remark: 'Distinction' },
      { subject: 'Physics', caScore: 26, examScore: 61, totalScore: 87, grade: 'A1', position: '2nd', remark: 'Distinction' },
      { subject: 'Chemistry', caScore: 24, examScore: 55, totalScore: 79, grade: 'B2', position: '4th', remark: 'Very Good' },
      { subject: 'Biology', caScore: 27, examScore: 59, totalScore: 86, grade: 'A1', position: '2nd', remark: 'Distinction' },
      { subject: 'Further Mathematics', caScore: 29, examScore: 63, totalScore: 92, grade: 'A1', position: '1st', remark: 'Distinction' },
      { subject: 'Civic Education', caScore: 26, examScore: 54, totalScore: 80, grade: 'A1', position: '5th', remark: 'Distinction' },
      { subject: 'Computer Studies', caScore: 28, examScore: 65, totalScore: 93, grade: 'A1', position: '1st', remark: 'Distinction' },
      { subject: 'Agricultural Science', caScore: 23, examScore: 52, totalScore: 75, grade: 'B2', position: '6th', remark: 'Very Good' }
    ],
    overallTotal: 767,
    overallAverage: 85.22,
    classPosition: '2nd of 34',
    teacherRemark: 'Oluwaseun is an exceptionally dedicated, sharp, and respectful student with outstanding analytical skills.',
    principalRemark: 'An admirable academic performance. Keep shining and reaching for greater heights in character and learning.',
    timesSchoolOpened: 120,
    timesPresent: 118,
    status: 'Published',
    updatedAt: '2024-12-18'
  },
  {
    id: 'res-2',
    studentId: 'std-2',
    studentNumber: 'TAYO/2024/015',
    studentName: 'Fatima Zainab Bello',
    className: 'SSS 2 Science',
    session: '2024/2025',
    term: '1st Term',
    subjects: [
      { subject: 'Mathematics', caScore: 26, examScore: 62, totalScore: 88, grade: 'A1', position: '2nd', remark: 'Distinction' },
      { subject: 'English Language', caScore: 28, examScore: 63, totalScore: 91, grade: 'A1', position: '1st', remark: 'Distinction' },
      { subject: 'Physics', caScore: 25, examScore: 58, totalScore: 83, grade: 'A1', position: '3rd', remark: 'Distinction' },
      { subject: 'Chemistry', caScore: 27, examScore: 60, totalScore: 87, grade: 'A1', position: '1st', remark: 'Distinction' },
      { subject: 'Biology', caScore: 28, examScore: 64, totalScore: 92, grade: 'A1', position: '1st', remark: 'Distinction' },
      { subject: 'Further Mathematics', caScore: 24, examScore: 52, totalScore: 76, grade: 'B2', position: '3rd', remark: 'Very Good' },
      { subject: 'Civic Education', caScore: 27, examScore: 59, totalScore: 86, grade: 'A1', position: '2nd', remark: 'Distinction' },
      { subject: 'Computer Studies', caScore: 27, examScore: 62, totalScore: 89, grade: 'A1', position: '2nd', remark: 'Distinction' },
      { subject: 'Agricultural Science', caScore: 25, examScore: 56, totalScore: 81, grade: 'A1', position: '3rd', remark: 'Distinction' }
    ],
    overallTotal: 773,
    overallAverage: 85.89,
    classPosition: '1st of 34',
    teacherRemark: 'Brilliant student with extraordinary consistency, leadership charisma, and impeccable discipline.',
    principalRemark: 'Overall best student for the term. Commendable diligence and moral fortitude.',
    timesSchoolOpened: 120,
    timesPresent: 120,
    status: 'Published',
    updatedAt: '2024-12-18'
  },
  {
    id: 'res-3',
    studentId: 'std-3',
    studentNumber: 'TAYO/2024/028',
    studentName: 'Chidubem David Okafor',
    className: 'Primary 5 Alpha',
    session: '2024/2025',
    term: '1st Term',
    subjects: [
      { subject: 'Mathematics', caScore: 27, examScore: 58, totalScore: 85, grade: 'A1', position: '2nd', remark: 'Distinction' },
      { subject: 'English Studies', caScore: 26, examScore: 55, totalScore: 81, grade: 'A1', position: '3rd', remark: 'Distinction' },
      { subject: 'Basic Science & Tech', caScore: 28, examScore: 60, totalScore: 88, grade: 'A1', position: '1st', remark: 'Distinction' },
      { subject: 'Social Studies', caScore: 25, examScore: 52, totalScore: 77, grade: 'B2', position: '4th', remark: 'Very Good' },
      { subject: 'Verbal Reasoning', caScore: 29, examScore: 62, totalScore: 91, grade: 'A1', position: '1st', remark: 'Distinction' },
      { subject: 'Quantitative Reasoning', caScore: 28, examScore: 64, totalScore: 92, grade: 'A1', position: '1st', remark: 'Distinction' },
      { subject: 'Civic Education', caScore: 24, examScore: 50, totalScore: 74, grade: 'B2', position: '5th', remark: 'Very Good' },
      { subject: 'Agricultural Science', caScore: 25, examScore: 54, totalScore: 79, grade: 'B2', position: '3rd', remark: 'Very Good' }
    ],
    overallTotal: 667,
    overallAverage: 83.38,
    classPosition: '2nd of 28',
    teacherRemark: 'Active participant in all class projects and science practicals. Very polite.',
    principalRemark: 'A delightful pupil with high promise. Well done!',
    timesSchoolOpened: 120,
    timesPresent: 119,
    status: 'Published',
    updatedAt: '2024-12-18'
  }
];

export const INITIAL_APPLICATIONS: AdmissionApplication[] = [
  {
    id: 'app-101',
    applicationNumber: 'APP-2025-042',
    fullName: 'Zubair Ayodeji Adeleke',
    dateOfBirth: '2011-08-14',
    gender: 'Male',
    section: 'secondary',
    classApplyingFor: 'JSS 1 Gold',
    previousSchool: 'Crown Nursery & Primary School, Ilorin',
    parentName: 'Barrister Kayode Adeleke',
    parentRelationship: 'Father',
    parentPhone: '+234 803 999 1122',
    parentEmail: 'k.adeleke.legal@gmail.com',
    parentOccupation: 'Legal Practitioner',
    residentialAddress: 'No. 8 Ahmadu Bello Way, GRA, Ilorin, Kwara State',
    stateOfOrigin: 'Kwara State',
    passportPhoto: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=400&auto=format&fit=crop&q=80',
    birthCertificateName: 'birth_cert_adeleke.pdf',
    previousReportCardName: 'pry6_testimonial.pdf',
    submittedAt: '2025-01-10 14:22',
    status: 'Pending'
  },
  {
    id: 'app-102',
    applicationNumber: 'APP-2025-043',
    fullName: 'Maryam Oluwakemi Babalola',
    dateOfBirth: '2015-11-03',
    gender: 'Female',
    section: 'primary',
    classApplyingFor: 'Primary 3 Emerald',
    previousSchool: 'St. Claire International Academy, Offa',
    parentName: 'Mrs. Funmilayo Babalola',
    parentRelationship: 'Mother',
    parentPhone: '+234 805 777 4433',
    parentEmail: 'funmi.babalola@gmail.com',
    parentOccupation: 'Accountant',
    residentialAddress: 'Suite 4, Harmony Estate, Fate, Ilorin',
    stateOfOrigin: 'Kwara State',
    passportPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    birthCertificateName: 'maryam_birth_certificate.jpg',
    previousReportCardName: 'pry2_report_card.pdf',
    submittedAt: '2025-01-12 09:45',
    status: 'Approved',
    decisionNotes: 'Passed entrance assessment with 88%. Admitted into Primary 3.',
    assignedStudentNumber: 'TAYO/2025/001'
  }
];

export const INITIAL_CLASSES: SchoolClass[] = [
  { id: 'cls-1', name: 'Primary 1 Alpha', section: 'primary', classTeacherName: 'Mrs. Joy Eze', classTeacherId: 'stf-4', totalStudents: 24, capacity: 30, prefectName: 'Samuel Danladi' },
  { id: 'cls-2', name: 'Primary 4 Diamond', section: 'primary', classTeacherName: 'Mr. Kehinde Salami', classTeacherId: 'stf-5', totalStudents: 26, capacity: 30, prefectName: 'Amina Suleiman' },
  { id: 'cls-3', name: 'Primary 5 Alpha', section: 'primary', classTeacherName: 'Mrs. Felicia Ogundele', classTeacherId: 'stf-3', totalStudents: 28, capacity: 30, prefectName: 'Chidubem Okafor' },
  { id: 'cls-4', name: 'JSS 1 Gold', section: 'secondary', classTeacherName: 'Mr. David Audu', classTeacherId: 'stf-6', totalStudents: 32, capacity: 35, prefectName: 'Tolani Adeleke' },
  { id: 'cls-5', name: 'JSS 3 Emerald', section: 'secondary', classTeacherName: 'Mrs. Aisha Mohammed', classTeacherId: 'stf-2', totalStudents: 30, capacity: 35, prefectName: 'Faruq Oladipo' },
  { id: 'cls-6', name: 'SSS 2 Science', section: 'secondary', classTeacherName: 'Mr. Babatunde Alabi', classTeacherId: 'stf-1', totalStudents: 34, capacity: 35, prefectName: 'Fatima Bello' }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Commencement of 2nd Term 2024/2025 Academic Session',
    content: 'All parents, students, and guardians are cordially notified that the 2nd Term commences on Monday, 8th January. Full academic activities resume immediately across both Primary and Secondary sections. Boarders must report before 5:00 PM on Sunday.',
    category: 'Academic',
    publishedDate: '2025-01-05',
    targetAudience: 'All',
    isImportant: true,
    author: 'Principal\'s Office'
  },
  {
    id: 'ann-2',
    title: 'Victory at the Kwara State Inter-School STEM & Robotics Challenge',
    content: 'Congratulations to our SSS 2 Science students who clinched 1st Place at the annual Kwara State Ministry of Education STEM Challenge held at Kwara State Banquet Hall, Ilorin! T\'AYO School will represent Kwara State at the National Finals in Abuja.',
    category: 'Secondary',
    publishedDate: '2025-01-14',
    targetAudience: 'All',
    isImportant: true,
    author: 'Head of Science Department'
  },
  {
    id: 'ann-3',
    title: 'Primary School Annual Cultural & Book Fair 2025',
    content: 'Our vibrant cultural showcase highlighting rich Nigerian heritage (Yoruba, Hausa, Igbo, Nupe, Bariba) and young reader awards will hold on Friday, 14th February. Parents are encouraged to attend in traditional attire.',
    category: 'Primary',
    publishedDate: '2025-01-16',
    targetAudience: 'Parents',
    isImportant: false,
    author: 'Primary Section Coordinator'
  },
  {
    id: 'ann-4',
    title: 'Online Result Portal & Terminal Report Cards Published',
    content: 'The terminal results for the 1st Term 2024/2025 academic session have been reviewed and published. Students and parents can log into the student dashboard using their student number and passkey to view and print official report cards.',
    category: 'Academic',
    publishedDate: '2024-12-20',
    targetAudience: 'Students',
    isImportant: false,
    author: 'ICT & Examination Committee'
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'State-of-the-Art Science Laboratory',
    category: 'Science & Arts',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
    description: 'Senior secondary students conducting chemical qualitative analyses in our fully equipped science laboratory in Ilorin.',
    date: '2024-11-12'
  },
  {
    id: 'gal-2',
    title: 'Primary Section Reading Hub & Library',
    category: 'Campus',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    description: 'Pupils immersed in our rich digital and physical reading room nurturing lifelong literacy.',
    date: '2024-10-24'
  },
  {
    id: 'gal-3',
    title: 'Annual Inter-House Sports Festival',
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
    description: 'Emerald and Ruby houses battling out on track and field events at the school sports complex.',
    date: '2024-11-28'
  },
  {
    id: 'gal-4',
    title: 'Kwara Cultural Day Celebration',
    category: 'Cultural Day',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80',
    description: 'Pupils and students proudly celebrating diverse Nigerian cultures, attires, and traditional dances.',
    date: '2024-05-18'
  },
  {
    id: 'gal-5',
    title: 'Graduation & Valedictory Service',
    category: 'Graduation',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    description: 'Celebrating the valedictory class as they step into university matriculation with excellence and pride.',
    date: '2024-07-20'
  },
  {
    id: 'gal-6',
    title: 'Modern ICT & Coding Hub',
    category: 'Science & Arts',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    description: 'Hands-on coding, computer science and digital literacy training for Junior and Senior school learners.',
    date: '2024-09-15'
  }
];

// Calculation helper for Nigerian secondary and primary grading standards
export function computeNigerianGrade(total: number): {
  grade: 'A1' | 'B2' | 'B3' | 'C4' | 'C5' | 'C6' | 'D7' | 'E8' | 'F9';
  remark: string;
} {
  if (total >= 75) return { grade: 'A1', remark: 'Distinction' };
  if (total >= 70) return { grade: 'B2', remark: 'Very Good' };
  if (total >= 65) return { grade: 'B3', remark: 'Good' };
  if (total >= 60) return { grade: 'C4', remark: 'Credit' };
  if (total >= 55) return { grade: 'C5', remark: 'Credit' };
  if (total >= 50) return { grade: 'C6', remark: 'Credit' };
  if (total >= 45) return { grade: 'D7', remark: 'Pass' };
  if (total >= 40) return { grade: 'E8', remark: 'Pass' };
  return { grade: 'F9', remark: 'Fail' };
}

export const OFFICIAL_PAYMENT_ACCOUNT = {
  bankName: 'Moniepoint',
  accountNumber: '9076930244',
  accountName: 'Abbas Taofiq Ayomide',
  schoolPhone: '09076930244'
};

export const INITIAL_FEE_PAYMENTS: FeePayment[] = [
  {
    id: 'pay-101',
    studentId: 'std-1',
    studentNumber: 'TAYO/2024/014',
    studentName: 'Oluwaseun Emmanuel Adeyemi',
    className: 'SSS 2 Science',
    session: '2024/2025',
    term: '1st Term',
    amount: 105000,
    totalFees: 105000,
    status: 'Verified',
    payerName: 'Dr. Michael Adeyemi',
    payerPhone: '09076930244',
    paymentMethod: 'Moniepoint Direct Transfer',
    bankName: 'Moniepoint',
    accountNumber: '9076930244',
    accountName: 'Abbas Taofiq Ayomide',
    transactionRef: 'MP-2024-884210',
    paymentDate: '2024-09-12',
    receiptNote: 'Full term school fees cleared for 1st term.',
    createdAt: '2024-09-12T09:30:00.000Z'
  },
  {
    id: 'pay-102',
    studentId: 'std-2',
    studentNumber: 'TAYO/2024/015',
    studentName: 'Fatima Zainab Bello',
    className: 'SSS 2 Science',
    session: '2024/2025',
    term: '1st Term',
    amount: 105000,
    totalFees: 105000,
    status: 'Verified',
    payerName: 'Alhaji Zubair Bello',
    payerPhone: '09076930244',
    paymentMethod: 'Bank Transfer (Moniepoint)',
    bankName: 'Moniepoint',
    accountNumber: '9076930244',
    accountName: 'Abbas Taofiq Ayomide',
    transactionRef: 'MP-2024-912403',
    paymentDate: '2024-09-14',
    receiptNote: 'Fees verified and approved by accounts department.',
    createdAt: '2024-09-14T11:15:00.000Z'
  }
];

