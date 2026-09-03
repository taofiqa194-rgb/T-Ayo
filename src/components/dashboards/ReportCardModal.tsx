import React from 'react';
import { Printer, X, Award, CheckCircle, Shield } from 'lucide-react';
import { StudentResultRecord, Student } from '../../types';

interface ReportCardModalProps {
  result: StudentResultRecord;
  student?: Student;
  onClose: () => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  result,
  student,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 print:m-0 print:border-none print:shadow-none">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">Official Terminal Report Sheet</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Card Sheet Body */}
        <div className="p-6 sm:p-10 text-slate-900 text-sm print:p-6" id="printable-report-sheet">
          {/* Header & School Crest */}
          <div className="border-b-2 border-blue-900 pb-5 mb-6 text-center relative">
            <div className="flex items-center justify-between gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-800 to-emerald-700 flex flex-col items-center justify-center text-white shrink-0 shadow-md">
                <span className="text-2xl font-black font-display">T'AYO</span>
                <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-200">School</span>
              </div>

              <div className="flex-1 text-center">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-blue-950 font-display uppercase">
                  T'AYO COMPREHENSIVE SCHOOL
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-emerald-700 uppercase tracking-wider">
                  Primary & Secondary Sections • Ilorin, Kwara State
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Plot 12, Off Fate/University Road, Tanke GRA, Ilorin, Kwara State | Tel: 09076930244
                </p>
                <p className="text-[11px] text-slate-500 font-medium italic mt-0.5">
                  Motto: "Excellence in Character and Learning"
                </p>
                <div className="mt-2 inline-block px-4 py-1 rounded-full bg-blue-900 text-white text-xs font-bold uppercase tracking-widest">
                  Continuous Assessment & Terminal Report Sheet
                </div>
              </div>

              {/* Student Passport Photo */}
              <div className="w-20 h-24 rounded-lg border-2 border-slate-300 overflow-hidden bg-slate-100 shrink-0 shadow-xs flex items-center justify-center">
                {student?.photoUrl ? (
                  <img
                    src={student.photoUrl}
                    alt={result.studentName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-[10px] text-slate-400 text-center font-medium p-1">
                    Student Passport
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Student & Session Bio Data Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs mb-6">
            <div>
              <span className="text-slate-500 font-medium block">Student Name:</span>
              <strong className="text-slate-900 text-sm">{result.studentName}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Student ID Number:</span>
              <strong className="text-blue-800 text-sm font-mono">{result.studentNumber}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Class:</span>
              <strong className="text-slate-900 text-sm">{result.className}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Academic Session & Term:</span>
              <strong className="text-slate-900 text-sm">{result.session} — {result.term}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">School House:</span>
              <strong className="text-slate-800">{student?.house || 'Emerald'} House</strong>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Attendance:</span>
              <strong className="text-slate-800">{result.timesPresent} of {result.timesSchoolOpened} days</strong>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Class Position:</span>
              <strong className="text-emerald-700 text-sm font-extrabold">{result.classPosition}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Term Average:</span>
              <strong className="text-blue-700 text-sm font-extrabold">{result.overallAverage}%</strong>
            </div>
          </div>

          {/* Subject Scores Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr className="bg-blue-900 text-white text-center font-bold">
                  <th className="py-2.5 px-3 text-left border-r border-blue-800">Subject</th>
                  <th className="py-2.5 px-2 w-16 border-r border-blue-800">C.A (30)</th>
                  <th className="py-2.5 px-2 w-16 border-r border-blue-800">Exam (70)</th>
                  <th className="py-2.5 px-2 w-20 border-r border-blue-800 bg-blue-950">Total (100)</th>
                  <th className="py-2.5 px-2 w-14 border-r border-blue-800">Grade</th>
                  <th className="py-2.5 px-2 w-16 border-r border-blue-800">Position</th>
                  <th className="py-2.5 px-3 text-left">Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {result.subjects.map((sub, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                    <td className="py-2 px-3 font-semibold text-slate-800 border-r border-slate-200">
                      {sub.subject}
                    </td>
                    <td className="py-2 px-2 text-center text-slate-700 border-r border-slate-200">
                      {sub.caScore}
                    </td>
                    <td className="py-2 px-2 text-center text-slate-700 border-r border-slate-200">
                      {sub.examScore}
                    </td>
                    <td className="py-2 px-2 text-center font-bold text-blue-950 bg-blue-50/40 border-r border-slate-200">
                      {sub.totalScore}
                    </td>
                    <td className="py-2 px-2 text-center font-extrabold border-r border-slate-200">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${
                        sub.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-800' :
                        sub.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                        sub.grade.startsWith('C') ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {sub.grade}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center text-slate-600 font-medium border-r border-slate-200">
                      {sub.position}
                    </td>
                    <td className="py-2 px-3 text-slate-700 font-medium">
                      {sub.remark}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                  <td className="py-2.5 px-3 border-r border-slate-300 uppercase">
                    Cumulative Total ({result.subjects.length} Subjects)
                  </td>
                  <td colSpan={2} className="py-2.5 px-2 text-center border-r border-slate-300 text-slate-500">
                    Grand Total
                  </td>
                  <td className="py-2.5 px-2 text-center text-blue-900 bg-blue-100/50 border-r border-slate-300 font-extrabold">
                    {result.overallTotal}
                  </td>
                  <td colSpan={3} className="py-2.5 px-3 text-emerald-800 font-bold">
                    Terminal Average: {result.overallAverage}% • Rank: {result.classPosition}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Affective Domain & Grading Scale */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs">
            {/* Behavioural / Affective Domain */}
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2 text-[11px] border-b pb-1">
                Affective & Psychomotor Traits (Scale: 1-5)
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-600">
                <div className="flex justify-between"><span>Punctuality:</span><strong className="text-slate-800">5 / 5</strong></div>
                <div className="flex justify-between"><span>Neatness & Attire:</span><strong className="text-slate-800">5 / 5</strong></div>
                <div className="flex justify-between"><span>Politeness & Conduct:</span><strong className="text-slate-800">5 / 5</strong></div>
                <div className="flex justify-between"><span>Honesty & Integrity:</span><strong className="text-slate-800">5 / 5</strong></div>
                <div className="flex justify-between"><span>Leadership Initiative:</span><strong className="text-slate-800">4 / 5</strong></div>
                <div className="flex justify-between"><span>Sports & Athletics:</span><strong className="text-slate-800">4 / 5</strong></div>
              </div>
            </div>

            {/* WAEC / NECO Standard Key */}
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2 text-[11px] border-b pb-1">
                National Grading Key (WAEC / NECO)
              </h4>
              <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-600">
                <div><strong>A1:</strong> 75 - 100% (Dist.)</div>
                <div><strong>B2:</strong> 70 - 74% (V. Good)</div>
                <div><strong>B3:</strong> 65 - 69% (Good)</div>
                <div><strong>C4:</strong> 60 - 64% (Credit)</div>
                <div><strong>C5:</strong> 55 - 59% (Credit)</div>
                <div><strong>C6:</strong> 50 - 54% (Credit)</div>
                <div><strong>D7:</strong> 45 - 49% (Pass)</div>
                <div><strong>E8:</strong> 40 - 44% (Pass)</div>
                <div><strong>F9:</strong> 0 - 39% (Fail)</div>
              </div>
            </div>
          </div>

          {/* Remarks & Signatures */}
          <div className="space-y-4 pt-2 border-t border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 font-semibold block uppercase text-[10px]">Class Teacher's Remark:</span>
              <p className="italic text-slate-800 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-1">
                "{result.teacherRemark}"
              </p>
            </div>

            <div>
              <span className="text-slate-500 font-semibold block uppercase text-[10px]">Principal's Remark:</span>
              <p className="italic text-slate-800 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-1">
                "{result.principalRemark}"
              </p>
            </div>

            <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 items-end text-center">
              <div>
                <div className="border-b border-slate-400 pb-1 font-signature text-sm font-semibold text-slate-700">
                  Mrs. Aisha Mohammed
                </div>
                <p className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">Form Teacher</p>
              </div>

              <div className="hidden sm:block">
                <div className="w-16 h-16 mx-auto rounded-full border-2 border-dashed border-emerald-600/70 flex items-center justify-center p-1 text-center">
                  <span className="text-[8px] font-bold text-emerald-800 uppercase leading-tight">
                    T'AYO SCHOOL<br/>OFFICIAL SEAL<br/>ILORIN
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Institution Stamp</p>
              </div>

              <div>
                <div className="border-b border-slate-400 pb-1 font-signature text-sm font-semibold text-blue-900">
                  Dr. (Mrs.) Folashade Adeyinka
                </div>
                <p className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">Academic Principal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
