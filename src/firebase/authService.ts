import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, isFirebaseInitialized } from './config';
import { Student, Staff, Administrator } from '../types';
import { FirestoreService } from './firestoreService';
import { StorageService } from '../services/storage';

function formatStudentEmail(studentNumber: string): string {
  const clean = studentNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `std_${clean}@tayoschool.edu.ng`;
}

function formatStaffEmail(staffIdOrEmail: string): string {
  if (staffIdOrEmail.includes('@')) return staffIdOrEmail;
  const clean = staffIdOrEmail.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `stf_${clean}@tayoschool.edu.ng`;
}

function formatAdminEmail(adminIdOrEmail: string): string {
  if (adminIdOrEmail.includes('@')) return adminIdOrEmail;
  return 'admin@tayoschool.edu.ng';
}

export const FirebaseAuthService = {
  /**
   * Listen to Firebase Auth state changes
   */
  onAuthStateChanged(callback: (user: User | null) => void) {
    if (!isFirebaseInitialized || !auth) {
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(auth, callback);
  },

  /**
   * Student Login: Authenticates student via Firebase Auth & Firestore
   */
  async loginStudent(studentNumber: string, password: string): Promise<Student> {
    const students = await FirestoreService.getStudents();
    const student = students.find(
      s => s.studentNumber.trim().toLowerCase() === studentNumber.trim().toLowerCase()
    );

    if (!student) {
      throw new Error(`Student record not found for "${studentNumber}". Please check your Student Number.`);
    }

    if (student.password && student.password !== password) {
      throw new Error('Incorrect password. Please verify your student credentials.');
    }

    // Connect / sync to Firebase Auth
    if (isFirebaseInitialized && auth) {
      const email = formatStudentEmail(student.studentNumber);
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (authErr: any) {
        // If user does not exist in Firebase Auth yet, provision on first sign-in
        if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
          try {
            await createUserWithEmailAndPassword(auth, email, password);
          } catch (createErr) {
            console.warn('Firebase Auth auto-provision notice (continuing with verified record):', createErr);
          }
        }
      }
    }

    return student;
  },

  /**
   * Staff Login: Authenticates staff via Firebase Auth & Firestore
   */
  async loginStaff(identifier: string, password: string): Promise<Staff> {
    const staffList = await FirestoreService.getStaff();
    const staffMember = staffList.find(
      s =>
        s.staffId.trim().toLowerCase() === identifier.trim().toLowerCase() ||
        s.email.trim().toLowerCase() === identifier.trim().toLowerCase()
    );

    if (!staffMember) {
      throw new Error(`Staff member not found for "${identifier}". Please check your Staff ID or Email.`);
    }

    if (staffMember.password && staffMember.password !== password) {
      throw new Error('Incorrect password. Please verify your staff credentials.');
    }

    // Connect / sync to Firebase Auth
    if (isFirebaseInitialized && auth) {
      const email = staffMember.email || formatStaffEmail(staffMember.staffId);
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (authErr: any) {
        if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
          try {
            await createUserWithEmailAndPassword(auth, email, password);
          } catch (createErr) {
            console.warn('Firebase Auth staff auto-provision notice:', createErr);
          }
        }
      }
    }

    return staffMember;
  },

  /**
   * Admin Login: Authenticates Administrator via Firebase Auth & Firestore
   */
  async loginAdmin(identifier: string, password: string): Promise<Administrator> {
    const admin = await FirestoreService.getAdministrator();

    const isMatch =
      admin.adminId.trim().toLowerCase() === identifier.trim().toLowerCase() ||
      admin.email.trim().toLowerCase() === identifier.trim().toLowerCase();

    if (!isMatch) {
      throw new Error(`Administrator ID or Email "${identifier}" is not recognized.`);
    }

    if (admin.password && admin.password !== password) {
      throw new Error('Invalid executive password. Access denied.');
    }

    // Connect / sync to Firebase Auth
    if (isFirebaseInitialized && auth) {
      const email = admin.email || formatAdminEmail(identifier);
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (authErr: any) {
        if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
          try {
            await createUserWithEmailAndPassword(auth, email, password);
          } catch (createErr) {
            console.warn('Firebase Auth admin auto-provision notice:', createErr);
          }
        }
      }
    }

    // Update last login
    admin.lastLogin = new Date().toLocaleString();
    await FirestoreService.saveAdministrator(admin);

    return admin;
  },

  /**
   * Log out of Firebase and clear active session
   */
  async logout(): Promise<void> {
    if (isFirebaseInitialized && auth) {
      try {
        await fbSignOut(auth);
      } catch (err) {
        console.warn('Firebase sign out error:', err);
      }
    }
  }
};
