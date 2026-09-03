import React, { useState } from 'react';
import {
  CreditCard,
  Building2,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Printer,
  ShieldCheck,
  ArrowRight,
  Phone,
  FileText,
  DollarSign,
  HelpCircle
} from 'lucide-react';
import { Student, FeePayment } from '../../types';
import { StorageService } from '../../services/storage';

interface FeePaymentSectionProps {
  student: Student;
  activeSession: string;
  activeTerm: '1st Term' | '2nd Term' | '3rd Term';
}

export const FeePaymentSection: React.FC<FeePaymentSectionProps> = ({
  student,
  activeSession,
  activeTerm
}) => {
  const [copied, setCopied] = useState(false);
  const [payments, setPayments] = useState<FeePayment[]>(() =>
    StorageService.getStudentFeePayments(student.studentNumber)
  );
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [viewReceipt, setViewReceipt] = useState<FeePayment | null>(null);

  // Form states
  const [amount, setAmount] = useState<string>('105000');
  const [payerName, setPayerName] = useState<string>(student.guardianName || `${student.firstName} ${student.lastName}`);
  const [payerPhone, setPayerPhone] = useState<string>(student.guardianPhone || '09076930244');
  const [sourceBank, setSourceBank] = useState<string>('Moniepoint');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const officialAccount = {
    bankName: 'Moniepoint',
    accountNumber: '9076930244',
    accountName: 'Abbas Taofiq Ayomide',
    schoolPhone: '09076930244'
  };

  // Determine standard class term fee
  const isSecondary = student.section === 'secondary';
  const isSenior = student.className.startsWith('SSS');
  const standardTermFee = isSenior ? 105000 : isSecondary ? 95000 : 75000;

  // Calculate fees paid for the active term
  const termPayments = payments.filter(
    p => p.session === activeSession && p.term === activeTerm
  );
  const verifiedPaid = termPayments
    .filter(p => p.status === 'Verified')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingPaid = termPayments
    .filter(p => p.status === 'Pending Verification')
    .reduce((sum, p) => sum + p.amount, 0);
  const balanceDue = Math.max(0, standardTermFee - verifiedPaid);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(officialAccount.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) {
      alert('Please enter your Bank Transaction Reference / Session ID.');
      return;
    }

    const newPayment: FeePayment = {
      id: `pay-${Date.now()}`,
      studentId: student.id,
      studentNumber: student.studentNumber,
      studentName: `${student.firstName} ${student.lastName}`,
      className: student.className,
      session: activeSession,
      term: activeTerm,
      amount: Number(amount) || standardTermFee,
      totalFees: standardTermFee,
      status: 'Pending Verification',
      payerName: payerName.trim(),
      payerPhone: payerPhone.trim(),
      paymentMethod: `Transfer via ${sourceBank}`,
      bankName: officialAccount.bankName,
      accountNumber: officialAccount.accountNumber,
      accountName: officialAccount.accountName,
      transactionRef: transactionRef.trim(),
      paymentDate,
      receiptNote: notes.trim() || 'Proof of payment submitted via Student Portal.',
      createdAt: new Date().toISOString()
    };

    StorageService.submitFeePayment(newPayment);
    const updated = StorageService.getStudentFeePayments(student.studentNumber);
    setPayments(updated);
    setShowSubmitModal(false);
    setTransactionRef('');
    setSubmitSuccess('Your school fees payment proof has been submitted successfully! The accounts office will verify and update your receipt.');
    setTimeout(() => setSubmitSuccess(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Official Payment Destination Card */}
      <div className="bg-gradient-to-br from-[#003087] via-[#002568] to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-[#008751]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-black uppercase tracking-wider backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official School Fee Payment Account</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
              Direct Bank Transfer Details
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pay all tuition, development levies, exam registrations, and school charges directly to the designated school account below using your bank app, USSD, or any Moniepoint POS agent.
            </p>
          </div>

          {/* Account Details Box */}
          <div className="w-full lg:w-auto bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-5 sm:p-6 space-y-4 shrink-0 min-w-[280px] sm:min-w-[340px]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-300">Bank Name</span>
              <span className="font-extrabold text-base text-white flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-400" />
                {officialAccount.bankName}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-300 block">Account Number</span>
                <span className="font-mono font-black text-2xl text-emerald-400 tracking-wider">
                  {officialAccount.accountNumber}
                </span>
              </div>
              <button
                id="copy-fee-account-btn"
                onClick={handleCopyAccount}
                className="px-3.5 py-2 rounded-xl bg-white text-[#003087] hover:bg-emerald-50 text-xs font-black flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                title="Copy Account Number"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-300">Account Name</span>
              <span className="font-bold text-sm text-white text-right">
                {officialAccount.accountName}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-slate-300">Support / Confirmation:</span>
              <a
                href={`tel:${officialAccount.schoolPhone}`}
                className="font-mono font-bold text-emerald-300 hover:underline flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                {officialAccount.schoolPhone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {submitSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-[#008751] rounded-2xl text-xs font-bold flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{submitSuccess}</span>
        </div>
      )}

      {/* Term Fee Overview & Action */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-1.5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Total Term Fees ({activeTerm})
          </span>
          <p className="text-2xl font-black text-slate-900 font-display">
            ₦{standardTermFee.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500 font-medium block">
            Class: {student.className}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-1.5">
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
            Verified Amount Paid
          </span>
          <p className="text-2xl font-black text-[#008751] font-display">
            ₦{verifiedPaid.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500 font-medium block">
            {verifiedPaid >= standardTermFee ? '100% Cleared' : `${Math.round((verifiedPaid / standardTermFee) * 100)}% Settled`}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-1.5">
          <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
            Pending Confirmation
          </span>
          <p className="text-2xl font-black text-amber-700 font-display">
            ₦{pendingPaid.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500 font-medium block">
            Awaiting Bursary vetting
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Outstanding Balance
            </span>
            <p className={`text-2xl font-black font-display ${balanceDue === 0 ? 'text-[#008751]' : 'text-red-700'}`}>
              ₦{balanceDue.toLocaleString()}
            </p>
          </div>
          <button
            id="notify-fee-payment-btn"
            onClick={() => setShowSubmitModal(true)}
            className="mt-3 w-full py-2.5 px-4 rounded-xl bg-[#008751] hover:bg-[#007043] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Notify Payment</span>
          </button>
        </div>
      </div>

      {/* Payment History & Receipts Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900 font-display">
              Payment Records & Terminal Receipts
            </h3>
            <p className="text-xs text-slate-500">
              History of all bank transfer transactions logged for {student.studentNumber}
            </p>
          </div>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 rounded-xl bg-[#003087] hover:bg-[#002568] text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <CreditCard className="w-4 h-4" />
            <span>Submit Payment Proof</span>
          </button>
        </div>

        {payments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-700 text-base">No Payment History Yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Transfer your school fees to Moniepoint Account <strong className="text-slate-800">9076930244</strong> (Abbas Taofiq Ayomide) and click "Submit Payment Proof" to generate your official receipt.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-black tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Transaction Ref</th>
                  <th className="py-3 px-4">Session / Term</th>
                  <th className="py-3 px-4">Payer</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4 text-right">Amount (₦)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map(pay => (
                  <tr key={pay.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-600 text-xs whitespace-nowrap">
                      {pay.paymentDate}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-xs">
                      {pay.transactionRef}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 text-xs whitespace-nowrap">
                      {pay.session} • {pay.term}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 text-xs">
                      <span className="font-bold text-slate-900 block">{pay.payerName}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{pay.payerPhone}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      <span className="font-bold text-[#003087] block">{pay.bankName}</span>
                      <span className="text-[11px] font-mono text-slate-500">{pay.accountNumber}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900 font-display">
                      ₦{pay.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                          pay.status === 'Verified'
                            ? 'bg-emerald-50 text-[#008751] border border-emerald-200'
                            : pay.status === 'Pending Verification'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {pay.status === 'Verified' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {pay.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setViewReceipt(pay)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#003087] hover:text-white text-slate-700 text-xs font-black transition-all cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>e-Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SUBMIT PAYMENT PROOF MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black text-[#008751] uppercase tracking-widest block">
                  Bursary Notification
                </span>
                <h3 className="text-xl font-black text-slate-900 font-display">
                  Submit Proof of Bank Transfer
                </h3>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Account Quick Reminder Banner */}
            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-100 text-xs space-y-1.5 text-blue-950">
              <div className="flex items-center justify-between">
                <span className="font-black uppercase tracking-wider text-[11px] text-[#003087]">School Bank Account</span>
                <span className="font-bold text-emerald-700 font-mono">09076930244</span>
              </div>
              <p className="font-semibold">
                Bank: <strong className="text-slate-900">{officialAccount.bankName}</strong> | Account No: <strong className="font-mono text-[#003087] font-black">{officialAccount.accountNumber}</strong>
              </p>
              <p className="text-[11px] text-slate-600">
                Account Name: <strong>{officialAccount.accountName}</strong>
              </p>
            </div>

            <form onSubmit={handleSubmitProof} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                    Student ID
                  </label>
                  <input
                    disabled
                    value={student.studentNumber}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                    Class
                  </label>
                  <input
                    disabled
                    value={student.className}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                  Amount Transferred (₦) *
                </label>
                <input
                  required
                  type="number"
                  min="1000"
                  step="500"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="105000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-[#003087]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                    Payer / Parent Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={payerName}
                    onChange={e => setPayerName(e.target.value)}
                    placeholder="e.g. Dr. Michael Adeyemi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#003087]"
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                    Payer Phone Number *
                  </label>
                  <input
                    required
                    type="tel"
                    value={payerPhone}
                    onChange={e => setPayerPhone(e.target.value)}
                    placeholder="09076930244"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-[#003087]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                    Bank Transferred From *
                  </label>
                  <input
                    required
                    type="text"
                    value={sourceBank}
                    onChange={e => setSourceBank(e.target.value)}
                    placeholder="e.g. Moniepoint, OPay, GTBank"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#003087]"
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                    Payment Date *
                  </label>
                  <input
                    required
                    type="date"
                    value={paymentDate}
                    onChange={e => setPaymentDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#003087]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                  Bank Transaction Reference / Session ID *
                </label>
                <input
                  required
                  type="text"
                  value={transactionRef}
                  onChange={e => setTransactionRef(e.target.value)}
                  placeholder="e.g. MP-2025-998812 or Bank Session ID"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-[#003087]"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Found on your bank debit alert or electronic transaction receipt.
                </span>
              </div>

              <div>
                <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                  Optional Remarks / Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Full tuition payment for 1st term"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#003087]"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-black uppercase text-xs tracking-wider shadow-sm transition-all cursor-pointer"
                >
                  Submit for Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFICIAL E-RECEIPT MODAL */}
      {viewReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs font-black text-[#003087] uppercase tracking-wider">
                Official Electronic Payment Receipt
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setViewReceipt(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Receipt Body */}
            <div className="border-2 border-slate-200 rounded-2xl p-6 sm:p-8 bg-slate-50/50 space-y-6 relative overflow-hidden">
              <div className="absolute right-4 top-24 opacity-10 pointer-events-none text-slate-900 text-6xl font-black uppercase rotate-12">
                T'AYO SCHOOL
              </div>

              {/* Header */}
              <div className="text-center border-b border-slate-200 pb-4 space-y-1">
                <h2 className="text-xl font-black text-[#003087] font-display uppercase tracking-tight">
                  T'AYO COMPREHENSIVE SCHOOL
                </h2>
                <p className="text-xs font-bold text-[#008751] uppercase tracking-wider">
                  Primary & Secondary Sections • Ilorin, Kwara State
                </p>
                <p className="text-[11px] text-slate-500">
                  Plot 12, Off Fate/University Road, Tanke GRA, Ilorin | Official Enquiries: 09076930244
                </p>
                <div className="pt-2">
                  <span className="inline-block px-3 py-0.5 rounded-full bg-[#003087] text-white text-[10px] font-black uppercase tracking-widest">
                    Official Bursary E-Receipt
                  </span>
                </div>
              </div>

              {/* Receipt Meta */}
              <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Receipt Number:</span>
                  <strong className="text-slate-800 font-mono">REC-{viewReceipt.id.slice(-6).toUpperCase()}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Payment Date:</span>
                  <strong className="text-slate-800">{viewReceipt.paymentDate}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Student Name:</span>
                  <strong className="text-slate-900">{viewReceipt.studentName}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Student Number:</span>
                  <strong className="text-blue-900 font-mono">{viewReceipt.studentNumber}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Class & Term:</span>
                  <span className="text-slate-700 font-medium">{viewReceipt.className} ({viewReceipt.term})</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Transaction Reference:</span>
                  <span className="font-mono text-slate-800 font-bold">{viewReceipt.transactionRef}</span>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-200 font-semibold text-slate-600">
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                <div className="flex justify-between py-1 text-slate-800">
                  <span>Terminal Tuition & School Fees ({viewReceipt.term} {viewReceipt.session})</span>
                  <span className="font-mono font-bold">₦{viewReceipt.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-t-2 border-slate-300 font-black text-sm text-slate-900">
                  <span>Total Amount Paid</span>
                  <span className="font-mono text-base text-[#008751]">₦{viewReceipt.amount.toLocaleString()}</span>
                </div>
              </div>

              {/* Destination & Status */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Paid To Official School Account:</span>
                  <strong className="text-[#003087]">{viewReceipt.bankName} — {viewReceipt.accountNumber}</strong>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-500">Beneficiary Name:</span>
                  <strong className="text-slate-800">{viewReceipt.accountName}</strong>
                </div>
                <div className="flex justify-between text-[11px] pt-1 border-t border-slate-100">
                  <span className="text-slate-500">Verification Status:</span>
                  <strong className={viewReceipt.status === 'Verified' ? 'text-[#008751]' : 'text-amber-600'}>
                    {viewReceipt.status}
                  </strong>
                </div>
              </div>

              {/* Signature / Stamp */}
              <div className="flex items-center justify-between pt-3 text-[10px] text-slate-400">
                <div>
                  <p className="font-semibold text-slate-600">Bursar / Accounts Officer</p>
                  <p className="italic text-slate-400">Electronically generated & stamped</p>
                </div>
                <div className="text-right">
                  <span className="inline-block border-2 border-emerald-600 text-emerald-700 px-3 py-1 rounded-md uppercase font-black tracking-widest rotate-[-6deg]">
                    ★ T'AYO BURSARY ★
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
