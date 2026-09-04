import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  writeBatch,
  Unsubscribe
} from 'firebase/firestore';
import { db, isFirebaseInitialized } from './config';
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
import { SchoolConfig } from '../services/storage';

export const COLLECTIONS = {
  STUDENTS: 'students',
  STAFF: 'staff',
  ADMINISTRATORS: 'administrators',
  ADMISSION_APPLICATIONS: 'admission_applications',
  CLASSES: 'classes',
  RESULTS: 'results',
  ANNOUNCEMENTS: 'announcements',
  ACADEMIC_SESSIONS: 'academic_sessions',
  FEE_PAYMENTS: 'fee_payments',
  SCHOOL_CONFIG: 'school_config',
  GALLERY: 'gallery'
};

export const FirestoreService = {
  /**
   * Initial seeding: If Firestore collections are empty in the new project,
   * batch-populate with initial institutional data.
   */
  async seedInitialDataIfEmpty(): Promise<boolean> {
    if (!isFirebaseInitialized || !db) return false;

    try {
      const studentsRef = collection(db, COLLECTIONS.STUDENTS);
      const snapshot = await getDocs(studentsRef);

      if (!snapshot.empty) {
        // Data already seeded
        return false;
      }

      console.log("⚡ Seeding initial T'AYO School institutional dataset to Firestore...");
      const batch = writeBatch(db);

      // 1. Students
      INITIAL_STUDENTS.forEach(student => {
        const ref = doc(db, COLLECTIONS.STUDENTS, student.id);
        batch.set(ref, student);
      });

      // 2. Staff
      INITIAL_STAFF.forEach(staffMember => {
        const ref = doc(db, COLLECTIONS.STAFF, staffMember.id);
        batch.set(ref, staffMember);
      });

      // 3. Administrator
      const adminRef = doc(db, COLLECTIONS.ADMINISTRATORS, INITIAL_ADMIN.id);
      batch.set(adminRef, INITIAL_ADMIN);

      // 4. Classes
      INITIAL_CLASSES.forEach(cls => {
        const ref = doc(db, COLLECTIONS.CLASSES, cls.id);
        batch.set(ref, cls);
      });

      // 5. Results
      INITIAL_RESULTS.forEach(res => {
        const ref = doc(db, COLLECTIONS.RESULTS, res.id);
        batch.set(ref, res);
      });

      // 6. Admission Applications
      INITIAL_APPLICATIONS.forEach(app => {
        const ref = doc(db, COLLECTIONS.ADMISSION_APPLICATIONS, app.id);
        batch.set(ref, app);
      });

      // 7. Announcements
      INITIAL_ANNOUNCEMENTS.forEach(ann => {
        const ref = doc(db, COLLECTIONS.ANNOUNCEMENTS, ann.id);
        batch.set(ref, ann);
      });

      // 8. Gallery
      INITIAL_GALLERY.forEach(item => {
        const ref = doc(db, COLLECTIONS.GALLERY, item.id);
        batch.set(ref, item);
      });

      // 9. Fee Payments
      INITIAL_FEE_PAYMENTS.forEach(payment => {
        const ref = doc(db, COLLECTIONS.FEE_PAYMENTS, payment.id);
        batch.set(ref, payment);
      });

      // 10. School Config & Sessions
      const configRef = doc(db, COLLECTIONS.SCHOOL_CONFIG, 'current');
      batch.set(configRef, {
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
      }, { merge: true });

      const sessionRef = doc(db, COLLECTIONS.ACADEMIC_SESSIONS, '2024_2025');
      batch.set(sessionRef, {
        id: '2024_2025',
        sessionName: '2024/2025',
        activeTerm: '1st Term',
        isCurrent: true,
        resumptionDate: '2024-09-09',
        vacationDate: '2024-12-20'
      });

      await batch.commit();
      console.log("✅ T'AYO School data successfully seeded to Cloud Firestore!");
      return true;
    } catch (error) {
      console.warn('Firestore seeding notice:', error);
      return false;
    }
  },

  // -------------------------------------------------------------
  // STUDENTS
  // -------------------------------------------------------------
  async getStudents(): Promise<Student[]> {
    if (!isFirebaseInitialized || !db) return INITIAL_STUDENTS;
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.STUDENTS));
      if (snap.empty) return INITIAL_STUDENTS;
      return snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Student));
    } catch (err) {
      console.warn('Error reading students from Firestore:', err);
      return INITIAL_STUDENTS;
    }
  },

  async saveStudent(student: Student): Promise<void> {
    if (!isFirebaseInitialized || !db) return;
    try {
      const dataToSave = { ...student };
      // Security: NEVER persist plain-text passwords to Firestore
      delete (dataToSave as any).password;
      const ref = doc(db, COLLECTIONS.STUDENTS, student.id);
      await setDoc(ref, dataToSave, { merge: true });
    } catch (err) {
      console.warn(`Error saving student ${student.id} to Firestore:`, err);
    }
  },

  async deleteStudent(studentId: string): Promise<void> {
    if (!isFirebaseInitialized || !db) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.STUDENTS, studentId));
    } catch (err) {
      console.warn(`Error deleting student ${studentId} from Firestore:`, err);
    }
  },

  // -------------------------------------------------------------
  // STAFF
  // -------------------------------------------------------------
  async getStaff(): Promise<Staff[]> {
    if (!isFirebaseInitialized || !db) return INITIAL_STAFF;
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.STAFF));
      if (snap.empty) return INITIAL_STAFF;
      return snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Staff));
    } catch (err) {
      console.warn('Error reading staff from Firestore:', err);
      return INITIAL_STAFF;
    }
  },

  async saveStaff(staffMember: Staff): Promise<void> {
    if (!isFirebaseInitialized || !db) return;
    try {
      const dataToSave = { ...staffMember };
      delete (dataToSave as any).password;
      const ref = doc(db, COLLECTIONS.STAFF, staffMember.id);
      await setDoc(ref, dataToSave, { merge: true });
    } catch (err) {
      console.warn(`Error saving staff ${staffMember.id} to Firestore:`, err);
    }
  },

  async deleteStaff(staffId: string): Promise<void> {
    if (!isFirebaseInitialized || !db) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.STAFF, staffId));
    } catch (err) {
      console.warn(`Error deleting staff ${staffId} from Firestore:`, err);
    }
  },

  // -------------------------------------------------------------
  // ADMINISTRATORS
  // -------------------------------------------------------------
  async getAdministrator(): Promise<Administrator> {
    if (!isFirebaseInitialized || !db) return INITIAL_ADMIN;
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.ADMINISTRATORS));
      if (snap.empty) return INITIAL_ADMIN;
      return { ...snap.docs[0].data(), id: snap.docs[0].id } as Administrator;
    } catch (err) {
      console.warn('Error reading administrator from Firestore:', err);
      return INITIAL_ADMIN;
    }
  },

  async saveAdministrator(admin: Administrator): Promise<void> {
    if (!isFirebaseInitialized || !db) return;
    try {
      const dataToSave = { ...admin };
      delete (dataToSave as any).password;
      const ref = doc(db, COLLECTIONS.ADMINISTRATORS, admin.id);
      await setDoc(ref, dataToSave, { merge: true });
    } catch (err) {
      console.warn(`Error saving administrator ${admin.id} to Firestore:`, err);
    }
  },

  // -------------------------------------------------------------
  // CLASSES
  // -------------------------------------------------------------
  async getClasses(): Promise<SchoolClass[]> {
    if (!isFirebaseInitialized || !db) return INITIAL_CLASSES;
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.CLASSES));
      if (snap.empty) return INITIAL_CLASSES;
      return snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as SchoolClass));
    } catch (err) {
      console.warn('Error reading classes from Firestore:', err);
      return INITIAL_CLASSES;
    }
  },

  async saveClass(cls: SchoolClass): Promise<void> {
    if (!isFirebaseInitialized || !db) return;
    try {
      const ref = doc(db, COLLECTIONS.CLASSES, cls.id);
      await setDoc(ref, cls, { merge: true });
    } catch (err) {
      console.warn(`Error saving class ${cls.id} to Firestore:`, err);
    }
  },

  async deleteClass(classId: string): Promise<void> {
    if (!isFirebaseInitialized || !db) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.CLASSES, classId));
    } catch (err) {
      console.warn(`Error deleting class ${classId} from Firestore:`, err);
    }
  },

  // -------------------------------------------------------------
  // RESULTS
  // -------------------------------------------------------------
  async getResults(): Promise<StudentResultRecord[]> {
    if (!isFirebaseInitialized || !db) return INITIAL_RESULTS;
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.RESULTS));
      if (snap.empty) return INITIAL_RESULTS;
      return snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as StudentResultRecord));
    } catch (err) {
      console.warn('Error reading results from Firestore:', err);
      return INITIAL_RESULTS;
    }
  },

  async saveResult(res: StudentResultRecord): Promise<void> {
    if (!isFirebaseInitialized || !db) return;
    try {
      const ref = doc(db, COLLECTIONS.RESULTS, res.id);
      await setDoc(ref, res, { merge: true });
    } catch (err) {
      console.warn(`Error saving result ${res.id} to Firestore:`, err);
    }
  },

  async deleteResult(resultId: string): Promise<void> {
    if (!isFirebaseInitialized || !db) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.RESULTS, resultId));
    } catch (err) {
      console.warn(`Error deleting result ${resultId} from Firestore:`, err);
    }
  },

  // -------------------------------------------------------------
  // ADMISSION APPLICATIONS
  // -------------------------------------------------------------
  async getApplications(): Promise<AdmissionApplication[]> {
    if (!isFirebaseInitialized || !db) return INITIAL_APPLICATIONS;
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.ADMISSION_APPLICATIONS));
      if (snap.empty) return INITIAL_APPLICATIONS;
      return snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as AdmissionApplication));
    } catch (err) {
      console.warn('Error reading admission applications from Firestore:', err);
      return INITIAL_APPLICATIONS;
    }
  },

  async saveApplication(app: AdmissionApplication): Promise<void> {
    if (!isFirebaseInitialized || !db) return;
    try {
      const ref = doc(db, COLLECTIONS.ADMISSION_APPLICATIONS, app.id);
      await setDoc(ref, app, { merge: true });
    } catch (err) {
      console.warn(`Error saving admission application ${app.id} to Firestore:`, err);
    }
  },

  // -------------------------------------------------------------
  // ANNOUNCEMENTS
  // -------------------------------------------------------------
  async getAnnouncements(): Promise<Announcement[]> {
    if (!isFirebaseInitialized || !db) return INITIAL_ANNOUNCEMENTS;
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.ANNOUNCEMENTS));
      if (snap.empty) return INITIAL_ANNOUNCEMENTS;
      return snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Announcement));
    } catch (err) {
      console.warn('Error reading announcements from Firestore:', err);
      return INITIAL_ANNOUNCEMENTS;
    }
  },

  async saveAnnouncement(ann: Announcement): Promise<void> {
    if (!isFirebaseInitialized || !db) return;
    try {
      const ref = doc(db, COLLECTIONS.ANNOUNCEMENTS, ann.id);
      await setDoc(ref, ann, { merge: true });
    } catch (err) {
      console.warn(`Error saving announcement ${ann.id} to Firestore:`, err);
    }
  },

  async deleteAnnouncement(announcementId: string): Promise<void> {
    if (!isFirebaseInitialized || !db) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.ANNOUNCEMENTS, announcementId));
    } catch (err) {
      console.warn(`Error deleting announcement ${announcementId} from Firestore:`, err);
    }
  },

  // -------------------------------------------------------------
  // FEE PAYMENTS
  // -------------------------------------------------------------
  async getFeePayments(): Promise<FeePayment[]> {
    if (!isFirebaseInitialized || !db) return INITIAL_FEE_PAYMENTS;
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.FEE_PAYMENTS));
      if (snap.empty) return INITIAL_FEE_PAYMENTS;
      return snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as FeePayment));
    } catch (err) {
      console.warn('Error reading fee payments from Firestore:', err);
      return INITIAL_FEE_PAYMENTS;
    }
  },

  async saveFeePayment(payment: FeePayment): Promise<void> {
    if (!isFirebaseInitialized || !db) return;
    try {
      const ref = doc(db, COLLECTIONS.FEE_PAYMENTS, payment.id);
      await setDoc(ref, payment, { merge: true });
    } catch (err) {
      console.warn(`Error saving fee payment ${payment.id} to Firestore:`, err);
    }
  },

  // -------------------------------------------------------------
  // CONFIG & SESSIONS
  // -------------------------------------------------------------
  async getConfig(): Promise<SchoolConfig | null> {
    if (!isFirebaseInitialized || !db) return null;
    try {
      const snap = await getDoc(doc(db, COLLECTIONS.SCHOOL_CONFIG, 'current'));
      if (snap.exists()) {
        return snap.data() as SchoolConfig;
      }
      return null;
    } catch (err) {
      console.warn('Error reading config from Firestore:', err);
      return null;
    }
  },

  async saveConfig(cfg: SchoolConfig): Promise<void> {
    if (!isFirebaseInitialized || !db) return;
    try {
      const ref = doc(db, COLLECTIONS.SCHOOL_CONFIG, 'current');
      await setDoc(ref, cfg, { merge: true });
    } catch (err) {
      console.warn('Error saving school config to Firestore:', err);
    }
  },

  // -------------------------------------------------------------
  // GALLERY
  // -------------------------------------------------------------
  async getGallery(): Promise<GalleryItem[]> {
    if (!isFirebaseInitialized || !db) return INITIAL_GALLERY;
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.GALLERY));
      if (snap.empty) return INITIAL_GALLERY;
      return snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as GalleryItem));
    } catch (err) {
      console.warn('Error reading gallery from Firestore:', err);
      return INITIAL_GALLERY;
    }
  },

  async saveGalleryItem(item: GalleryItem): Promise<void> {
    if (!isFirebaseInitialized || !db) return;
    try {
      const ref = doc(db, COLLECTIONS.GALLERY, item.id);
      await setDoc(ref, item, { merge: true });
    } catch (err) {
      console.warn(`Error saving gallery item ${item.id} to Firestore:`, err);
    }
  },

  // -------------------------------------------------------------
  // REAL-TIME LISTENERS
  // -------------------------------------------------------------
  subscribeToAnnouncements(onUpdate: (items: Announcement[]) => void): Unsubscribe | null {
    if (!isFirebaseInitialized || !db) return null;
    try {
      return onSnapshot(
        collection(db, COLLECTIONS.ANNOUNCEMENTS),
        snap => {
          const items = snap.docs.map(d => ({ ...d.data(), id: d.id } as Announcement));
          onUpdate(items);
        },
        error => {
          console.warn('Announcements snapshot listener notice:', error.code || error.message);
        }
      );
    } catch (err) {
      console.warn('Error subscribing to announcements:', err);
      return null;
    }
  },

  subscribeToFeePayments(onUpdate: (items: FeePayment[]) => void): Unsubscribe | null {
    if (!isFirebaseInitialized || !db) return null;
    try {
      return onSnapshot(
        collection(db, COLLECTIONS.FEE_PAYMENTS),
        snap => {
          const items = snap.docs.map(d => ({ ...d.data(), id: d.id } as FeePayment));
          onUpdate(items);
        },
        error => {
          // Expected when unauthenticated or role does not have financial permissions
          console.warn('Fee payments snapshot listener notice:', error.code || error.message);
        }
      );
    } catch (err) {
      console.warn('Error subscribing to fee payments:', err);
      return null;
    }
  },

  subscribeToConfig(onUpdate: (cfg: SchoolConfig) => void): Unsubscribe | null {
    if (!isFirebaseInitialized || !db) return null;
    try {
      return onSnapshot(
        doc(db, COLLECTIONS.SCHOOL_CONFIG, 'current'),
        snap => {
          if (snap.exists()) {
            onUpdate(snap.data() as SchoolConfig);
          }
        },
        error => {
          console.warn('School config snapshot listener notice:', error.code || error.message);
        }
      );
    } catch (err) {
      console.warn('Error subscribing to school config:', err);
      return null;
    }
  }
};
