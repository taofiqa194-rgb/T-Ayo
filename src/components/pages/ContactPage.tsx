import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Building,
  Navigation
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 text-white py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
            Visit & Connect
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight">
            Contact T'AYO School
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            We are always delighted to welcome prospective parents, partners, and visitors to our serene campus in Ilorin, Kwara State.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
              <h2 className="text-xl font-bold text-slate-900 font-display">Campus Location & Inquiries</h2>

              <div className="space-y-5 text-xs sm:text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold">Physical Campus Address</strong>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">
                      Plot 12/14 University Road, Opposite Tanke Junction, Near University of Ilorin Corridor, Ilorin, Kwara State, Nigeria.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold">Admissions & Front Desk</strong>
                    <p className="text-slate-600 mt-0.5 font-mono">09076930244</p>
                    <p className="text-slate-600 font-mono">09076930244 (Call & WhatsApp)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold">Official Email Addresses</strong>
                    <p className="text-slate-600 mt-0.5">General: info@tayoschool.edu.ng</p>
                    <p className="text-slate-600">Admissions: admissions@tayoschool.edu.ng</p>
                    <p className="text-slate-600">Principal: principal@tayoschool.edu.ng</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-bold">Visiting & Office Hours</strong>
                    <p className="text-slate-600 mt-0.5">Monday – Friday: 7:30 AM – 4:30 PM</p>
                    <p className="text-slate-600">Saturday (Admissions Screening): 9:00 AM – 1:00 PM</p>
                    <p className="text-slate-400">Sundays & Public Holidays: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Landmarks / Directions Card */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-3">
              <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                Easy Directions to Campus
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                From Post Office or Fate Road, take the Tanke / Unilorin route. Alight at the University Road Junction. T'AYO School's prominent blue, green, and white gates are visible 200 metres on the right.
              </p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                Send an Inquiry or Book a Campus Tour
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Our admissions officers will respond within 24 hours.
              </p>
            </div>

            {sent && (
              <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Thank you! Your message has been sent to the T'AYO School front desk.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase text-xs mb-1">Your Full Name *</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Alh. Ibrahim Babatunde"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase text-xs mb-1">Your Phone Number *</label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+234 ..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase text-xs mb-1">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase text-xs mb-1">Inquiry Subject *</label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Admission Inquiry">Primary / Secondary Admission Inquiry</option>
                    <option value="Campus Tour Booking">Book Campus Visit / Facility Tour</option>
                    <option value="Transfer Student">Transfer Student from another State</option>
                    <option value="General Question">General Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase text-xs mb-1">Message Content *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us your questions, the class you are considering for your child, or preferred tour dates..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Message to School Registry</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
