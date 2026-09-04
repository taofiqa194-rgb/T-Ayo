import React, { useState } from 'react';
import {
  Administrator,
  Student,
  Staff,
  AdmissionApplication,
  SchoolClass,
  Announcement,
  GalleryItem,
  FeePayment
} from '../../types';
import { StorageService } from '../../services/storage';
import { FirebaseStorageService } from '../../firebase/storageService';
import { generateCompleteSqlDump, MYSQL_SCHEMA_DDL, PHP_BACKEND_SAMPLE } from '../../services/sqlExporter';
import {
  Users,
  GraduationCap,
  BookOpen,
  FileCheck,
  Bell,
  Image as ImageIcon,
  KeyRound,
  Database,
  Calendar,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Upload,
  Search,
  Filter,
  Download,
  Copy,
  Check,
  Lock,
  Edit,
  UserCheck,
  UserX,
  CreditCard,
  Phone,
  Mail,
  Camera,
  FileText,
  Building2,
  Printer,
  Save,
  ShieldCheck
} from 'lucide-react';

interface AdminDashboardProps {
  admin: Administrator;
  onUpdateAdmin: (updated: Administrator) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  admin,
  onUpdateAdmin
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'applications'
    | 'students'
    | 'staff'
    | 'fees'
    | 'sections'
    | 'announcements'
    | 'gallery'
    | 'session'
    | 'database'
    | 'profile'
    | 'security'
  >('applications');

  // Storage states
  const [students, setStudents] = useState<Student[]>(StorageService.getStudents());
  const [staffList, setStaffList] = useState<Staff[]>(StorageService.getStaff());
  const [applications, setApplications] = useState<AdmissionApplication[]>(StorageService.getApplications());
  const [classes, setClasses] = useState<SchoolClass[]>(StorageService.getClasses());
  const [announcements, setAnnouncements] = useState<Announcement[]>(StorageService.getAnnouncements());
  const [gallery, setGallery] = useState<GalleryItem[]>(StorageService.getGallery());
  const [config, setConfig] = useState(StorageService.getConfig());
  const [feePayments, setFeePayments] = useState<FeePayment[]>(() => StorageService.getFeePayments());
  const [feeStatusFilter, setFeeStatusFilter] = useState<'all' | 'Verified' | 'Pending Verification' | 'Rejected'>('all');
  const [feeSearch, setFeeSearch] = useState('');
  const [adminReceiptView, setAdminReceiptView] = useState<FeePayment | null>(null);

  // Admin Profile State
  const [adminFullName, setAdminFullName] = useState(admin.fullName);
  const [adminPhone, setAdminPhone] = useState(admin.phone || '09076930244');
  const [adminEmail, setAdminEmail] = useState(admin.email);
  const [adminRole, setAdminRole] = useState(admin.role);
  const [adminPhotoUrl, setAdminPhotoUrl] = useState(admin.photoUrl);

  const handleAdminPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit.');
        return;
      }
      try {
        showMsg('Uploading administrator photograph to Firebase Storage...');
        const photoUrl = await FirebaseStorageService.uploadAdminPassport(admin.adminId, file);
        setAdminPhotoUrl(photoUrl);
        showMsg('Administrator photograph uploaded to Firebase Storage! Click Save Profile to apply.');
      } catch (err) {
        console.warn('Firebase admin photo upload notice:', err);
      }
    }
  };

  const handleSaveAdminProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Administrator = {
      ...admin,
      fullName: adminFullName.trim(),
      phone: adminPhone.trim(),
      email: adminEmail.trim(),
      role: adminRole,
      photoUrl: adminPhotoUrl
    };
    StorageService.saveAdmin(updated);
    onUpdateAdmin(updated);
    showMsg('Administrator profile, phone number, and settings updated successfully!');
  };

  const handleUpdatePaymentStatus = (id: string, status: 'Verified' | 'Rejected') => {
    StorageService.updateFeePaymentStatus(id, status);
    setFeePayments(StorageService.getFeePayments());
    showMsg(`Payment record marked as ${status}!`);
  };

  // Search & Filter
  const [studentSearch, setStudentSearch] = useState('');
  const [studentSectionFilter, setStudentSectionFilter] = useState<'all' | 'primary' | 'secondary'>('all');
  const [appFilter, setAppFilter] = useState<'all' | 'Pending' | 'Approved' | 'Rejected'>('all');

  // Modals & form toggles
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showAddAnnouncementModal, setShowAddAnnouncementModal] = useState(false);
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [passwordResetUser, setPasswordResetUser] = useState<{ type: 'student' | 'staff'; id: string; name: string } | null>(null);
  const [resetNewPassword, setResetNewPassword] = useState('');

  // Flash feedback
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Student Actions
  const handleToggleStudentStatus = (studentId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    StorageService.setStudentStatus(studentId, newStatus);
    setStudents(StorageService.getStudents());
    showMsg(`Student account marked as ${newStatus}.`);
  };

  const handleStudentPassportChange = (studentNumber: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        StorageService.updateStudentPhoto(studentNumber, base64);
        setStudents(StorageService.getStudents());
        showMsg('Student passport updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Staff Actions
  const handleDeleteStaff = (staffId: string) => {
    if (confirm('Are you sure you want to remove this staff record?')) {
      StorageService.deleteStaff(staffId);
      setStaffList(StorageService.getStaff());
      showMsg('Staff record removed.');
    }
  };

  // Application Actions
  const handleApproveApplication = (app: AdmissionApplication) => {
    const newStdNo = `TAYO/${new Date().getFullYear()}/${String(students.length + 1).padStart(3, '0')}`;
    StorageService.updateApplicationStatus(app.id, 'Approved', 'Approved by Admission Committee', newStdNo);
    setApplications(StorageService.getApplications());
    setStudents(StorageService.getStudents());
    showMsg(`Application approved! Student registered as ${newStdNo}.`);
  };

  const handleRejectApplication = (appId: string) => {
    const reason = prompt('Reason for rejection (optional):') || 'Did not meet admission criteria.';
    StorageService.updateApplicationStatus(appId, 'Rejected', reason);
    setApplications(StorageService.getApplications());
    showMsg('Application rejected.');
  };

  // Password reset for Student / Staff
  const executePasswordReset = () => {
    if (!passwordResetUser || !resetNewPassword) return;
    if (passwordResetUser.type === 'student') {
      StorageService.updateStudentPassword(passwordResetUser.id, resetNewPassword);
    } else {
      StorageService.updateStaffPassword(passwordResetUser.id, resetNewPassword);
    }
    showMsg(`Password for ${passwordResetUser.name} reset to: "${resetNewPassword}".`);
    setPasswordResetUser(null);
    setResetNewPassword('');
  };

  // Master Admin Password
  const [adminOldPass, setAdminOldPass] = useState('');
  const [adminNewPass, setAdminNewPass] = useState('');
  const [adminConfirmPass, setAdminConfirmPass] = useState('');

  const handleAdminPasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminOldPass !== (admin.password || 'adminpassword')) {
      showMsg('Current administrator password does not match.', 'error');
      return;
    }
    if (adminNewPass.length < 8) {
      showMsg('New password must be at least 8 characters.', 'error');
      return;
    }
    if (adminNewPass !== adminConfirmPass) {
      showMsg('New passwords do not match.', 'error');
      return;
    }

    StorageService.updateAdminPassword(adminNewPass);
    onUpdateAdmin({ ...admin, password: adminNewPass });
    showMsg('Administrator password changed successfully!');
    setAdminOldPass('');
    setAdminNewPass('');
    setAdminConfirmPass('');
  };

  // Filtered lists
  const filteredStudents = students.filter(s => {
    const matchSearch =
      s.firstName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.lastName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.studentNumber.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.className.toLowerCase().includes(studentSearch.toLowerCase());
    const matchSection = studentSectionFilter === 'all' || s.section === studentSectionFilter;
    return matchSearch && matchSection;
  });

  const filteredApplications = applications.filter(a => {
    if (appFilter === 'all') return true;
    return a.status === appFilter;
  });

  const pendingAppsCount = applications.filter(a => a.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Admin Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-blue-100 bg-slate-100 shadow-md">
              <img
                src={admin.photoUrl}
                alt={admin.fullName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">{admin.fullName}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-[#003087] border border-blue-200">
                  {admin.role}
                </span>
              </div>
              <p className="text-xs font-black text-[#003087] mt-1 tracking-wider uppercase">
                Admin ID: <span className="font-mono text-sm">{admin.adminId}</span> • {admin.email}
              </p>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                Active Academic Session: <strong className="text-slate-900 font-black">{config.activeSession} ({config.activeTerm})</strong>
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-3 text-center">
              <span className="text-[10px] uppercase font-black tracking-wider text-[#003087] block">Total Students</span>
              <strong className="text-2xl font-black text-blue-950 font-display">{students.length}</strong>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-3 text-center">
              <span className="text-[10px] uppercase font-black tracking-wider text-[#008751] block">Staff Members</span>
              <strong className="text-2xl font-black text-emerald-950 font-display">{staffList.length}</strong>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-3 text-center">
              <span className="text-[10px] uppercase font-black tracking-wider text-amber-800 block">Pending Apps</span>
              <strong className="text-2xl font-black text-amber-950 font-display">{pendingAppsCount}</strong>
            </div>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedback && (
          <div className={`p-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 ${
            feedback.type === 'success' ? 'bg-emerald-50 text-[#008751] border border-emerald-200' : 'bg-red-50 text-red-900 border border-red-200'
          }`}>
            {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-[#008751] shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
            {feedback.text}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2">
          {[
            { id: 'applications', label: `Admission Applications (${pendingAppsCount})`, icon: FileCheck },
            { id: 'students', label: 'Students Directory', icon: GraduationCap },
            { id: 'staff', label: 'Staff Management', icon: Users },
            { id: 'fees', label: 'School Fees & Bursary', icon: CreditCard },
            { id: 'sections', label: 'Sections & Classes', icon: BookOpen },
            { id: 'announcements', label: 'Announcements', icon: Bell },
            { id: 'gallery', label: 'Photo Gallery', icon: ImageIcon },
            { id: 'session', label: 'Academic Session', icon: Calendar },
            { id: 'database', label: 'Database & SQL Export', icon: Database },
            { id: 'profile', label: 'Edit Admin Profile', icon: UserCheck },
            { id: 'security', label: 'Admin Security', icon: Lock }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`admin-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#003087] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================
            TAB 1: ADMISSION APPLICATIONS
           ======================================================== */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-display">
                  Online Admission Applications Queue
                </h2>
                <p className="text-xs text-slate-500">
                  Applications submitted by prospective parents and pupils via the public admission portal.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-500">Filter Status:</span>
                {(['all', 'Pending', 'Approved', 'Rejected'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setAppFilter(st)}
                    className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-colors ${
                      appFilter === st
                        ? 'bg-purple-700 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {filteredApplications.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500">
                <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold">No admission applications found under this filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredApplications.map(app => (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <img
                          src={app.passportPhoto || 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=400&auto=format&fit=crop&q=80'}
                          alt={app.fullName}
                          className="w-16 h-20 rounded-xl object-cover border border-slate-300 shadow-xs shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-bold">
                            {app.applicationNumber}
                          </span>
                          <h3 className="font-bold text-slate-900 text-base mt-1">{app.fullName}</h3>
                          <p className="text-xs text-slate-500">
                            Applying for: <strong className="text-slate-800">{app.classApplyingFor}</strong> ({app.section})
                          </p>
                          <p className="text-xs text-slate-400">DOB: {app.dateOfBirth} • {app.gender}</p>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        app.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-700">
                      <p><strong>Parent / Guardian:</strong> {app.parentName} ({app.parentRelationship})</p>
                      <p><strong>Phone:</strong> {app.parentPhone} • <strong>Email:</strong> {app.parentEmail}</p>
                      <p><strong>Address:</strong> {app.residentialAddress}</p>
                      <p><strong>Previous School:</strong> {app.previousSchool || 'None'}</p>
                      {app.birthCertificateName && (
                        <p className="text-blue-700"><strong>Attached Docs:</strong> {app.birthCertificateName}, {app.previousReportCardName}</p>
                      )}
                    </div>

                    {app.assignedStudentNumber && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
                        Enrolled as Active Student ID: <strong className="font-mono">{app.assignedStudentNumber}</strong>
                      </div>
                    )}

                    {app.status === 'Pending' && (
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => handleApproveApplication(app)}
                          className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve & Enlist Student</span>
                        </button>
                        <button
                          onClick={() => handleRejectApplication(app.id)}
                          className="py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: STUDENTS DIRECTORY & MANAGEMENT
           ======================================================== */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search name, class, ID..."
                    value={studentSearch}
                    onChange={e => setStudentSearch(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  />
                </div>

                <select
                  value={studentSectionFilter}
                  onChange={e => setStudentSectionFilter(e.target.value as any)}
                  className="text-xs px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-purple-600"
                >
                  <option value="all">All Sections</option>
                  <option value="primary">Primary School</option>
                  <option value="secondary">Secondary School</option>
                </select>
              </div>

              <button
                id="admin-add-student-btn"
                onClick={() => setShowAddStudentModal(true)}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Student</span>
              </button>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-3">Student Number</th>
                      <th className="py-3 px-3">Class</th>
                      <th className="py-3 px-3">Section</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Guardian</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map(st => (
                      <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative group">
                              <img
                                src={st.photoUrl}
                                alt={st.firstName}
                                className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <label
                                htmlFor={`change-photo-${st.id}`}
                                className="absolute inset-0 bg-black/50 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                title="Change photo"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <input
                                  id={`change-photo-${st.id}`}
                                  type="file"
                                  accept="image/*"
                                  onChange={e => handleStudentPassportChange(st.studentNumber, e)}
                                  className="hidden"
                                />
                              </label>
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{st.firstName} {st.lastName}</p>
                              <p className="text-xs text-slate-400">{st.gender} • {st.house} House</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-xs font-bold text-purple-800">
                          {st.studentNumber}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800">
                          {st.className}
                        </td>
                        <td className="py-3 px-3 capitalize text-slate-600">
                          {st.section}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            st.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {st.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-xs text-slate-600">
                          <p className="font-semibold text-slate-900">{st.guardianName}</p>
                          <p className="text-slate-400">{st.guardianPhone}</p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleToggleStudentStatus(st.id, st.status)}
                              title={st.status === 'Active' ? 'Suspend Student' : 'Activate Student'}
                              className={`p-1.5 rounded-lg border text-xs font-bold transition-colors ${
                                st.status === 'Active'
                                  ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                                  : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                              }`}
                            >
                              {st.status === 'Active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            </button>

                            <button
                              onClick={() => setPasswordResetUser({ type: 'student', id: st.studentNumber, name: `${st.firstName} ${st.lastName}` })}
                              title="Reset Password"
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-blue-700 transition-colors"
                            >
                              <KeyRound className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: STAFF MANAGEMENT
           ======================================================== */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-display">Academic & Administrative Staff</h2>
                <p className="text-xs text-slate-500">Manage teaching faculty, credentials, and subject assignments.</p>
              </div>

              <button
                id="admin-add-staff-btn"
                onClick={() => setShowAddStaffModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Staff</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffList.map(stf => (
                <div key={stf.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={stf.photoUrl}
                      alt={stf.fullName}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                        {stf.staffId}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base">{stf.fullName}</h3>
                      <p className="text-xs text-slate-500">{stf.roleTitle}</p>
                    </div>
                  </div>

                  <div className="text-xs space-y-1.5 p-3 bg-slate-50 rounded-xl text-slate-700">
                    <p><strong>Qualification:</strong> {stf.qualification}</p>
                    <p><strong>Phone:</strong> {stf.phone}</p>
                    <p><strong>Email:</strong> {stf.email}</p>
                    <p><strong>Assigned Classes:</strong> {stf.assignedClasses.join(', ')}</p>
                    <p><strong>Subjects:</strong> {stf.assignedSubjects.join(', ')}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setPasswordResetUser({ type: 'staff', id: stf.staffId, name: stf.fullName })}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Reset Password</span>
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(stf.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete staff"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: SECTIONS & CLASSES
           ======================================================== */}
        {activeTab === 'sections' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 font-display">Primary & Secondary Sections</h2>
              <p className="text-xs text-slate-500">Overview of class capacities and assigned Form Teachers.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map(cls => (
                <div key={cls.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-slate-900">{cls.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                      cls.section === 'secondary' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {cls.section}
                    </span>
                  </div>

                  <div className="text-xs space-y-2 text-slate-600">
                    <div className="flex justify-between">
                      <span>Class Form Teacher:</span>
                      <strong className="text-slate-900">{cls.classTeacherName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Class Prefect:</span>
                      <strong className="text-slate-900">{cls.prefectName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Enrolled Students:</span>
                      <strong className="text-purple-700">{cls.totalStudents} / {cls.capacity}</strong>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(cls.totalStudents / cls.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: ANNOUNCEMENTS MANAGEMENT
           ======================================================== */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-display">Manage Announcements & Circulars</h2>
                <p className="text-xs text-slate-500">Publish school notices across student, staff, and public portals.</p>
              </div>

              <button
                id="admin-new-announcement-btn"
                onClick={() => setShowAddAnnouncementModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Post Announcement</span>
              </button>
            </div>

            <div className="space-y-4">
              {announcements.map(ann => (
                <div key={ann.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                        {ann.category}
                      </span>
                      <span className="text-xs text-slate-400">Target: {ann.targetAudience}</span>
                      <span className="text-xs text-slate-400">• {ann.publishedDate}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{ann.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{ann.content}</p>
                    <p className="text-xs text-slate-400 font-medium">Author: {ann.author}</p>
                  </div>

                  <button
                    onClick={() => {
                      StorageService.deleteAnnouncement(ann.id);
                      setAnnouncements(StorageService.getAnnouncements());
                      showMsg('Announcement removed.');
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: GALLERY MANAGEMENT
           ======================================================== */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-display">Manage School Campus Gallery</h2>
                <p className="text-xs text-slate-500">Curate photos of campus laboratories, events, and sports.</p>
              </div>

              <button
                id="admin-add-photo-btn"
                onClick={() => setShowAddGalleryModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map(item => (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="h-44 w-full overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-purple-700">{item.category}</span>
                    <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 7: ACADEMIC SESSION SETTINGS
           ======================================================== */}
        {activeTab === 'session' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-xl mx-auto space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">Academic Session & Term Configuration</h2>
              <p className="text-xs text-slate-500">
                Define current operating calendar for grading, report cards, and student registration.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current Academic Session</label>
                <input
                  type="text"
                  value={config.activeSession}
                  onChange={e => setConfig({ ...config, activeSession: e.target.value })}
                  placeholder="e.g. 2024/2025"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Active Term</label>
                <select
                  value={config.activeTerm}
                  onChange={e => setConfig({ ...config, activeTerm: e.target.value as any })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                >
                  <option value="1st Term">1st Term</option>
                  <option value="2nd Term">2nd Term</option>
                  <option value="3rd Term">3rd Term</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="admissions-toggle"
                  checked={config.admissionsOpen}
                  onChange={e => setConfig({ ...config, admissionsOpen: e.target.checked })}
                  className="w-4 h-4 text-purple-700 rounded"
                />
                <label htmlFor="admissions-toggle" className="text-xs font-bold text-slate-700">
                  Accept Online Admission Applications for New Students
                </label>
              </div>

              <button
                onClick={() => {
                  StorageService.saveConfig(config);
                  showMsg('Academic session configuration saved successfully!');
                }}
                className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-sm transition-colors cursor-pointer"
              >
                Save Calendar Settings
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 8: DATABASE & SQL SCHEMA EXPORTER
           ======================================================== */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-display">
                  Relational MySQL Database & SQL Dump (All 8 Tables)
                </h2>
                <p className="text-xs text-slate-500">
                  Full production DDL schema and live seed data dump for Students, Staff, Administrators, Applications, Results, Classes, Announcements, and Gallery.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const dump = generateCompleteSqlDump();
                    navigator.clipboard.writeText(dump);
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 3000);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
                >
                  {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Script'}</span>
                </button>

                <button
                  onClick={() => {
                    const dump = generateCompleteSqlDump();
                    const blob = new Blob([dump], { type: 'text/sql' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'tayo_school_database.sql';
                    a.click();
                    URL.revokeObjectURL(url);
                    showMsg('Downloaded tayo_school_database.sql');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .SQL Dump</span>
                </button>
              </div>
            </div>

            {/* 8 Tables Overview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { name: 'administrators', count: '1 Admin', desc: 'Auth, roles & access' },
                { name: 'classes', count: `${classes.length} Classes`, desc: 'Primary & Secondary sections' },
                { name: 'staff', count: `${staffList.length} Teachers`, desc: 'IDs, subjects & qualifications' },
                { name: 'students', count: `${students.length} Pupils`, desc: 'Biodata, class, house, photos' },
                { name: 'applications', count: `${applications.length} Submissions`, desc: 'Admission requests & docs' },
                { name: 'results', count: 'Terminal Marks', desc: 'CA (30), Exam (70), grades' },
                { name: 'announcements', count: `${announcements.length} Notices`, desc: 'Notices & circulars' },
                { name: 'gallery', count: `${gallery.length} Images`, desc: 'Campus & sports photos' }
              ].map(t => (
                <div key={t.name} className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="font-mono font-bold text-purple-700 block">{t.name}</span>
                  <strong className="text-slate-800 text-sm">{t.count}</strong>
                  <p className="text-[11px] text-slate-400 mt-0.5">{t.desc}</p>
                </div>
              ))}
            </div>

            {/* SQL Script Viewer */}
            <div className="bg-slate-950 rounded-2xl p-4 sm:p-6 overflow-hidden text-xs text-slate-300 font-mono space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-emerald-400 font-bold">tayo_school_schema.sql (MySQL DDL & Engine)</span>
                <span className="text-slate-500">InnoDB • utf8mb4</span>
              </div>
              <pre className="max-h-80 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {generateCompleteSqlDump()}
              </pre>
            </div>

            {/* PHP Backend Reference Code */}
            <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 text-xs text-slate-300 font-mono space-y-3 border border-slate-800">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-blue-400 font-bold">api/db_connect.php (Sample PHP Backend Script)</span>
                <span className="text-slate-500">PDO Driver</span>
              </div>
              <pre className="max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {PHP_BACKEND_SAMPLE}
              </pre>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: SCHOOL FEES & BURSARY MANAGEMENT
           ======================================================== */}
        {activeTab === 'fees' && (
          <div className="space-y-6">
            {/* Bank Transfer Details Banner */}
            <div className="bg-gradient-to-r from-[#003087] to-[#001f5c] text-white p-6 sm:p-8 rounded-3xl shadow-md">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                    <Building2 className="w-3.5 h-3.5" />
                    Official School Fees Deposit Account
                  </div>
                  <h2 className="text-2xl font-black font-display tracking-tight">
                    T'AYO School Bursary & Treasury Console
                  </h2>
                  <p className="text-xs text-blue-100 max-w-2xl leading-relaxed">
                    All student tuition, PTA levies, exam registrations, and boarding fees are deposited into the designated Moniepoint treasury account. Verify student transaction references below to issue official clearance receipts.
                  </p>
                </div>

                <div className="bg-white/10 border border-white/20 p-5 rounded-2xl backdrop-blur-xs min-w-[280px] space-y-2">
                  <div className="text-[10px] font-black uppercase text-blue-200 tracking-wider">Designated Bank Account</div>
                  <div className="text-sm font-bold text-white">Bank: <span className="text-emerald-300 font-black">Moniepoint</span></div>
                  <div className="text-sm font-bold text-white">Account Name: <span className="font-mono text-white">Abbas Taofiq Ayomide</span></div>
                  <div className="flex items-center justify-between bg-black/20 px-3 py-2 rounded-xl">
                    <span className="font-mono text-base font-black tracking-widest text-emerald-300">9076930244</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('9076930244');
                        showMsg('Account number 9076930244 copied to clipboard!');
                      }}
                      className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors cursor-pointer"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="text-[11px] text-blue-200">
                    Bursary Support Line: <strong className="text-white font-mono font-bold">09076930244</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Bursary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">Total Verified Revenue</span>
                <div className="text-2xl font-black text-[#008751] font-display mt-1">
                  ₦{feePayments
                    .filter(p => p.status === 'Verified')
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString()}
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  From {feePayments.filter(p => p.status === 'Verified').length} confirmed payments
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-black uppercase tracking-wider text-amber-700 block">Pending Clearance</span>
                <div className="text-2xl font-black text-amber-600 font-display mt-1">
                  {feePayments.filter(p => p.status === 'Pending Verification').length} Records
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  ₦{feePayments
                    .filter(p => p.status === 'Pending Verification')
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString()} awaiting verification
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-black uppercase tracking-wider text-blue-700 block">Total Invoices Logged</span>
                <div className="text-2xl font-black text-[#003087] font-display mt-1">
                  {feePayments.length} Payments
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Primary & Secondary Sections
                </span>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by student name, number, or reference..."
                  value={feeSearch}
                  onChange={e => setFeeSearch(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003087]"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 shrink-0">Status:</span>
                {(['all', 'Pending Verification', 'Verified', 'Rejected'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setFeeStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                      feeStatusFilter === st
                        ? 'bg-[#003087] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st === 'all' ? 'All Invoices' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Fee Payments Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-black tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Student</th>
                      <th className="py-3.5 px-4">Class & Term</th>
                      <th className="py-3.5 px-4">Fee Category</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Payer / Reference</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {feePayments
                      .filter(p => {
                        const matchesFilter = feeStatusFilter === 'all' || p.status === feeStatusFilter;
                        const q = feeSearch.toLowerCase();
                        const matchesSearch =
                          !feeSearch ||
                          p.studentName.toLowerCase().includes(q) ||
                          p.studentNumber.toLowerCase().includes(q) ||
                          (p.transactionRef && p.transactionRef.toLowerCase().includes(q)) ||
                          p.payerName.toLowerCase().includes(q);
                        return matchesFilter && matchesSearch;
                      })
                      .map(p => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                            {p.paymentDate}
                          </td>
                          <td className="py-3.5 px-4">
                            <strong className="text-slate-900 font-bold block">{p.studentName}</strong>
                            <span className="text-[10px] text-slate-500 font-mono">{p.studentNumber}</span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                            <span className="font-bold text-slate-800">{p.className}</span>
                            <span className="block text-[10px] text-slate-400">{p.session} • {p.term}</span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-700">
                            {p.receiptNote || 'Tuition & Terminal Fees'}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <strong className="text-sm font-black text-slate-900 font-display">
                              ₦{p.amount.toLocaleString()}
                            </strong>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-slate-800 block">{p.payerName} ({p.bankName})</span>
                            <span className="text-[10px] font-mono text-[#003087] bg-blue-50 px-1.5 py-0.5 rounded">
                              Ref: {p.transactionRef}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              p.status === 'Verified'
                                ? 'bg-emerald-50 text-[#008751] border border-emerald-200'
                                : p.status === 'Pending Verification'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                            }`}>
                              {p.status === 'Verified' && <CheckCircle2 className="w-3 h-3" />}
                              {p.status === 'Pending Verification' && <AlertCircle className="w-3 h-3" />}
                              {p.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {p.status !== 'Verified' && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdatePaymentStatus(p.id, 'Verified')}
                                  className="px-2.5 py-1 rounded-lg bg-[#008751] hover:bg-[#007043] text-white text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                                  title="Approve & Clear Fee"
                                >
                                  Verify
                                </button>
                              )}
                              {p.status === 'Pending Verification' && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdatePaymentStatus(p.id, 'Rejected')}
                                  className="px-2.5 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                                  title="Reject Payment"
                                >
                                  Reject
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => setAdminReceiptView(p)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1"
                                title="View Official Receipt"
                              >
                                <FileText className="w-3 h-3" />
                                <span>Receipt</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: ADMIN PROFILE EDITING
           ======================================================== */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 font-display">Administrator Profile & System Identity</h2>
                <p className="text-xs text-slate-500">Update your school administrative officer profile, phone number, and avatar.</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-[#003087] border border-blue-200 w-fit">
                Root Executive • {admin.adminId}
              </span>
            </div>

            <form onSubmit={handleSaveAdminProfile} className="space-y-6">
              {/* Photo & Identity Banner */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="relative group">
                  <img
                    src={adminPhotoUrl}
                    alt={adminFullName}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-slate-200"
                  />
                  <label
                    htmlFor="admin-photo-upload"
                    className="absolute inset-0 bg-slate-950/60 rounded-2xl text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold"
                  >
                    <Camera className="w-5 h-5 mb-1" />
                    <span>Change Photo</span>
                  </label>
                  <input
                    id="admin-photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAdminPhotoUpload}
                    className="hidden"
                  />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="font-bold text-slate-900 text-base">{adminFullName}</h3>
                  <p className="text-xs text-slate-500">{adminRole}</p>
                  <p className="text-[11px] text-slate-400">Click photo or use button to upload a professional administrative photograph (max 2MB)</p>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-sm">
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                    Administrator Full Legal Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={adminFullName}
                    onChange={e => setAdminFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#003087]"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                    Official School Telephone *
                  </label>
                  <input
                    required
                    type="tel"
                    value={adminPhone}
                    onChange={e => setAdminPhone(e.target.value)}
                    placeholder="09076930244"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-[#003087]"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Official school contact number displayed on the portal: 09076930244</p>
                </div>

                <div>
                  <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                    Official Administrator Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#003087]"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                    Executive Role Designation *
                  </label>
                  <select
                    value={adminRole}
                    onChange={e => setAdminRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#003087]"
                  >
                    <option value="Super Administrator">Super Administrator</option>
                    <option value="Academic Principal">Academic Principal</option>
                    <option value="School Registrar">School Registrar</option>
                    <option value="Head of Administration">Head of Administration</option>
                  </select>
                </div>
              </div>

              {/* Institution System Info */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <span className="font-black text-slate-600 uppercase text-[10px] tracking-wider block">
                  Institutional Scope & Permissions
                </span>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-white px-3 py-1 rounded-lg border border-slate-200 font-bold text-slate-800">
                    School: T'AYO School, Ilorin
                  </span>
                  <span className="bg-white px-3 py-1 rounded-lg border border-slate-200 font-bold text-slate-800">
                    Location: Kwara State, Nigeria
                  </span>
                  <span className="bg-white px-3 py-1 rounded-lg border border-slate-200 font-bold text-slate-800">
                    Access: Full System Read/Write + Database Backup
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#003087] hover:bg-[#002266] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Administrator Profile</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================
            TAB 9: ADMIN SECURITY
           ======================================================== */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-md mx-auto">
            <h2 className="text-lg font-bold text-slate-900 font-display">Change Administrator Password</h2>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Master administrator access key for T'AYO School management console.
            </p>

            <form onSubmit={handleAdminPasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Current Master Password
                </label>
                <input
                  type="password"
                  required
                  value={adminOldPass}
                  onChange={e => setAdminOldPass(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  New Master Password
                </label>
                <input
                  type="password"
                  required
                  value={adminNewPass}
                  onChange={e => setAdminNewPass(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Confirm Master Password
                </label>
                <input
                  type="password"
                  required
                  value={adminConfirmPass}
                  onChange={e => setAdminConfirmPass(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-sm transition-colors cursor-pointer"
              >
                Update Master Password
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Password Reset Modal for Student / Staff */}
      {passwordResetUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base font-display">
              Reset Password for {passwordResetUser.name}
            </h3>
            <p className="text-xs text-slate-500">
              Provide a new temporary or permanent password for this {passwordResetUser.type} account.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Password</label>
              <input
                type="text"
                value={resetNewPassword}
                onChange={e => setResetNewPassword(e.target.value)}
                placeholder="e.g. tayo2025"
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 focus:outline-none font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setPasswordResetUser(null);
                  setResetNewPassword('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={executePasswordReset}
                disabled={!resetNewPassword}
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white text-xs font-bold shadow-sm"
              >
                Save New Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <AddStudentModal
          onClose={() => setShowAddStudentModal(false)}
          onAdd={newStd => {
            StorageService.saveStudent(newStd);
            setStudents(StorageService.getStudents());
            setShowAddStudentModal(false);
            showMsg(`Student ${newStd.firstName} enrolled as ${newStd.studentNumber}!`);
          }}
          existingCount={students.length}
        />
      )}

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <AddStaffModal
          onClose={() => setShowAddStaffModal(false)}
          onAdd={newStf => {
            StorageService.saveStaff(newStf);
            setStaffList(StorageService.getStaff());
            setShowAddStaffModal(false);
            showMsg(`Staff member ${newStf.fullName} added successfully!`);
          }}
          existingCount={staffList.length}
        />
      )}

      {/* Add Announcement Modal */}
      {showAddAnnouncementModal && (
        <AddAnnouncementModal
          onClose={() => setShowAddAnnouncementModal(false)}
          onAdd={ann => {
            StorageService.addAnnouncement(ann);
            setAnnouncements(StorageService.getAnnouncements());
            setShowAddAnnouncementModal(false);
            showMsg('Announcement posted!');
          }}
        />
      )}

      {/* Official Receipt Modal */}
      {adminReceiptView && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#003087] text-white flex items-center justify-center font-black">
                  T
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-display">T'AYO School Bursary</h3>
                  <p className="text-[11px] text-slate-500">Ilorin, Kwara State • Tel: 09076930244</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAdminReceiptView(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Body */}
            <div className="space-y-4 text-xs">
              <div className="text-center py-2 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Document Type</span>
                <strong className="text-base font-black text-[#003087] tracking-wider uppercase font-display">
                  Official Electronic School Fee Receipt
                </strong>
                <span className="font-mono text-[11px] text-slate-600 block mt-0.5">
                  Receipt Ref: {adminReceiptView.transactionRef}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Student Name</span>
                  <strong className="text-slate-900 text-xs font-bold">{adminReceiptView.studentName}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Student Number</span>
                  <strong className="text-[#008751] font-mono text-xs">{adminReceiptView.studentNumber}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Academic Class</span>
                  <strong className="text-slate-900 text-xs">{adminReceiptView.className}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Academic Term / Session</span>
                  <strong className="text-slate-900 text-xs">{adminReceiptView.term} ({adminReceiptView.session})</strong>
                </div>
              </div>

              <div className="space-y-2 border-t border-b border-slate-200 py-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Purpose:</span>
                  <span className="font-bold text-slate-900">{adminReceiptView.receiptNote || 'Tuition & Terminal School Fees'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Paid By / Remitter:</span>
                  <span className="font-semibold text-slate-900">{adminReceiptView.payerName} ({adminReceiptView.bankName})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Official Deposit Account:</span>
                  <span className="font-mono text-slate-800">Moniepoint / Abbas Taofiq Ayomide (9076930244)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Date:</span>
                  <span className="font-mono text-slate-800">{adminReceiptView.paymentDate}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-200">
                  <span className="font-black text-slate-900 text-xs uppercase">Total Amount Paid:</span>
                  <strong className="text-xl font-black text-[#008751] font-display">
                    ₦{adminReceiptView.amount.toLocaleString()}
                  </strong>
                </div>
              </div>

              {/* Status Stamp */}
              <div className={`p-3 rounded-2xl flex items-center justify-between ${
                adminReceiptView.status === 'Verified'
                  ? 'bg-emerald-50 text-[#008751] border border-emerald-200'
                  : 'bg-amber-50 text-amber-900 border border-amber-200'
              }`}>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider block">Official Clearance Stamp</span>
                    <strong className="font-black uppercase tracking-wide text-xs">{adminReceiptView.status}</strong>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-500">Bursar Seal & Stamp</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => setAdminReceiptView(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// SUB-MODALS FOR ADMIN ACTIONS
// ==========================================

function AddStudentModal({
  onClose,
  onAdd,
  existingCount
}: {
  onClose: () => void;
  onAdd: (student: Student) => void;
  existingCount: number;
}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [dateOfBirth, setDateOfBirth] = useState('2012-05-15');
  const [section, setSection] = useState<'primary' | 'secondary'>('secondary');
  const [className, setClassName] = useState('SSS 1 Science');
  const [house, setHouse] = useState<'Emerald' | 'Ruby' | 'Sapphire' | 'Topaz'>('Emerald');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [address, setAddress] = useState('Ilorin, Kwara State');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudentNumber = `TAYO/${new Date().getFullYear()}/${String(existingCount + 1).padStart(3, '0')}`;
    const newStudent: Student = {
      id: 'std-' + Date.now(),
      studentNumber: newStudentNumber,
      password: 'password123',
      firstName,
      lastName,
      middleName,
      gender,
      dateOfBirth,
      section,
      className,
      house,
      photoUrl,
      status: 'Active',
      admissionYear: new Date().getFullYear(),
      guardianName,
      guardianPhone,
      guardianEmail,
      guardianRelationship: 'Parent',
      address,
      stateOfOrigin: 'Kwara State'
    };
    onAdd(newStudent);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 my-8 shadow-2xl border border-slate-200">
        <h3 className="font-bold text-slate-900 text-lg font-display">Add & Enroll New Student</h3>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">First Name</label>
              <input
                required
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Last Name</label>
              <input
                required
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Gender</label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as any)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={e => setDateOfBirth(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Section</label>
              <select
                value={section}
                onChange={e => setSection(e.target.value as any)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Class</label>
              <input
                required
                type="text"
                value={className}
                onChange={e => setClassName(e.target.value)}
                placeholder="e.g. SSS 1 Science"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Guardian Name</label>
              <input
                required
                type="text"
                value={guardianName}
                onChange={e => setGuardianName(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Guardian Phone</label>
              <input
                required
                type="tel"
                value={guardianPhone}
                onChange={e => setGuardianPhone(e.target.value)}
                placeholder="+234 ..."
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Residential Address</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              Enroll Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddStaffModal({
  onClose,
  onAdd,
  existingCount
}: {
  onClose: () => void;
  onAdd: (staff: Staff) => void;
  existingCount: number;
}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+234 ');
  const [qualification, setQualification] = useState('B.Sc. (Ed), TRCN');
  const [roleTitle, setRoleTitle] = useState('Subject Teacher');
  const [assignedSection, setAssignedSection] = useState<'primary' | 'secondary' | 'both'>('secondary');
  const [assignedClasses, setAssignedClasses] = useState('SSS 1 Science, SSS 2 Science');
  const [assignedSubjects, setAssignedSubjects] = useState('Mathematics, Further Mathematics');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStaffId = `STF-${String(existingCount + 10).padStart(3, '0')}`;
    const newStaff: Staff = {
      id: 'stf-' + Date.now(),
      staffId: newStaffId,
      email,
      password: 'password123',
      fullName,
      gender: 'Male',
      phone,
      qualification,
      roleTitle,
      assignedSection,
      assignedClasses: assignedClasses.split(',').map(s => s.trim()),
      assignedSubjects: assignedSubjects.split(',').map(s => s.trim()),
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      joinedDate: new Date().toISOString().split('T')[0]
    };
    onAdd(newStaff);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 my-8 shadow-2xl border border-slate-200">
        <h3 className="font-bold text-slate-900 text-lg font-display">Add New Faculty / Staff Member</h3>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Full Name & Title</label>
            <input
              required
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="e.g. Mr. Emmanuel Olatunji"
              className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Official Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="teacher@tayoschool.edu.ng"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Telephone</label>
              <input
                required
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Qualification</label>
              <input
                required
                type="text"
                value={qualification}
                onChange={e => setQualification(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Role Title</label>
              <input
                required
                type="text"
                value={roleTitle}
                onChange={e => setRoleTitle(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Assigned Classes (Comma separated)</label>
            <input
              type="text"
              value={assignedClasses}
              onChange={e => setAssignedClasses(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Assigned Subjects (Comma separated)</label>
            <input
              type="text"
              value={assignedSubjects}
              onChange={e => setAssignedSubjects(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              Add Staff Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddAnnouncementModal({
  onClose,
  onAdd
}: {
  onClose: () => void;
  onAdd: (ann: Announcement) => void;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'General' | 'Academic' | 'Primary' | 'Secondary' | 'PTA'>('General');
  const [targetAudience, setTargetAudience] = useState<'All' | 'Students' | 'Staff' | 'Parents'>('All');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: 'ann-' + Date.now(),
      title,
      content,
      category,
      targetAudience,
      publishedDate: new Date().toISOString().split('T')[0],
      author: 'Principal\'s Office'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
        <h3 className="font-bold text-slate-900 text-lg font-display">Create Notice or Announcement</h3>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Announcement Title</label>
            <input
              required
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Mid-Term Break Schedule"
              className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl"
              >
                <option value="General">General</option>
                <option value="Academic">Academic</option>
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
                <option value="PTA">PTA</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Target Audience</label>
              <select
                value={targetAudience}
                onChange={e => setTargetAudience(e.target.value as any)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl"
              >
                <option value="All">All School</option>
                <option value="Students">Students Only</option>
                <option value="Staff">Staff Only</option>
                <option value="Parents">Parents Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Circular Content</label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write the full circular notice..."
              className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              Publish Circular
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddGalleryModal({
  onClose,
  onAdd
}: {
  onClose: () => void;
  onAdd: (item: GalleryItem) => void;
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Campus' | 'Sports' | 'Science & Arts' | 'Cultural Day' | 'Graduation'>('Campus');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: 'gal-' + Date.now(),
      title,
      category,
      imageUrl,
      description,
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
        <h3 className="font-bold text-slate-900 text-lg font-display">Add Photo to Gallery</h3>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Photo Title</label>
            <input
              required
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Modern Physics Practical Session"
              className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl"
            >
              <option value="Campus">Campus</option>
              <option value="Sports">Sports</option>
              <option value="Science & Arts">Science & Arts</option>
              <option value="Cultural Day">Cultural Day</option>
              <option value="Graduation">Graduation</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Image URL</label>
            <input
              required
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full text-sm px-3 py-2 border border-slate-300 rounded-xl"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              Upload Photo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
