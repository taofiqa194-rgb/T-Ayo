import React, { useState } from 'react';
import {
  User,
  BookOpen,
  Award,
  Bell,
  KeyRound,
  Upload,
  Calendar,
  Phone,
  Mail,
  Home,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Edit3,
  Save,
  Check
} from 'lucide-react';
import { Student, StudentResultRecord, Announcement } from '../../types';
import { StorageService } from '../../services/storage';
import { FirebaseStorageService } from '../../firebase/storageService';
import { FirestoreService } from '../../firebase/firestoreService';
import { FirebaseAuthService } from '../../firebase/authService';
import { ReportCardModal } from './ReportCardModal';
import { FeePaymentSection } from './FeePaymentSection';

interface StudentDashboardProps {
  student: Student;
  onUpdateStudent: (updated: Student) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  onUpdateStudent
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'results' | 'fees' | 'classes' | 'announcements' | 'security'>('results');
  const [selectedSession, setSelectedSession] = useState<string>('2024/2025');
  const [selectedTerm, setSelectedTerm] = useState<'1st Term' | '2nd Term' | '3rd Term'>('1st Term');
  const [reportModalResult, setReportModalResult] = useState<StudentResultRecord | null>(null);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editAddress, setEditAddress] = useState(student.address);
  const [editGuardianPhone, setEditGuardianPhone] = useState(student.guardianPhone);
  const [editGuardianName, setEditGuardianName] = useState(student.guardianName);
  const [editGuardianRelationship, setEditGuardianRelationship] = useState(student.guardianRelationship);
  const [profileSaveMsg, setProfileSaveMsg] = useState<string | null>(null);

  // Security password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Photo upload state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoUploadMsg, setPhotoUploadMsg] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Student = {
      ...student,
      address: editAddress.trim(),
      guardianPhone: editGuardianPhone.trim(),
      guardianName: editGuardianName.trim(),
      guardianRelationship: editGuardianRelationship.trim()
    };
    try {
      await FirestoreService.saveStudent(updated);
    } catch (err) {
      console.warn('Firestore sync notice:', err);
    }
    StorageService.saveStudent(updated);
    onUpdateStudent(updated);
    setIsEditingProfile(false);
    setProfileSaveMsg('Your residential address and parent phone number have been updated successfully!');
    setTimeout(() => setProfileSaveMsg(null), 5000);
  };

  // Data
  const studentResults = StorageService.getStudentResults(student.studentNumber, selectedSession, selectedTerm);
  const announcements = StorageService.getAnnouncements().filter(
    a => a.targetAudience === 'All' || a.targetAudience === 'Students'
  );

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setPhotoUploadMsg('File too large! Please upload a photo under 2MB.');
        return;
      }
      setPhotoUploadMsg('Uploading photo to Firebase Storage...');
      try {
        const photoUrl = await FirebaseStorageService.uploadStudentPassport(student.studentNumber, file);
        setPhotoPreview(photoUrl);
        const updated: Student = { ...student, photoUrl };
        try {
          await FirestoreService.saveStudent(updated);
        } catch (fErr) {
          console.warn('Firestore photo save notice:', fErr);
        }
        StorageService.updateStudentPhoto(student.studentNumber, photoUrl);
        onUpdateStudent(updated);
        setPhotoUploadMsg('Passport photograph saved and uploaded to Firebase Storage!');
        setTimeout(() => setPhotoUploadMsg(null), 4000);
      } catch (err: any) {
        console.warn('Firebase upload notice:', err);
        setPhotoUploadMsg('Upload failed: ' + (err?.message || 'Could not upload to storage.'));
      }
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    try {
      await FirebaseAuthService.updatePassword(newPassword);
      setPasswordMsg({ type: 'success', text: 'Password successfully changed and secured in Firebase Authentication!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err?.message || 'Failed to update password in Firebase Auth.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Student Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-blue-100 bg-slate-100 shadow-md">
                <img
                  src={photoPreview || student.photoUrl}
                  alt={`${student.firstName} ${student.lastName}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <label
                htmlFor="passport-upload-input"
                className="absolute -bottom-2 -right-2 p-2 bg-[#003087] text-white rounded-xl shadow-md hover:bg-blue-900 cursor-pointer transition-transform hover:scale-110"
                title="Change passport photograph"
              >
                <Upload className="w-4 h-4" />
                <input
                  id="passport-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">
                  {student.firstName} {student.middleName || ''} {student.lastName}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  student.status === 'Active' ? 'bg-emerald-50 text-[#008751] border border-emerald-200' : 'bg-red-50 text-red-700'
                }`}>
                  {student.status}
                </span>
              </div>
              <p className="text-xs font-black text-[#003087] mt-1 tracking-wider uppercase">
                Student Number: <span className="font-mono text-sm">{student.studentNumber}</span>
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 mt-2.5">
                <span className="bg-slate-100 px-3 py-1 rounded-lg font-bold text-slate-800">
                  Class: {student.className}
                </span>
                <span className="bg-slate-100 px-3 py-1 rounded-lg font-bold text-slate-800">
                  House: {student.house}
                </span>
                <span className="bg-slate-100 px-3 py-1 rounded-lg font-bold text-slate-800">
                  Section: {student.section === 'secondary' ? 'Secondary School' : 'Primary School'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <button
              id="student-view-report-card-btn"
              onClick={() => {
                if (studentResults.length > 0) {
                  setReportModalResult(studentResults[0]);
                } else {
                  alert('No published results found for the selected session and term.');
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Print Official Report Card</span>
            </button>
          </div>
        </div>

        {photoUploadMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-[#008751] rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#008751] shrink-0" />
            {photoUploadMsg}
          </div>
        )}

        {/* Dashboard Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2">
          {[
            { id: 'results', label: 'My Results', icon: Award },
            { id: 'profile', label: 'Edit Profile & Bio', icon: User },
            { id: 'fees', label: 'Pay School Fees', icon: CreditCard },
            { id: 'classes', label: 'Class & Timetable', icon: BookOpen },
            { id: 'announcements', label: 'Announcements', icon: Bell },
            { id: 'security', label: 'Change Password', icon: KeyRound }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`student-tab-${tab.id}`}
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

        {/* TAB 1: RESULTS VIEW */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold uppercase text-slate-500">Filter Term:</span>
                <select
                  id="student-result-session-select"
                  value={selectedSession}
                  onChange={e => setSelectedSession(e.target.value)}
                  className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-600"
                >
                  <option value="2024/2025">2024/2025 Session</option>
                  <option value="2023/2024">2023/2024 Session</option>
                </select>
                <select
                  id="student-result-term-select"
                  value={selectedTerm}
                  onChange={e => setSelectedTerm(e.target.value as any)}
                  className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-600"
                >
                  <option value="1st Term">1st Term</option>
                  <option value="2nd Term">2nd Term</option>
                  <option value="3rd Term">3rd Term</option>
                </select>
              </div>

              {studentResults.length > 0 && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-600">Terminal Average:</span>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-extrabold rounded-md border border-emerald-200">
                    {studentResults[0].overallAverage}%
                  </span>
                  <span className="font-semibold text-slate-600 ml-2">Class Position:</span>
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-800 font-extrabold rounded-md border border-blue-200">
                    {studentResults[0].classPosition}
                  </span>
                </div>
              )}
            </div>

            {studentResults.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
                <Award className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-700">No Result Published Yet</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Results for {selectedSession} {selectedTerm} are currently being processed and vetted by the examination committee.
                </p>
              </div>
            ) : (
              studentResults.map(res => (
                <div key={res.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold">
                        {res.session} Academic Session — {res.term}
                      </h2>
                      <p className="text-xs text-slate-400">Class: {res.className} • Status: {res.status}</p>
                    </div>
                    <button
                      onClick={() => setReportModalResult(res)}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold self-start sm:self-auto cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      View Official Terminal Sheet
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold">
                        <tr>
                          <th className="py-3 px-4">Subject</th>
                          <th className="py-3 px-3 text-center">CA (30)</th>
                          <th className="py-3 px-3 text-center">Exam (70)</th>
                          <th className="py-3 px-3 text-center">Total (100)</th>
                          <th className="py-3 px-3 text-center">Grade</th>
                          <th className="py-3 px-3 text-center">Position</th>
                          <th className="py-3 px-4">Remark</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {res.subjects.map((sub, i) => (
                          <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4 font-semibold text-slate-800">{sub.subject}</td>
                            <td className="py-3 px-3 text-center text-slate-600">{sub.caScore}</td>
                            <td className="py-3 px-3 text-center text-slate-600">{sub.examScore}</td>
                            <td className="py-3 px-3 text-center font-bold text-slate-900">{sub.totalScore}</td>
                            <td className="py-3 px-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                sub.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-800' :
                                sub.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                                sub.grade.startsWith('C') ? 'bg-amber-100 text-amber-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {sub.grade}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center text-slate-500 font-medium">{sub.position}</td>
                            <td className="py-3 px-4 text-slate-700 font-medium">{sub.remark}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-400 font-bold uppercase text-[10px] block">Form Teacher's Remark:</span>
                      <p className="text-slate-800 font-medium mt-1 italic">"{res.teacherRemark}"</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-400 font-bold uppercase text-[10px] block">Principal's Remark:</span>
                      <p className="text-slate-800 font-medium mt-1 italic">"{res.principalRemark}"</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: PROFILE VIEW & EDITING */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 font-display">Student Profile & Biodata</h2>
                <p className="text-xs text-slate-500">Official student registry verified by T'AYO School Administration.</p>
              </div>
              <button
                id="toggle-edit-profile-btn"
                type="button"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  isEditingProfile
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'bg-[#003087] hover:bg-[#002568] text-white shadow-xs'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingProfile ? 'Cancel Editing' : 'Edit Contact & Address'}</span>
              </button>
            </div>

            {profileSaveMsg && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-[#008751] rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-[#008751] shrink-0" />
                <span>{profileSaveMsg}</span>
              </div>
            )}

            {/* Academic Biodata (Read Only Records) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Full Name</span>
                <p className="font-bold text-slate-900">{student.firstName} {student.middleName} {student.lastName}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Admission Number</span>
                <p className="font-bold text-blue-800 font-mono">{student.studentNumber}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Gender & Date of Birth</span>
                <p className="font-bold text-slate-900">{student.gender} • {student.dateOfBirth}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Assigned Class & Arm</span>
                <p className="font-bold text-slate-900">{student.className} ({student.arm || 'Alpha'})</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">School Section</span>
                <p className="font-bold text-slate-900 capitalize">{student.section} School</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">State of Origin</span>
                <p className="font-bold text-slate-900">{student.stateOfOrigin}</p>
              </div>
            </div>

            {/* EDITABLE SECTION: Residential Address & Parent/Guardian Phone */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    Residential Address & Parent / Guardian Contact Details
                  </h3>
                  <p className="text-xs text-slate-500">
                    Keep your contact information updated so school alerts and reports reach your family.
                  </p>
                </div>
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="bg-blue-50/40 border border-blue-100 rounded-2xl p-5 sm:p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div>
                      <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                        Residential Home Address *
                      </label>
                      <input
                        required
                        type="text"
                        value={editAddress}
                        onChange={e => setEditAddress(e.target.value)}
                        placeholder="e.g. 15, Stadium Road, Taiwo Isale, Ilorin, Kwara State"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#003087]"
                      />
                    </div>

                    <div>
                      <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                        Parent / Guardian Phone Number *
                      </label>
                      <input
                        required
                        type="tel"
                        value={editGuardianPhone}
                        onChange={e => setEditGuardianPhone(e.target.value)}
                        placeholder="09076930244"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-[#003087]"
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">Used for SMS terminal alerts and emergency contacts</span>
                    </div>

                    <div>
                      <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                        Parent / Guardian Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        value={editGuardianName}
                        onChange={e => setEditGuardianName(e.target.value)}
                        placeholder="e.g. Dr. Michael Adeyemi"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#003087]"
                      />
                    </div>

                    <div>
                      <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                        Relationship with Student
                      </label>
                      <select
                        value={editGuardianRelationship}
                        onChange={e => setEditGuardianRelationship(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#003087]"
                      >
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Guardian">Guardian</option>
                        <option value="Uncle">Uncle</option>
                        <option value="Aunt">Aunt</option>
                        <option value="Sponsor">Sponsor</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Profile Changes</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Guardian Name</span>
                    <p className="font-bold text-slate-900">{student.guardianName} ({student.guardianRelationship})</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Guardian Telephone</span>
                    <p className="font-bold text-slate-900 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-mono">{student.guardianPhone}</span>
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Residential Address</span>
                    <p className="font-bold text-slate-900 flex items-center gap-2">
                      <Home className="w-3.5 h-3.5 text-blue-600" />
                      <span>{student.address}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: SCHOOL FEES PAYMENT */}
        {activeTab === 'fees' && (
          <FeePaymentSection
            student={student}
            activeSession={selectedSession}
            activeTerm={selectedTerm}
          />
        )}

        {/* TAB 3: CLASSES & TIMETABLE */}
        {activeTab === 'classes' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 font-display">Class Information: {student.className}</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
                  <span className="text-xs text-blue-700 font-bold uppercase">Form Teacher</span>
                  <p className="text-slate-900 font-bold mt-1">Mr. Babatunde Alabi</p>
                  <p className="text-xs text-slate-500">B.Sc Ed Mathematics</p>
                </div>
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <span className="text-xs text-emerald-700 font-bold uppercase">Class Prefect</span>
                  <p className="text-slate-900 font-bold mt-1">Fatima Bello</p>
                  <p className="text-xs text-slate-500">Head Girl Assistant</p>
                </div>
                <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
                  <span className="text-xs text-purple-700 font-bold uppercase">Class Capacity</span>
                  <p className="text-slate-900 font-bold mt-1">34 Registered Students</p>
                  <p className="text-xs text-slate-500">Max limit: 35 pupils</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 overflow-x-auto">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
                Weekly Academic Timetable
              </h3>
              <div className="grid grid-cols-5 min-w-[600px] gap-2 text-xs">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                  <div key={day} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <p className="font-bold text-blue-900 uppercase border-b border-slate-200 pb-1.5 mb-2 text-center">
                      {day}
                    </p>
                    <div className="space-y-2">
                      <div className="p-2 bg-white rounded-lg shadow-2xs border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">8:00 - 8:45 AM</span>
                        <strong className="text-slate-800 block">Mathematics</strong>
                      </div>
                      <div className="p-2 bg-white rounded-lg shadow-2xs border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">8:45 - 9:30 AM</span>
                        <strong className="text-slate-800 block">English Language</strong>
                      </div>
                      <div className="p-2 bg-white rounded-lg shadow-2xs border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">9:30 - 10:15 AM</span>
                        <strong className="text-slate-800 block">Physics / Basic Sci</strong>
                      </div>
                      <div className="p-1 bg-amber-50 text-amber-800 font-bold text-[10px] rounded text-center">
                        Break (10:15 - 10:45)
                      </div>
                      <div className="p-2 bg-white rounded-lg shadow-2xs border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">10:45 - 11:30 AM</span>
                        <strong className="text-slate-800 block">Chemistry / Social</strong>
                      </div>
                      <div className="p-2 bg-white rounded-lg shadow-2xs border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">11:30 - 12:15 PM</span>
                        <strong className="text-slate-800 block">Biology / ICT Lab</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 font-display">Student Notice Board</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {announcements.map(ann => (
                <div key={ann.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                      {ann.category}
                    </span>
                    <span className="text-xs text-slate-400">{ann.publishedDate}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{ann.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                  <p className="text-[11px] text-slate-400 italic">By: {ann.author}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SECURITY / CHANGE PASSWORD */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-lg mx-auto">
            <h2 className="text-lg font-bold text-slate-900 font-display">Change Account Password</h2>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Keep your student result portal secure by choosing a strong password.
            </p>

            {passwordMsg && (
              <div className={`p-3.5 rounded-xl text-xs font-semibold mb-4 flex items-center gap-2 ${
                passwordMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {passwordMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-sm transition-colors cursor-pointer"
              >
                Update Password
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Terminal Report Card Modal */}
      {reportModalResult && (
        <ReportCardModal
          result={reportModalResult}
          student={student}
          onClose={() => setReportModalResult(null)}
        />
      )}
    </div>
  );
};
