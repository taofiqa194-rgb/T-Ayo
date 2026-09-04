import React, { useState, useEffect } from 'react';
import { PageId, Student, Staff, Administrator } from './types';
import { StorageService } from './services/storage';
import { FirebaseAuthService } from './firebase/authService';

// Common components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Public Pages
import { HomePage } from './components/pages/HomePage';
import { AboutPage } from './components/pages/AboutPage';
import { PrimarySectionPage } from './components/pages/PrimarySectionPage';
import { SecondarySectionPage } from './components/pages/SecondarySectionPage';
import { AdmissionPage } from './components/pages/AdmissionPage';
import { NewsPage } from './components/pages/NewsPage';
import { GalleryPage } from './components/pages/GalleryPage';
import { ContactPage } from './components/pages/ContactPage';

// Auth Pages
import { StudentLoginPage } from './components/auth/StudentLoginPage';
import { StaffLoginPage } from './components/auth/StaffLoginPage';
import { AdminLoginPage } from './components/auth/AdminLoginPage';

// Dashboard Pages
import { StudentDashboard } from './components/dashboards/StudentDashboard';
import { StaffDashboard } from './components/dashboards/StaffDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<Administrator | null>(null);

  // Initialize storage seeds and restore session if any
  useEffect(() => {
    StorageService.init().then(() => {
      // Re-check stored sessions after cloud sync
      const storedStudentNo = localStorage.getItem('tayo_session_student');
      if (storedStudentNo) {
        const std = StorageService.getStudentByNumber(storedStudentNo);
        if (std) setCurrentStudent(std);
      }

      const storedStaffId = localStorage.getItem('tayo_session_staff');
      if (storedStaffId) {
        const stf = StorageService.getStaffById(storedStaffId);
        if (stf) setCurrentStaff(stf);
      }

      const storedAdmin = localStorage.getItem('tayo_session_admin');
      if (storedAdmin === 'true') {
        setCurrentAdmin(StorageService.getAdmin());
      }
    });

    // Check stored sessions immediately
    const storedStudentNo = localStorage.getItem('tayo_session_student');
    if (storedStudentNo) {
      const std = StorageService.getStudentByNumber(storedStudentNo);
      if (std) setCurrentStudent(std);
    }

    const storedStaffId = localStorage.getItem('tayo_session_staff');
    if (storedStaffId) {
      const stf = StorageService.getStaffById(storedStaffId);
      if (stf) setCurrentStaff(stf);
    }

    const storedAdmin = localStorage.getItem('tayo_session_admin');
    if (storedAdmin === 'true') {
      setCurrentAdmin(StorageService.getAdmin());
    }

    const unsubscribe = FirebaseAuthService.onAuthStateChanged(() => {});
    return () => unsubscribe();
  }, []);

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Login Handlers
  const handleStudentLoginSuccess = (student: Student) => {
    setCurrentStudent(student);
    setCurrentStaff(null);
    setCurrentAdmin(null);
    localStorage.setItem('tayo_session_student', student.studentNumber);
    localStorage.removeItem('tayo_session_staff');
    localStorage.removeItem('tayo_session_admin');
    setCurrentPage('student-dashboard');
  };

  const handleStaffLoginSuccess = (staff: Staff) => {
    setCurrentStaff(staff);
    setCurrentStudent(null);
    setCurrentAdmin(null);
    localStorage.setItem('tayo_session_staff', staff.staffId);
    localStorage.removeItem('tayo_session_student');
    localStorage.removeItem('tayo_session_admin');
    setCurrentPage('staff-dashboard');
  };

  const handleAdminLoginSuccess = (admin: Administrator) => {
    setCurrentAdmin(admin);
    setCurrentStudent(null);
    setCurrentStaff(null);
    localStorage.setItem('tayo_session_admin', 'true');
    localStorage.removeItem('tayo_session_student');
    localStorage.removeItem('tayo_session_staff');
    setCurrentPage('admin-dashboard');
  };

  // Logout Handlers
  const handleLogout = async () => {
    try {
      await FirebaseAuthService.logout();
    } catch (e) {
      console.warn('Firebase logout notice:', e);
    }
    setCurrentStudent(null);
    setCurrentStaff(null);
    setCurrentAdmin(null);
    localStorage.removeItem('tayo_session_student');
    localStorage.removeItem('tayo_session_staff');
    localStorage.removeItem('tayo_session_admin');
    setCurrentPage('home');
  };

  // Logged-in session details for navbar
  const loggedInUser = currentStudent
    ? {
        role: 'student' as const,
        name: `${currentStudent.firstName} ${currentStudent.lastName}`,
        dashboardPage: 'student-dashboard' as PageId
      }
    : currentStaff
    ? {
        role: 'staff' as const,
        name: currentStaff.fullName,
        dashboardPage: 'staff-dashboard' as PageId
      }
    : currentAdmin
    ? {
        role: 'admin' as const,
        name: currentAdmin.fullName,
        dashboardPage: 'admin-dashboard' as PageId
      }
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        loggedInUser={loggedInUser}
        onLogout={handleLogout}
      />

      {/* Main Routed Content */}
      <main className="flex-1">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {currentPage === 'primary' && <PrimarySectionPage onNavigate={handleNavigate} />}
        {currentPage === 'secondary' && <SecondarySectionPage onNavigate={handleNavigate} />}
        {currentPage === 'admission' && <AdmissionPage />}
        {currentPage === 'news' && <NewsPage />}
        {currentPage === 'gallery' && <GalleryPage />}
        {currentPage === 'contact' && <ContactPage />}

        {/* Auth Pages */}
        {currentPage === 'student-login' && (
          <StudentLoginPage
            onLoginSuccess={handleStudentLoginSuccess}
            onNavigate={handleNavigate}
          />
        )}
        {currentPage === 'staff-login' && (
          <StaffLoginPage
            onLoginSuccess={handleStaffLoginSuccess}
            onNavigate={handleNavigate}
          />
        )}
        {currentPage === 'admin-login' && (
          <AdminLoginPage
            onLoginSuccess={handleAdminLoginSuccess}
            onNavigate={handleNavigate}
          />
        )}

        {/* Dashboard Pages */}
        {currentPage === 'student-dashboard' && currentStudent && (
          <StudentDashboard
            student={currentStudent}
            onUpdateStudent={updated => {
              setCurrentStudent(updated);
            }}
          />
        )}
        {currentPage === 'student-dashboard' && !currentStudent && (
          <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
            <p className="text-sm font-semibold text-slate-700">You must be logged in as a student to access this portal.</p>
            <button
              onClick={() => setCurrentPage('student-login')}
              className="px-6 py-2.5 rounded-xl bg-blue-800 text-white font-bold text-xs"
            >
              Go to Student Login
            </button>
          </div>
        )}

        {currentPage === 'staff-dashboard' && currentStaff && (
          <StaffDashboard
            staff={currentStaff}
            onUpdateStaff={updated => {
              setCurrentStaff(updated);
            }}
          />
        )}
        {currentPage === 'staff-dashboard' && !currentStaff && (
          <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
            <p className="text-sm font-semibold text-slate-700">You must be logged in as a faculty/staff member to access this portal.</p>
            <button
              onClick={() => setCurrentPage('staff-login')}
              className="px-6 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs"
            >
              Go to Staff Login
            </button>
          </div>
        )}

        {currentPage === 'admin-dashboard' && currentAdmin && (
          <AdminDashboard
            admin={currentAdmin}
            onUpdateAdmin={updated => {
              setCurrentAdmin(updated);
            }}
          />
        )}
        {currentPage === 'admin-dashboard' && !currentAdmin && (
          <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
            <p className="text-sm font-semibold text-slate-700">You must be logged in as an administrator to access the school console.</p>
            <button
              onClick={() => setCurrentPage('admin-login')}
              className="px-6 py-2.5 rounded-xl bg-purple-800 text-white font-bold text-xs"
            >
              Go to Admin Login
            </button>
          </div>
        )}
      </main>

      {/* Footer (Visible on all pages) */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
