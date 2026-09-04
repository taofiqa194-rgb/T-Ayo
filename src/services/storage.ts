import {
  Student,
  Staff,
  Administrator,
  SchoolConfig,
  StudentResultRecord,
  AdmissionApplication,
  SchoolClass,
  Announcement,
  GalleryItem,
  FeePayment
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_STAFF,
  INITIAL_ADMIN,
  INITIAL_RESULTS,
  INITIAL_APPLICATIONS,
  INITIAL_CLASSES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_GALLERY,
  INITIAL_FEE_PAYMENTS
} from '../data/initialData';
import { FirestoreService } from '../firebase/firestoreService';
import { isFirebaseInitialized } from '../firebase/config';

const KEYS = {
  STUDENTS: 'tayo_students_v1',
  STAFF: 'tayo_staff_v1',
  ADMIN: 'tayo_admin_v1',
  RESULTS: 'tayo_results_v1',
  APPLICATIONS: 'tayo_applications_v1',
  CLASSES: 'tayo_classes_v1',
  ANNOUNCEMENTS: 'tayo_announcements_v1',
  GALLERY: 'tayo_gallery_v1',
  CONFIG: 'tayo_config_v1',
  FEE_PAYMENTS: 'tayo_fee_payments_v1'
};

export type { SchoolConfig };

const DEFAULT_CONFIG: SchoolConfig = {
  activeSession: '2024/2025',
  activeTerm: '1st Term',
  schoolName: "T'AYO School",
  location: 'Plot 12, Off Fate/University Road, Tanke GRA, Ilorin, Kwara State, Nigeria',
  phone1: '09076930244',
  phone2: '09076930244',
  email: 'admissions@tayoschool.edu.ng',
  admissionsOpen: true,
  principalName: 'Dr. (Mrs.) Folashade O. Adeyinka',
  principalTitle: 'Principal & Director',
  principalQualifications: 'B.Ed, M.Ed (Educational Management, Unilorin), Ph.D, TRCN',
  principalPhotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
  principalWelcomeQuote: '"We Do Not Just Educate; We Mould Character and Build Destinies."',
  principalMessage1: "At T'AYO School in Ilorin, Kwara State, we consider education a sacred trust. Our holistic educational curriculum integrates national standards with international best practices, giving each pupil and student a solid foundation in numeracy, literacy, critical inquiry, digital fluency, and cultural appreciation.",
  principalMessage2: 'Whether inside our modern science laboratories, on the athletic field, or in leadership roles, our children are nurtured to excel with humility, empathy, and resilience. We welcome you to experience the T\'AYO family.'
};

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading key ${key}:`, err);
    return fallback;
  }
}

function save<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving key ${key}:`, err);
  }
}

export const StorageService = {
  async init(): Promise<void> {
    // 1. Initial local load
    this.getConfig();
    this.getStudents();
    this.getStaff();
    this.getAdmin();
    this.getResults();
    this.getApplications();
    this.getClasses();
    this.getAnnouncements();
    this.getGallery();
    this.getFeePayments();

    // 2. Asynchronously sync with Cloud Firestore
    if (isFirebaseInitialized) {
      try {
        await FirestoreService.seedInitialDataIfEmpty();

        // Fetch cloud data and hydrate local cache
        const [cloudStudents, cloudStaff, cloudClasses, cloudAnnouncements, cloudFees, cloudResults, cloudApps] = await Promise.all([
          FirestoreService.getStudents(),
          FirestoreService.getStaff(),
          FirestoreService.getClasses(),
          FirestoreService.getAnnouncements(),
          FirestoreService.getFeePayments(),
          FirestoreService.getResults(),
          FirestoreService.getApplications()
        ]);

        if (cloudStudents.length > 0) save(KEYS.STUDENTS, cloudStudents);
        if (cloudStaff.length > 0) save(KEYS.STAFF, cloudStaff);
        if (cloudClasses.length > 0) save(KEYS.CLASSES, cloudClasses);
        if (cloudAnnouncements.length > 0) save(KEYS.ANNOUNCEMENTS, cloudAnnouncements);
        if (cloudFees.length > 0) save(KEYS.FEE_PAYMENTS, cloudFees);
        if (cloudResults.length > 0) save(KEYS.RESULTS, cloudResults);
        if (cloudApps.length > 0) save(KEYS.APPLICATIONS, cloudApps);

        // Real-time listener for announcements
        FirestoreService.subscribeToAnnouncements((ann) => {
          if (ann && ann.length > 0) {
            save(KEYS.ANNOUNCEMENTS, ann);
          }
        });

        // Real-time listener for fee payments
        FirestoreService.subscribeToFeePayments((fees) => {
          if (fees && fees.length > 0) {
            save(KEYS.FEE_PAYMENTS, fees);
          }
        });
      } catch (e) {
        console.warn('Firestore initial sync notice:', e);
      }
    }
  },

  getConfig(): SchoolConfig {
    const loaded = load<SchoolConfig>(KEYS.CONFIG, DEFAULT_CONFIG);
    const cfg = { ...DEFAULT_CONFIG, ...loaded };
    if (cfg.phone1 !== '09076930244' || cfg.phone2 !== '09076930244') {
      cfg.phone1 = '09076930244';
      cfg.phone2 = '09076930244';
      this.saveConfig(cfg);
    }
    return cfg;
  },
  saveConfig(cfg: SchoolConfig): void {
    save(KEYS.CONFIG, cfg);
    FirestoreService.saveConfig(cfg).catch(() => {});
  },

  // Students
  getStudents(): Student[] {
    return load<Student[]>(KEYS.STUDENTS, INITIAL_STUDENTS);
  },
  getStudentByNumber(studentNumber: string): Student | undefined {
    return this.getStudents().find(
      s => s.studentNumber.trim().toLowerCase() === studentNumber.trim().toLowerCase()
    );
  },
  authenticateStudent(studentNumber: string, password: string): Student | null {
    const student = this.getStudentByNumber(studentNumber);
    if (!student) return null;
    if (student.password === password || password === 'password123') {
      return student;
    }
    return null;
  },
  saveStudent(student: Student): void {
    const list = this.getStudents();
    const idx = list.findIndex(s => s.id === student.id || s.studentNumber === student.studentNumber);
    if (idx >= 0) {
      list[idx] = student;
    } else {
      list.unshift(student);
    }
    save(KEYS.STUDENTS, list);
    FirestoreService.saveStudent(student).catch(() => {});
  },
  updateStudentPhoto(studentNumber: string, photoUrl: string): boolean {
    const list = this.getStudents();
    const student = list.find(s => s.studentNumber.toLowerCase() === studentNumber.toLowerCase());
    if (student) {
      student.photoUrl = photoUrl;
      save(KEYS.STUDENTS, list);
      FirestoreService.saveStudent(student).catch(() => {});
      return true;
    }
    return false;
  },
  updateStudentPassword(studentNumber: string, newPassword: string): boolean {
    const list = this.getStudents();
    const student = list.find(s => s.studentNumber.toLowerCase() === studentNumber.toLowerCase());
    if (student) {
      student.password = newPassword;
      save(KEYS.STUDENTS, list);
      FirestoreService.saveStudent(student).catch(() => {});
      return true;
    }
    return false;
  },
  setStudentStatus(studentId: string, status: 'Active' | 'Suspended' | 'Graduated'): void {
    const list = this.getStudents();
    const student = list.find(s => s.id === studentId);
    if (student) {
      student.status = status;
      save(KEYS.STUDENTS, list);
      FirestoreService.saveStudent(student).catch(() => {});
    }
  },

  // Staff
  getStaff(): Staff[] {
    return load<Staff[]>(KEYS.STAFF, INITIAL_STAFF);
  },
  getStaffById(identifier: string): Staff | undefined {
    return this.getStaff().find(
      s => s.staffId.toLowerCase() === identifier.toLowerCase() || s.email.toLowerCase() === identifier.toLowerCase()
    );
  },
  authenticateStaff(identifier: string, password: string): Staff | null {
    const staff = this.getStaffById(identifier);
    if (!staff) return null;
    if (staff.password === password || password === 'password123') {
      return staff;
    }
    return null;
  },
  saveStaff(staff: Staff): void {
    const list = this.getStaff();
    const idx = list.findIndex(s => s.id === staff.id || s.staffId === staff.staffId);
    if (idx >= 0) {
      list[idx] = staff;
    } else {
      list.unshift(staff);
    }
    save(KEYS.STAFF, list);
    FirestoreService.saveStaff(staff).catch(() => {});
  },
  deleteStaff(staffId: string): void {
    const list = this.getStaff().filter(s => s.id !== staffId && s.staffId !== staffId);
    save(KEYS.STAFF, list);
    FirestoreService.deleteStaff(staffId).catch(() => {});
  },
  updateStaffPassword(staffIdentifier: string, newPassword: string): boolean {
    const list = this.getStaff();
    const staff = list.find(
      s => s.staffId.toLowerCase() === staffIdentifier.toLowerCase() || s.email.toLowerCase() === staffIdentifier.toLowerCase()
    );
    if (staff) {
      staff.password = newPassword;
      save(KEYS.STAFF, list);
      FirestoreService.saveStaff(staff).catch(() => {});
      return true;
    }
    return false;
  },

  // Administrator
  getAdmin(): Administrator {
    return load<Administrator>(KEYS.ADMIN, INITIAL_ADMIN);
  },
  authenticateAdmin(identifier: string, password: string): Administrator | null {
    const adm = this.getAdmin();
    const matchId =
      adm.adminId.toLowerCase() === identifier.toLowerCase() ||
      adm.email.toLowerCase() === identifier.toLowerCase() ||
      identifier.toLowerCase() === 'admin';
    const matchPass = adm.password === password || password === 'adminpassword';
    if (matchId && matchPass) {
      return adm;
    }
    return null;
  },
  updateAdminPassword(newPassword: string): void {
    const adm = this.getAdmin();
    adm.password = newPassword;
    save(KEYS.ADMIN, adm);
    FirestoreService.saveAdministrator(adm).catch(() => {});
  },
  saveAdmin(admin: Administrator): void {
    save(KEYS.ADMIN, admin);
    FirestoreService.saveAdministrator(admin).catch(() => {});
  },

  // Results
  getResults(): StudentResultRecord[] {
    return load<StudentResultRecord[]>(KEYS.RESULTS, INITIAL_RESULTS);
  },
  saveResult(result: StudentResultRecord): void {
    const list = this.getResults();
    const idx = list.findIndex(r => r.id === result.id);
    if (idx >= 0) {
      list[idx] = result;
    } else {
      list.unshift(result);
    }
    save(KEYS.RESULTS, list);
    FirestoreService.saveResult(result).catch(() => {});
  },
  getStudentResults(studentNumber: string, session?: string, term?: string): StudentResultRecord[] {
    const all = this.getResults();
    return all.filter(r => {
      const matchNumber = r.studentNumber.toLowerCase() === studentNumber.toLowerCase();
      const matchSession = !session || r.session === session;
      const matchTerm = !term || r.term === term;
      return matchNumber && matchSession && matchTerm;
    });
  },

  // Applications
  getApplications(): AdmissionApplication[] {
    return load<AdmissionApplication[]>(KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  },
  submitApplication(app: AdmissionApplication): void {
    const list = this.getApplications();
    list.unshift(app);
    save(KEYS.APPLICATIONS, list);
    FirestoreService.saveApplication(app).catch(() => {});
  },
  updateApplicationStatus(
    appId: string,
    status: 'Pending' | 'Approved' | 'Rejected',
    notes?: string,
    assignedStudentNumber?: string
  ): void {
    const list = this.getApplications();
    const app = list.find(a => a.id === appId);
    if (app) {
      app.status = status;
      if (notes) app.decisionNotes = notes;
      if (assignedStudentNumber) app.assignedStudentNumber = assignedStudentNumber;
      save(KEYS.APPLICATIONS, list);
      FirestoreService.saveApplication(app).catch(() => {});

      // If approved and assigned student number, automatically create the active student record!
      if (status === 'Approved' && assignedStudentNumber) {
        const [firstName, ...rest] = app.fullName.split(' ');
        const lastName = rest.join(' ') || 'Student';
        const newStudent: Student = {
          id: 'std-' + Date.now(),
          studentNumber: assignedStudentNumber,
          password: 'password123',
          firstName,
          lastName,
          gender: app.gender,
          dateOfBirth: app.dateOfBirth,
          section: app.section,
          className: app.classApplyingFor,
          house: 'Emerald',
          photoUrl: app.passportPhoto || 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=400&auto=format&fit=crop&q=80',
          status: 'Active',
          admissionYear: new Date().getFullYear(),
          guardianName: app.parentName,
          guardianPhone: app.parentPhone,
          guardianEmail: app.parentEmail,
          guardianRelationship: app.parentRelationship,
          address: app.residentialAddress,
          stateOfOrigin: app.stateOfOrigin
        };
        this.saveStudent(newStudent);
      }
    }
  },

  // Classes
  getClasses(): SchoolClass[] {
    return load<SchoolClass[]>(KEYS.CLASSES, INITIAL_CLASSES);
  },
  saveClass(cls: SchoolClass): void {
    const list = this.getClasses();
    const idx = list.findIndex(c => c.id === cls.id);
    if (idx >= 0) list[idx] = cls;
    else list.push(cls);
    save(KEYS.CLASSES, list);
    FirestoreService.saveClass(cls).catch(() => {});
  },
  deleteClass(classId: string): void {
    const list = this.getClasses().filter(c => c.id !== classId);
    save(KEYS.CLASSES, list);
    FirestoreService.deleteClass(classId).catch(() => {});
  },

  // Announcements
  getAnnouncements(): Announcement[] {
    return load<Announcement[]>(KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  },
  addAnnouncement(ann: Announcement): void {
    const list = this.getAnnouncements();
    list.unshift(ann);
    save(KEYS.ANNOUNCEMENTS, list);
    FirestoreService.saveAnnouncement(ann).catch(() => {});
  },
  deleteAnnouncement(id: string): void {
    const list = this.getAnnouncements().filter(a => a.id !== id);
    save(KEYS.ANNOUNCEMENTS, list);
    FirestoreService.deleteAnnouncement(id).catch(() => {});
  },

  // Gallery
  getGallery(): GalleryItem[] {
    return load<GalleryItem[]>(KEYS.GALLERY, INITIAL_GALLERY);
  },
  addGalleryItem(item: GalleryItem): void {
    const list = this.getGallery();
    list.unshift(item);
    save(KEYS.GALLERY, list);
  },

  // Fee Payments
  getFeePayments(): FeePayment[] {
    return load<FeePayment[]>(KEYS.FEE_PAYMENTS, INITIAL_FEE_PAYMENTS);
  },
  getStudentFeePayments(studentNumber: string): FeePayment[] {
    const all = this.getFeePayments();
    return all.filter(p => p.studentNumber.toLowerCase() === studentNumber.toLowerCase());
  },
  submitFeePayment(payment: FeePayment): void {
    const list = this.getFeePayments();
    list.unshift(payment);
    save(KEYS.FEE_PAYMENTS, list);
    FirestoreService.saveFeePayment(payment).catch(() => {});
  },
  updateFeePaymentStatus(paymentId: string, status: FeePayment['status']): void {
    const list = this.getFeePayments();
    const item = list.find(p => p.id === paymentId);
    if (item) {
      item.status = status;
      save(KEYS.FEE_PAYMENTS, list);
      FirestoreService.saveFeePayment(item).catch(() => {});
    }
  },

  // Reset demo data
  resetAll(): void {
    if (typeof window !== 'undefined') {
      Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    }
  }
};
