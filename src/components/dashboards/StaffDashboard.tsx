import React, { useState } from 'react';
import {
  Staff,
  Student,
  StudentResultRecord,
  SubjectResult
} from '../../types';
import { StorageService } from '../../services/storage';
import { computeNigerianGrade } from '../../data/initialData';
import {
  BookOpen,
  Users,
  Upload,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Save,
  Send,
  Award,
  Filter,
  User,
  Phone,
  Mail,
  Home,
  Edit3,
  Camera
} from 'lucide-react';

interface StaffDashboardProps {
  staff: Staff;
  onUpdateStaff: (updated: Staff) => void;
}

interface StudentGradeRow {
  studentId: string;
  studentNumber: string;
  studentName: string;
  photoUrl: string;
  caScore: number;
  examScore: number;
  totalScore: number;
  grade: 'A1' | 'B2' | 'B3' | 'C4' | 'C5' | 'C6' | 'D7' | 'E8' | 'F9';
  remark: string;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  staff,
  onUpdateStaff
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'classes' | 'profile' | 'password'>('upload');

  // Staff Profile Edit State
  const [editFullName, setEditFullName] = useState(staff.fullName);
  const [editPhone, setEditPhone] = useState(staff.phone || '09076930244');
  const [editEmail, setEditEmail] = useState(staff.email);
  const [editQualification, setEditQualification] = useState(staff.qualification);
  const [editRoleTitle, setEditRoleTitle] = useState(staff.roleTitle);
  const [editAddress, setEditAddress] = useState(staff.address || 'Staff Quarters / Fate Road, Ilorin, Kwara State');
  const [editPhotoUrl, setEditPhotoUrl] = useState(staff.photoUrl);
  const [staffProfileMsg, setStaffProfileMsg] = useState<string | null>(null);

  const handleStaffPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setEditPhotoUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveStaffProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Staff = {
      ...staff,
      fullName: editFullName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim(),
      qualification: editQualification.trim(),
      roleTitle: editRoleTitle.trim(),
      address: editAddress.trim(),
      photoUrl: editPhotoUrl
    };
    StorageService.saveStaff(updated);
    onUpdateStaff(updated);
    setStaffProfileMsg('Staff profile, contact phone, and details updated successfully!');
    setTimeout(() => setStaffProfileMsg(null), 5000);
  };

  // Grading form selectors
  const defaultClass = staff.assignedClasses[0] || 'SSS 2 Science';
  const defaultSubject = staff.assignedSubjects[0] || 'Mathematics';

  const [selectedClass, setSelectedClass] = useState<string>(defaultClass);
  const [selectedSubject, setSelectedSubject] = useState<string>(defaultSubject);
  const [selectedSession, setSelectedSession] = useState<string>('2024/2025');
  const [selectedTerm, setSelectedTerm] = useState<'1st Term' | '2nd Term' | '3rd Term'>('1st Term');

  // Load students for the selected class
  const allStudents = StorageService.getStudents();
  const classStudents = allStudents.filter(s => s.className.toLowerCase() === selectedClass.toLowerCase());

  // Existing results
  const allResults = StorageService.getResults();

  // Initialize roster state from existing results or default zeroes
  const buildInitialRoster = (): StudentGradeRow[] => {
    return classStudents.map(student => {
      // Check if student already has a result record for this session/term
      const existingRecord = allResults.find(
        r => r.studentNumber.toLowerCase() === student.studentNumber.toLowerCase() &&
             r.session === selectedSession &&
             r.term === selectedTerm
      );
      const existingSubject = existingRecord?.subjects.find(
        s => s.subject.toLowerCase() === selectedSubject.toLowerCase()
      );

      const ca = existingSubject?.caScore ?? 25;
      const exam = existingSubject?.examScore ?? 55;
      const total = ca + exam;
      const { grade, remark } = computeNigerianGrade(total);

      return {
        studentId: student.id,
        studentNumber: student.studentNumber,
        studentName: `${student.firstName} ${student.lastName}`,
        photoUrl: student.photoUrl,
        caScore: ca,
        examScore: exam,
        totalScore: total,
        grade,
        remark
      };
    });
  };

  const [roster, setRoster] = useState<StudentGradeRow[]>(buildInitialRoster());
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // When filters change, rebuild roster
  const handleFilterChange = (newClass: string, newSubject: string, newSession: string, newTerm: any) => {
    setSelectedClass(newClass);
    setSelectedSubject(newSubject);
    setSelectedSession(newSession);
    setSelectedTerm(newTerm);

    const targetStudents = allStudents.filter(s => s.className.toLowerCase() === newClass.toLowerCase());
    const newRoster = targetStudents.map(student => {
      const existingRecord = allResults.find(
        r => r.studentNumber.toLowerCase() === student.studentNumber.toLowerCase() &&
             r.session === newSession &&
             r.term === newTerm
      );
      const existingSubject = existingRecord?.subjects.find(
        s => s.subject.toLowerCase() === newSubject.toLowerCase()
      );

      const ca = existingSubject?.caScore ?? 20;
      const exam = existingSubject?.examScore ?? 50;
      const total = ca + exam;
      const { grade, remark } = computeNigerianGrade(total);

      return {
        studentId: student.id,
        studentNumber: student.studentNumber,
        studentName: `${student.firstName} ${student.lastName}`,
        photoUrl: student.photoUrl,
        caScore: ca,
        examScore: exam,
        totalScore: total,
        grade,
        remark
      };
    });
    setRoster(newRoster);
  };

  const handleScoreChange = (index: number, field: 'ca' | 'exam', val: number) => {
    const updated = [...roster];
    const row = { ...updated[index] };

    if (field === 'ca') {
      row.caScore = Math.min(30, Math.max(0, isNaN(val) ? 0 : val));
    } else {
      row.examScore = Math.min(70, Math.max(0, isNaN(val) ? 0 : val));
    }

    row.totalScore = row.caScore + row.examScore;
    const { grade, remark } = computeNigerianGrade(row.totalScore);
    row.grade = grade;
    row.remark = remark;

    updated[index] = row;
    setRoster(updated);
  };

  const handleSaveResults = (isPublish: boolean) => {
    setStatusMessage(null);

    // Sort to determine positions for this subject
    const sorted = [...roster].sort((a, b) => b.totalScore - a.totalScore);

    roster.forEach(row => {
      const posIdx = sorted.findIndex(s => s.studentNumber === row.studentNumber) + 1;
      const suffix = posIdx === 1 ? 'st' : posIdx === 2 ? 'nd' : posIdx === 3 ? 'rd' : 'th';
      const posString = `${posIdx}${suffix}`;

      const existingRecord = allResults.find(
        r => r.studentNumber.toLowerCase() === row.studentNumber.toLowerCase() &&
             r.session === selectedSession &&
             r.term === selectedTerm
      );

      const subjectResult: SubjectResult = {
        subject: selectedSubject,
        caScore: row.caScore,
        examScore: row.examScore,
        totalScore: row.totalScore,
        grade: row.grade,
        position: posString,
        remark: row.remark
      };

      if (existingRecord) {
        // Update or append subject
        const subIndex = existingRecord.subjects.findIndex(
          s => s.subject.toLowerCase() === selectedSubject.toLowerCase()
        );
        if (subIndex >= 0) {
          existingRecord.subjects[subIndex] = subjectResult;
        } else {
          existingRecord.subjects.push(subjectResult);
        }

        // Recalculate totals
        const total = existingRecord.subjects.reduce((sum, s) => sum + s.totalScore, 0);
        existingRecord.overallTotal = total;
        existingRecord.overallAverage = Number((total / existingRecord.subjects.length).toFixed(2));
        existingRecord.status = isPublish ? 'Published' : 'Draft';
        existingRecord.updatedAt = new Date().toISOString().split('T')[0];

        StorageService.saveResult(existingRecord);
      } else {
        // Create new record
        const newRecord: StudentResultRecord = {
          id: 'res-' + Date.now() + '-' + row.studentNumber.replace(/[^a-zA-Z0-9]/g, ''),
          studentId: row.studentId,
          studentNumber: row.studentNumber,
          studentName: row.studentName,
          className: selectedClass,
          session: selectedSession,
          term: selectedTerm,
          subjects: [subjectResult],
          overallTotal: row.totalScore,
          overallAverage: row.totalScore,
          classPosition: '1st of ' + roster.length,
          teacherRemark: 'Satisfactory performance. Continue working consistently.',
          principalRemark: 'Approved terminal grading.',
          timesSchoolOpened: 120,
          timesPresent: 118,
          status: isPublish ? 'Published' : 'Draft',
          updatedAt: new Date().toISOString().split('T')[0]
        };
        StorageService.saveResult(newRecord);
      }
    });

    setStatusMessage({
      type: 'success',
      text: isPublish
        ? `Successfully submitted and published ${selectedSubject} scores for ${selectedClass}!`
        : `Draft scores saved locally for ${selectedSubject}.`
    });

    setTimeout(() => setStatusMessage(null), 5000);
  };

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);
    if (oldPassword !== (staff.password || 'password123')) {
      setPwdMsg({ type: 'error', text: 'Current password is incorrect.' });
      return;
    }
    if (newPassword.length < 6) {
      setPwdMsg({ type: 'error', text: 'New password must have at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    const ok = StorageService.updateStaffPassword(staff.staffId, newPassword);
    if (ok) {
      onUpdateStaff({ ...staff, password: newPassword });
      setPwdMsg({ type: 'success', text: 'Password successfully updated!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Staff Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-emerald-100 bg-slate-100 shadow-md">
              <img
                src={staff.photoUrl}
                alt={staff.fullName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">{staff.fullName}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-50 text-[#008751] border border-emerald-200">
                  Academic Faculty
                </span>
              </div>
              <p className="text-xs font-black text-[#003087] mt-1 tracking-wider uppercase">
                Staff ID: <span className="font-mono text-sm text-[#008751]">{staff.staffId}</span> • {staff.qualification}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-500 mt-2.5">
                <span className="bg-slate-100 px-3 py-1 rounded-lg font-bold text-slate-800">
                  Role: {staff.roleTitle}
                </span>
                <span className="bg-slate-100 px-3 py-1 rounded-lg font-bold text-slate-800">
                  Subjects: {staff.assignedSubjects.join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2">
          {[
            { id: 'upload', label: 'Upload & Edit Student Results', icon: Upload },
            { id: 'classes', label: 'Assigned Classes & Students', icon: Users },
            { id: 'profile', label: 'Edit Staff Profile', icon: User },
            { id: 'password', label: 'Change Password', icon: KeyRound }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`staff-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#008751] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: RESULT UPLOAD & EDITING */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            {/* Filter / Selector Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Filter className="w-4 h-4 text-emerald-700" />
                <span>Select Class, Subject & Assessment Term</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Class</label>
                  <select
                    id="staff-select-class"
                    value={selectedClass}
                    onChange={e => handleFilterChange(e.target.value, selectedSubject, selectedSession, selectedTerm)}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600"
                  >
                    {staff.assignedClasses.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="Primary 5 Alpha">Primary 5 Alpha</option>
                    <option value="Primary 4 Diamond">Primary 4 Diamond</option>
                    <option value="JSS 1 Gold">JSS 1 Gold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    id="staff-select-subject"
                    value={selectedSubject}
                    onChange={e => handleFilterChange(selectedClass, e.target.value, selectedSession, selectedTerm)}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600"
                  >
                    {staff.assignedSubjects.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                    <option value="Mathematics">Mathematics</option>
                    <option value="English Language">English Language</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Session</label>
                  <select
                    id="staff-select-session"
                    value={selectedSession}
                    onChange={e => handleFilterChange(selectedClass, selectedSubject, e.target.value, selectedTerm)}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="2024/2025">2024/2025</option>
                    <option value="2023/2024">2023/2024</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Term</label>
                  <select
                    id="staff-select-term"
                    value={selectedTerm}
                    onChange={e => handleFilterChange(selectedClass, selectedSubject, selectedSession, e.target.value as any)}
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="1st Term">1st Term</option>
                    <option value="2nd Term">2nd Term</option>
                    <option value="3rd Term">3rd Term</option>
                  </select>
                </div>
              </div>
            </div>

            {statusMessage && (
              <div className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-900 border border-red-200'
              }`}>
                {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
                {statusMessage.text}
              </div>
            )}

            {/* Grading Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-base font-display">
                    Score Sheet: {selectedSubject} — {selectedClass}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Max Continuous Assessment: 30 Marks | Max Terminal Exam: 70 Marks | Passing Score: 40%
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSaveResults(false)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Draft</span>
                  </button>
                  <button
                    id="staff-publish-results-btn"
                    onClick={() => handleSaveResults(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit & Publish Results</span>
                  </button>
                </div>
              </div>

              {roster.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold">No students found registered under {selectedClass}.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold">
                      <tr>
                        <th className="py-3 px-4 w-12 text-center">#</th>
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-3">Student Number</th>
                        <th className="py-3 px-3 w-28 text-center">C.A Score (30)</th>
                        <th className="py-3 px-3 w-28 text-center">Exam Score (70)</th>
                        <th className="py-3 px-3 w-24 text-center">Total (100)</th>
                        <th className="py-3 px-3 w-20 text-center">Grade</th>
                        <th className="py-3 px-4">Remark</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {roster.map((row, idx) => (
                        <tr key={row.studentId} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 text-center font-bold text-slate-400">{idx + 1}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={row.photoUrl}
                                alt={row.studentName}
                                className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <span className="font-semibold text-slate-900">{row.studentName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono text-xs font-bold text-blue-700">
                            {row.studentNumber}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <input
                              type="number"
                              min="0"
                              max="30"
                              value={row.caScore}
                              onChange={e => handleScoreChange(idx, 'ca', parseInt(e.target.value))}
                              className="w-20 text-center px-2 py-1.5 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                            />
                          </td>
                          <td className="py-3 px-3 text-center">
                            <input
                              type="number"
                              min="0"
                              max="70"
                              value={row.examScore}
                              onChange={e => handleScoreChange(idx, 'exam', parseInt(e.target.value))}
                              className="w-20 text-center px-2 py-1.5 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                            />
                          </td>
                          <td className="py-3 px-3 text-center font-black text-slate-900 text-base">
                            {row.totalScore}
                          </td>
                          <td className="py-3 px-3 text-center font-black">
                            <span className={`px-2 py-0.5 rounded text-xs ${
                              row.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-800' :
                              row.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                              row.grade.startsWith('C') ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {row.grade}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-700">
                            {row.remark}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ASSIGNED CLASSES & STUDENTS */}
        {activeTab === 'classes' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Class Directory: {selectedClass} ({classStudents.length} Students)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {classStudents.map(st => (
                  <div key={st.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <img
                      src={st.photoUrl}
                      alt={st.firstName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-300 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1 text-xs">
                      <p className="font-bold text-slate-900 text-sm">{st.firstName} {st.lastName}</p>
                      <p className="font-mono text-blue-700 font-semibold">{st.studentNumber}</p>
                      <p className="text-slate-500">Guardian: {st.guardianName} ({st.guardianPhone})</p>
                      <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">
                        House: {st.house}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STAFF PROFILE EDITING */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 font-display">Staff Profile & Contact Settings</h2>
                <p className="text-xs text-slate-500">Update your teacher profile, direct phone line, qualification, and portal avatar.</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-[#003087] border border-blue-200 w-fit">
                Faculty Member • {staff.staffId}
              </span>
            </div>

            {staffProfileMsg && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-[#008751] rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-[#008751] shrink-0" />
                <span>{staffProfileMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveStaffProfile} className="space-y-6">
              {/* Photo & Identity Banner */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="relative group">
                  <img
                    src={editPhotoUrl}
                    alt={editFullName}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-slate-200"
                  />
                  <label
                    htmlFor="staff-photo-upload"
                    className="absolute inset-0 bg-slate-950/60 rounded-2xl text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold"
                  >
                    <Camera className="w-5 h-5 mb-1" />
                    <span>Change Photo</span>
                  </label>
                  <input
                    id="staff-photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleStaffPhotoUpload}
                    className="hidden"
                  />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="font-bold text-slate-900 text-base">{editFullName}</h3>
                  <p className="text-xs text-slate-500">{editRoleTitle}</p>
                  <p className="text-[11px] text-slate-400">Click photo or use button to upload a professional passport image (JPG/PNG max 2MB)</p>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-sm">
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                    Full Legal Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={editFullName}
                    onChange={e => setEditFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#008751]"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                    Official Mobile Telephone *
                  </label>
                  <input
                    required
                    type="tel"
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    placeholder="09076930244"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-[#008751]"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                    Staff Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#008751]"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                    Academic Qualifications *
                  </label>
                  <input
                    required
                    type="text"
                    value={editQualification}
                    onChange={e => setEditQualification(e.target.value)}
                    placeholder="e.g. B.Sc (Ed) Mathematics, TRCN Certified"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#008751]"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                    Faculty Role Title *
                  </label>
                  <input
                    required
                    type="text"
                    value={editRoleTitle}
                    onChange={e => setEditRoleTitle(e.target.value)}
                    placeholder="e.g. Senior Mathematics Teacher"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#008751]"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                    Residential Address *
                  </label>
                  <input
                    required
                    type="text"
                    value={editAddress}
                    onChange={e => setEditAddress(e.target.value)}
                    placeholder="e.g. Plot 8, Fate Road, Ilorin, Kwara State"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#008751]"
                  />
                </div>
              </div>

              {/* Departmental Allocations (Read-Only) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <span className="font-black text-slate-600 uppercase text-[10px] tracking-wider block">
                  Institutional Class & Subject Allocations
                </span>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-white px-3 py-1 rounded-lg border border-slate-200 font-bold text-slate-800">
                    Assigned Classes: {staff.assignedClasses.join(', ')}
                  </span>
                  <span className="bg-white px-3 py-1 rounded-lg border border-slate-200 font-bold text-slate-800">
                    Assigned Subjects: {staff.assignedSubjects.join(', ')}
                  </span>
                  <span className="bg-white px-3 py-1 rounded-lg border border-slate-200 font-bold text-slate-800 capitalize">
                    Section: {staff.assignedSection} School
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Staff Profile</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: PASSWORD CHANGE */}
        {activeTab === 'password' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-md mx-auto">
            <h2 className="text-lg font-bold text-slate-900 font-display">Update Staff Access Password</h2>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Ensure you use a secure key to protect student academic marks.
            </p>

            {pwdMsg && (
              <div className={`p-3.5 rounded-xl text-xs font-semibold mb-4 flex items-center gap-2 ${
                pwdMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {pwdMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
                {pwdMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
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
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
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
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm transition-colors cursor-pointer"
              >
                Change Password
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
