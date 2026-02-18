import { useState } from 'react';
import { X, Calendar, Users, ArrowRight, ShieldCheck, FileText, CheckCircle2, ChevronLeft, Download, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tourName: string;
  pricePerPerson: number;
}

export default function BookingDrawer({ isOpen, onClose, tourName, pricePerPerson }: BookingDrawerProps) {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    travelers: 1,
    fullName: '',
    agreedToTerms: false
  });

  const total = bookingData.travelers * pricePerPerson;
  const bookingRef = "KZ-" + Math.random().toString(36).substring(2, 11).toUpperCase();

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const simulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(4);
    }, 2500);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setBookingData({ date: '', travelers: 1, fullName: '', agreedToTerms: false });
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={handleClose} 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150]" 
          />

          <motion.div
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-[160] overflow-y-auto"
          >
            <div className="p-6 flex flex-col h-full">
              {/* Header */}
              {step < 4 && (
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    {step > 1 && !isProcessing && (
                      <button onClick={handleBack} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                        <ChevronLeft className="w-5 h-5 text-slate-500" />
                      </button>
                    )}
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {step === 1 ? 'Booking Details' : step === 2 ? 'Legal Agreement' : 'Secure Payment'}
                      </h2>
                      <p className="text-sand-600 text-xs font-medium uppercase tracking-wider">{tourName}</p>
                    </div>
                  </div>
                  <button onClick={handleClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                    <X className="w-6 h-6 text-slate-500" />
                  </button>
                </div>
              )}

              {/* Step Progress */}
              <div className="flex gap-2 mb-8">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`h-1 flex-grow rounded-full transition-all duration-500 ${step >= s ? 'bg-sand-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                ))}
              </div>

              {/* Step 1: Logistics */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-sand-500" /> Select Date
                    </label>
                    <input type="date" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl dark:text-white focus:ring-2 focus:ring-sand-500 outline-none" value={bookingData.date} onChange={(e) => setBookingData({...bookingData, date: e.target.value})} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Users className="w-4 h-4 text-sand-500" /> Number of Travelers
                    </label>
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
                      <button onClick={() => setBookingData({...bookingData, travelers: Math.max(1, bookingData.travelers - 1)})} className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center font-bold dark:text-white hover:bg-slate-100 transition-colors">-</button>
                      <span className="text-lg font-bold dark:text-white">{bookingData.travelers}</span>
                      <button onClick={() => setBookingData({...bookingData, travelers: bookingData.travelers + 1})} className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center font-bold dark:text-white hover:bg-slate-100 transition-colors">+</button>
                    </div>
                  </div>

                  {/* Green Escrow Guarantee Badge */}
                  <div className="p-4 bg-green-50 dark:bg-green-500/10 rounded-2xl border border-green-200 dark:border-green-500/20">
                    <div className="flex gap-3">
                      <ShieldCheck className="w-6 h-6 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-green-900 dark:text-green-100">Escrow Guarantee Active</p>
                        <p className="text-xs text-green-700 dark:text-green-400 mt-1">Your funds are held safely and only released to the agent 48h after the tour successfully begins.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Legal & Contract */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  {/* Detailed Terms Section */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <h4 className="flex items-center gap-2 text-sm font-bold mb-3 dark:text-white">
                      <FileText className="w-4 h-4 text-sand-500" /> Contract Terms
                    </h4>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed h-48 overflow-y-auto pr-2 custom-scrollbar">
                      <p className="mb-2"><strong>1. Escrow Protection:</strong> Payment is collected by the platform and held in a secure escrow account. Funds are released to the organizer only after 48 hours of tour commencement.</p>
                      <p className="mb-2"><strong>2. Cancellation Policy:</strong> 100% refund if cancelled at least 72 hours before start. 50% refund within 24-72 hours. No refund for cancellations under 24 hours.</p>
                      <p className="mb-2"><strong>3. Liability Waiver:</strong> You acknowledge that adventure travel involves inherent risks. The organizer is responsible for providing all necessary safety equipment and guidance.</p>
                      <p className="mb-2"><strong>4. No-Show Guarantee:</strong> If the organizer fails to appear, the platform provides a full refund and mediates the dispute.</p>
                      <p><strong>5. Personal Conduct:</strong> Travelers are expected to follow local laws and the guide's safety instructions at all times.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold dark:text-white">Your Full Name (Digital Signature)</label>
                      <input 
                        type="text" 
                        placeholder="Legal name for the contract"
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-sand-500 outline-none dark:text-white"
                        value={bookingData.fullName}
                        onChange={(e) => setBookingData({...bookingData, fullName: e.target.value})}
                      />
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="mt-1 w-5 h-5 rounded border-slate-300 text-sand-500 focus:ring-sand-500"
                        checked={bookingData.agreedToTerms}
                        onChange={(e) => setBookingData({...bookingData, agreedToTerms: e.target.checked})}
                      />
                      <span className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                        I confirm that I have read and agree to the Contract Terms and Liability Waiver for {tourName}.
                      </span>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment UI */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center space-y-6">
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-16 h-16 text-sand-500 animate-spin" />
                      <h3 className="text-xl font-bold dark:text-white">Verifying Escrow...</h3>
                      <p className="text-sm text-slate-500">Securing your spot with the organizer.</p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-sand-100 dark:bg-sand-500/20 rounded-full flex items-center justify-center">
                        <ShieldCheck className="w-8 h-8 text-sand-600" />
                      </div>
                      <h3 className="text-xl font-bold dark:text-white">Ready for Checkout</h3>
                      <p className="text-sm text-slate-500">Your payment is protected by our safety guarantee.</p>
                    </>
                  )}
                </motion.div>
              )}

              {/* Step 4: Success Screen */}
              {step === 4 && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center py-10">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-serif font-bold dark:text-white mb-2">Confirmed!</h2>
                  <p className="text-slate-500 mb-8 text-sm px-4">Your trip to <strong>{tourName}</strong> is secured.</p>
                  
                  <div className="w-full bg-slate-50 dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 mb-8">
                    <div className="flex justify-between mb-4 pb-4 border-b dark:border-slate-700 font-mono text-xs">
                      <span className="text-slate-400">REF:</span>
                      <span className="font-bold dark:text-white">{bookingRef}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Total Paid</span>
                      <span className="font-bold dark:text-white">${total}</span>
                    </div>
                  </div>

                  <div className="space-y-3 w-full">
                    <button className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95">
                      <Download className="w-5 h-5" /> Get E-Ticket
                    </button>
                    <button onClick={handleClose} className="text-slate-500 text-sm font-medium hover:text-slate-700 transition-colors">Close</button>
                  </div>
                </motion.div>
              )}

              {/* Footer */}
              {step < 3 && (
                <div className="mt-auto pt-6 border-t dark:border-slate-800">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <span className="text-xs text-slate-400 block mb-1">Subtotal</span>
                      <span className="text-2xl font-bold dark:text-white">${total}</span>
                    </div>
                    <div className="text-right">
                       <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-md uppercase tracking-tighter">
                        <ShieldCheck className="w-3 h-3" /> Escrow Protected
                      </span>
                    </div>
                  </div>
                  <button 
                    disabled={step === 1 ? !bookingData.date : (!bookingData.agreedToTerms || !bookingData.fullName)}
                    onClick={handleNext}
                    className="w-full py-4 bg-sand-500 hover:bg-sand-600 disabled:bg-slate-300 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                  >
                    {step === 1 ? 'Review Agreement' : 'Go to Payment'} <ArrowRight className="w-5 h-5" />
                  </button>
                  <p className="text-[10px] text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
                    <Info className="w-3 h-3" /> All transactions are encrypted.
                  </p>
                </div>
              )}

              {step === 3 && !isProcessing && (
                <div className="mt-auto pt-6 border-t dark:border-slate-800 text-center">
                  <button onClick={simulatePayment} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95">
                    Confirm Payment - ${total}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
