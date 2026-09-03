import React, { useState } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Calendar,
  CreditCard,
  Printer,
  ChevronRight,
  ShieldCheck,
  User,
  Sparkles
} from 'lucide-react';
import { AdmissionApplication } from '../../types';
import { StorageService } from '../../services/storage';

export const AdmissionPage: React.FC = () => {
  const config = StorageService.getConfig();

  // Form State
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [section, setSection] = useState<'primary' | 'secondary'>('secondary');
  const [classApplyingFor, setClassApplyingFor] = useState('JSS 1');
  const [previousSchool, setPreviousSchool] = useState('');
  const [lastClassPassed, setLastClassPassed] = useState('');

  // Parent / Guardian
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentRelationship, setParentRelationship] = useState('Parent');
  const [residentialAddress, setResidentialAddress] = useState('Ilorin, Kwara State');

  // Documents & Photos
  const [passportPhoto, setPassportPhoto] = useState<string>('');
  const [birthCertName, setBirthCertName] = useState<string>('');
  const [reportCardName, setReportCardName] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Result state
  const [submittedApp, setSubmittedApp] = useState<AdmissionApplication | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg('Passport photo must be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPassportPhoto(reader.result as string);
        setErrorMsg(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentChange = (type: 'birth' | 'report', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'birth') {
        setBirthCertName(file.name);
      } else {
        setReportCardName(file.name);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setErrorMsg('Please confirm that the submitted information is accurate.');
      return;
    }

    const appNumber = `TAYO-APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: AdmissionApplication = {
      id: 'app-' + Date.now(),
      applicationNumber: appNumber,
      fullName,
      gender,
      dateOfBirth,
      section,
      classApplyingFor,
      previousSchool,
      parentName,
      parentPhone,
      parentEmail,
      parentRelationship,
      residentialAddress,
      status: 'Pending',
      submittedAt: new Date().toISOString().split('T')[0],
      submittedDate: new Date().toISOString().split('T')[0],
      passportPhoto: passportPhoto || 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=400&auto=format&fit=crop&q=80',
      birthCertificateName: birthCertName || 'Birth_Certificate.pdf',
      previousReportCardName: reportCardName || 'Last_Term_Report.pdf'
    };

    StorageService.submitApplication(newApp);
    setSubmittedApp(newApp);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Banner */}
      <div className="bg-[#003087] text-white py-16 px-4 sm:px-6 lg:px-8 text-center border-b border-blue-900">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#008751] text-white text-xs font-black uppercase tracking-widest">
            {config.activeSession} Academic Session
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white">
            Online Admission Portal
          </h1>
          <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed font-normal">
            Apply online for admission into T'AYO Primary and Secondary School, Ilorin, Kwara State. Transparent review and immediate reference generation.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {submittedApp ? (
          /* ========================================================
             ADMISSION APPLICATION SUCCESS SLIP
             ======================================================== */
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border-2 border-[#008751] p-8 sm:p-10 shadow-2xl space-y-6">
            <div className="text-center space-y-2 pb-6 border-b border-slate-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#008751] mx-auto flex items-center justify-center mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-[#008751] text-xs font-black tracking-wider uppercase">
                Application Received Successfully
              </span>
              <h2 className="text-2xl font-black text-slate-900 font-display tracking-tight">
                T'AYO School Admission Slip
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Please print or save this slip. Bring a physical copy to the School Admissions Office for the entrance assessment.
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Application Reference</span>
                <strong className="text-lg font-mono font-black text-[#003087]">
                  {submittedApp.applicationNumber}
                </strong>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Submission Date</span>
                <strong className="text-sm text-slate-800 font-bold">{submittedApp.submittedDate}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
              <div className="flex justify-center sm:justify-start">
                <img
                  src={submittedApp.passportPhoto}
                  alt={submittedApp.fullName}
                  className="w-28 h-36 rounded-2xl object-cover border-2 border-slate-300 shadow-md"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="sm:col-span-2 text-xs space-y-2 text-slate-700">
                <p><strong>Applicant Name:</strong> <span className="text-sm font-black text-slate-900">{submittedApp.fullName}</span></p>
                <p><strong>Applying For:</strong> <span className="font-bold">{submittedApp.classApplyingFor} ({submittedApp.section.toUpperCase()})</span></p>
                <p><strong>Date of Birth:</strong> {submittedApp.dateOfBirth} ({submittedApp.gender})</p>
                <p><strong>Parent / Guardian:</strong> {submittedApp.parentName} ({submittedApp.parentRelationship})</p>
                <p><strong>Telephone:</strong> <span className="font-mono font-bold">{submittedApp.parentPhone}</span></p>
                <p><strong>Email:</strong> {submittedApp.parentEmail}</p>
                <p><strong>Address:</strong> {submittedApp.residentialAddress}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs space-y-1 text-blue-900">
              <p className="font-black flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#003087]" />
                Next Steps & Entrance Examination:
              </p>
              <p>• Entrance Examination & Oral Interview: <strong>Every Saturday (9:00 AM – 12:00 PM)</strong></p>
              <p>• Venue: T'AYO School Main Hall, University Road, Ilorin, Kwara State.</p>
              <p>• Bring: 2 Passport Photographs, Writing Materials & Copy of this Slip.</p>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3.5 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print Application Slip</span>
              </button>
              <button
                onClick={() => setSubmittedApp(null)}
                className="py-3.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
              >
                Submit Another Form
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================
             ADMISSION APPLICATION FORM & REQUIREMENTS
             ======================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Form */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div>
                <p className="text-xs font-black text-[#008751] uppercase tracking-widest">Enrollment Details</p>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display tracking-tight">
                  Student Enrolment Form
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-normal">
                  Please complete all fields accurately. Once approved, official student portal login credentials will be issued.
                </p>
              </div>

              {errorMsg && (
                <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 text-xs sm:text-sm">
                {/* 1. Academic Placement */}
                <div className="space-y-4">
                  <h3 className="font-black text-xs text-slate-900 border-b border-slate-200 pb-2 uppercase tracking-widest">
                    1. Academic Section & Class
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                        Select Academic Section *
                      </label>
                      <select
                        value={section}
                        onChange={e => {
                          const sec = e.target.value as 'primary' | 'secondary';
                          setSection(sec);
                          setClassApplyingFor(sec === 'primary' ? 'Primary 1' : 'JSS 1');
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold focus:ring-2 focus:ring-[#003087] focus:outline-none"
                      >
                        <option value="primary">Primary School (Creche to Pry 6)</option>
                        <option value="secondary">Secondary School (JSS 1 to SSS 2)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                        Class Applying For *
                      </label>
                      <select
                        value={classApplyingFor}
                        onChange={e => setClassApplyingFor(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold focus:ring-2 focus:ring-[#003087] focus:outline-none"
                      >
                        {section === 'primary' ? (
                          <>
                            <option value="Creche & Playgroup">Creche & Playgroup</option>
                            <option value="Nursery 1">Nursery 1</option>
                            <option value="Nursery 2">Nursery 2</option>
                            <option value="Primary 1">Primary 1</option>
                            <option value="Primary 2">Primary 2</option>
                            <option value="Primary 3">Primary 3</option>
                            <option value="Primary 4">Primary 4</option>
                            <option value="Primary 5">Primary 5</option>
                            <option value="Primary 6">Primary 6</option>
                          </>
                        ) : (
                          <>
                            <option value="JSS 1">Junior Secondary 1 (JSS 1)</option>
                            <option value="JSS 2">Junior Secondary 2 (JSS 2)</option>
                            <option value="JSS 3">Junior Secondary 3 (JSS 3)</option>
                            <option value="SSS 1 Science">Senior Secondary 1 - Science (SSS 1)</option>
                            <option value="SSS 1 Arts">Senior Secondary 1 - Arts (SSS 1)</option>
                            <option value="SSS 1 Commercial">Senior Secondary 1 - Commercial (SSS 1)</option>
                            <option value="SSS 2 Science">Senior Secondary 2 - Science (SSS 2)</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Pupil / Student Biodata */}
                <div className="space-y-4">
                  <h3 className="font-black text-xs text-slate-900 border-b border-slate-200 pb-2 uppercase tracking-widest">
                    2. Pupil / Student Biodata
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                        Full Legal Name (Surname First) *
                      </label>
                      <input
                        required
                        type="text"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="e.g. ADEYEMI Samuel Oluwaseun"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#003087] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">Gender *</label>
                      <select
                        value={gender}
                        onChange={e => setGender(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold focus:ring-2 focus:ring-[#003087]"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                        Date of Birth *
                      </label>
                      <input
                        required
                        type="date"
                        value={dateOfBirth}
                        onChange={e => setDateOfBirth(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#003087]"
                      />
                    </div>

                    <div>
                      <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                        Previous School Attended (If Any)
                      </label>
                      <input
                        type="text"
                        value={previousSchool}
                        onChange={e => setPreviousSchool(e.target.value)}
                        placeholder="e.g. St. Claire's Nursery School, Ilorin"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#003087]"
                      />
                    </div>
                  </div>

                  {/* Passport Photo Upload */}
                  <div>
                    <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                      Upload Passport Photograph (Clear White Background)
                    </label>
                    <div className="flex items-center gap-4">
                      {passportPhoto ? (
                        <img
                          src={passportPhoto}
                          alt="Preview"
                          className="w-20 h-24 rounded-xl object-cover border-2 border-[#008751] shadow-xs"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-20 h-24 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                          <User className="w-6 h-6" />
                          <span className="text-[10px] mt-1 font-bold">Photo</span>
                        </div>
                      )}
                      <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 flex items-center gap-2 transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>Choose Passport Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* 3. Parent / Guardian Information */}
                <div className="space-y-4">
                  <h3 className="font-black text-xs text-slate-900 border-b border-slate-200 pb-2 uppercase tracking-widest">
                    3. Parent / Guardian Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                        Parent / Guardian Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        value={parentName}
                        onChange={e => setParentName(e.target.value)}
                        placeholder="e.g. Mr. & Mrs. O. Adeyemi"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#003087] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                        Relationship to Applicant *
                      </label>
                      <select
                        value={parentRelationship}
                        onChange={e => setParentRelationship(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold focus:ring-2 focus:ring-[#003087]"
                      >
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Guardian">Legal Guardian</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                        Phone Number (WhatsApp Preferred) *
                      </label>
                      <input
                        required
                        type="tel"
                        value={parentPhone}
                        onChange={e => setParentPhone(e.target.value)}
                        placeholder="+234 803 123 4567"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-[#003087]"
                      />
                    </div>

                    <div>
                      <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                        Parent Email Address *
                      </label>
                      <input
                        required
                        type="email"
                        value={parentEmail}
                        onChange={e => setParentEmail(e.target.value)}
                        placeholder="parent@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#003087]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                      Residential Home Address in Ilorin / Kwara State *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={residentialAddress}
                      onChange={e => setResidentialAddress(e.target.value)}
                      placeholder="e.g. Plot 14, University Road, Tanke, Ilorin, Kwara State"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#003087]"
                    ></textarea>
                  </div>
                </div>

                {/* 4. Supporting Document Attachments */}
                <div className="space-y-4">
                  <h3 className="font-black text-xs text-slate-900 border-b border-slate-200 pb-2 uppercase tracking-widest">
                    4. Supporting Documents (Optional during online filing)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="font-black text-xs text-slate-800 block">Birth Certificate</span>
                      <label className="cursor-pointer text-xs text-[#003087] font-bold block">
                        {birthCertName ? `Attached: ${birthCertName}` : 'Attach PDF/Image'}
                        <input
                          type="file"
                          onChange={e => handleDocumentChange('birth', e)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="font-black text-xs text-slate-800 block">Last Academic Report Card</span>
                      <label className="cursor-pointer text-xs text-[#003087] font-bold block">
                        {reportCardName ? `Attached: ${reportCardName}` : 'Attach PDF/Image'}
                        <input
                          type="file"
                          onChange={e => handleDocumentChange('report', e)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Declaration & Submit */}
                <div className="pt-2 space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms-check"
                      checked={agreeTerms}
                      onChange={e => setAgreeTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 text-[#008751] rounded cursor-pointer"
                    />
                    <label htmlFor="terms-check" className="text-xs text-slate-600 cursor-pointer font-medium">
                      I declare that the information provided in this admission form is truthful and accurate to the best of my knowledge. I understand that falsification will lead to immediate forfeiture of admission.
                    </label>
                  </div>

                  <button
                    id="submit-admission-btn"
                    type="submit"
                    className="w-full py-4 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-black text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Submit Online Admission Application</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right Information & FAQs */}
            <div className="lg:col-span-4 space-y-6">
              {/* Admission Timeline */}
              <div className="bg-[#003087] text-white rounded-3xl p-6 shadow-md space-y-4 border border-blue-900">
                <div className="flex items-center gap-2 text-emerald-300">
                  <Calendar className="w-5 h-5" />
                  <h3 className="font-black text-base font-display">2024/2025 Admission Key Dates</h3>
                </div>

                <div className="space-y-3 text-xs text-blue-100">
                  <div className="pb-2 border-b border-blue-800/80">
                    <p className="font-black text-white">Online Application Window:</p>
                    <p className="text-emerald-300 font-bold">Currently Open & Ongoing</p>
                  </div>
                  <div className="pb-2 border-b border-blue-800/80">
                    <p className="font-black text-white">Entrance Screening Exam:</p>
                    <p>Every Saturday by 9:00 AM at the College Campus, Tanke, Ilorin.</p>
                  </div>
                  <div>
                    <p className="font-black text-white">Result & Admission Offer Letters:</p>
                    <p>Within 48 hours following the assessment.</p>
                  </div>
                </div>
              </div>

              {/* Requirements Checklist */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
                <h3 className="font-black text-slate-900 text-base font-display">
                  Documents Needed for Physical Verification
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#008751] shrink-0 mt-0.5" />
                    <span>Photocopy of Birth Certificate (National Population Commission)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#008751] shrink-0 mt-0.5" />
                    <span>Four (4) recent passport-sized photographs on red or white background</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#008751] shrink-0 mt-0.5" />
                    <span>Last term’s terminal report card from previous school</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#008751] shrink-0 mt-0.5" />
                    <span>Medical fitness certificate & immunization card (for Primary)</span>
                  </li>
                </ul>
              </div>

              {/* Admissions Helpline */}
              <div className="p-6 rounded-3xl bg-blue-50 border border-blue-200 text-xs space-y-2 text-blue-900">
                <h4 className="font-black text-sm text-[#003087]">Need Help with Your Application?</h4>
                <p className="font-semibold">Call or WhatsApp our Admissions Registrar:</p>
                <p className="font-mono font-black text-base text-[#003087]">09076930244</p>
                <p className="text-slate-600 text-[11px] font-semibold">Email: admissions@tayoschool.edu.ng</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
