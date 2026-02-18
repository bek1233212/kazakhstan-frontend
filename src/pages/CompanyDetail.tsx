import { useState } from 'react';
import { useRouter } from '../hooks/useRouter';
import { getCompanyById } from '../data/companies';
import { useCurrency } from '../hooks/useCurrency';
import {
  Star,
  MapPin,
  Clock,
  TrendingUp,
  CheckCircle,
  Mail,
  Phone,
  Globe,
  Send,
  ArrowLeft,
  Users,
  Calendar,
  Languages,
  Check,
} from 'lucide-react';

export default function CompanyDetail() {
  const { navigate, matchRoute } = useRouter();
  const { formatPrice } = useCurrency();
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    travelDate: '',
    groupSize: '',
    message: '',
  });

  const match = matchRoute('/company/:id');
  const companyId = match.params?.id || '';
  const company = getCompanyById(companyId);

  if (!company) {
    return (
      <div className="min-h-screen bg-cream dark:bg-slate-850 pt-32 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-slate-750 dark:text-white mb-4">
            Company Not Found
          </h1>
          <button
            onClick={() => navigate('/tours')}
            className="px-6 py-3 bg-sand-500 hover:bg-sand-600 text-white rounded-lg transition-colors"
          >
            Back to Tours
          </button>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400';
      case 'Moderate':
        return 'bg-amber-500/20 text-amber-600 dark:text-amber-400';
      case 'Hard':
        return 'bg-rose-500/20 text-rose-600 dark:text-rose-400';
      default:
        return 'bg-slate-500/20 text-slate-600 dark:text-slate-400';
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsInquiryOpen(false);
      setInquiryData({
        name: '',
        email: '',
        phone: '',
        travelDate: '',
        groupSize: '',
        message: '',
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-slate-850 pt-20">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 bg-slate-850">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-16">
          <button
            onClick={() => navigate('/tours')}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tours
          </button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 bg-sand-500/20 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-sand-400 fill-sand-400" />
                  <span className="text-sm font-semibold text-sand-300">
                    {company.rating}
                  </span>
                </div>
                {company.verified && (
                  <div className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Verified Partner</span>
                  </div>
                )}
              </div>

              <h1 className="heading-lg text-white mb-4">{company.name}</h1>
              <div className="flex items-center gap-2 text-white/60 mb-6">
                <MapPin className="w-5 h-5" />
                <span>{company.location}</span>
              </div>

              <p className="text-lg text-white/70 leading-relaxed max-w-2xl">
                {company.longDescription}
              </p>
            </div>

            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="text-center mb-6">
                  <span className="text-white/60 text-sm">Starting from</span>
                  <p className="text-3xl font-serif font-medium text-sand-400">
                    {formatPrice(company.priceFrom)}
                  </p>
                  <span className="text-white/40 text-sm">per person</span>
                </div>

                <button
                  onClick={() => setIsInquiryOpen(true)}
                  className="w-full py-4 bg-sand-500 hover:bg-sand-600 text-white font-medium rounded-lg transition-all hover:shadow-lg mb-4"
                >
                  Send Inquiry
                </button>

                <div className="flex items-center justify-center gap-4 text-white/60 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {company.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {company.difficulty}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="py-16 lg:py-24">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-12">
              {/* Specialties */}
              <div>
                <h2 className="text-2xl font-serif font-medium text-slate-750 dark:text-white mb-6">
                  Specialties
                </h2>
                <div className="flex flex-wrap gap-3">
                  {company.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="flex items-center gap-2 px-4 py-2 bg-sand-100 dark:bg-sand-500/20 text-sand-700 dark:text-sand-300 rounded-full"
                    >
                      <Check className="w-4 h-4" />
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h2 className="text-2xl font-serif font-medium text-slate-750 dark:text-white mb-6">
                  Activities & Features
                </h2>
                <div className="flex flex-wrap gap-2">
                  {company.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* About */}
              <div>
                <h2 className="text-2xl font-serif font-medium text-slate-750 dark:text-white mb-6">
                  About {company.name}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  {company.longDescription}
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-750 dark:text-white mb-6">
                  Quick Info
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-sand-500 mt-0.5" />
                    <div>
                      <span className="text-sm text-slate-400 block">Established</span>
                      <span className="text-slate-750 dark:text-white">{company.yearEstablished}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-sand-500 mt-0.5" />
                    <div>
                      <span className="text-sm text-slate-400 block">Group Size</span>
                      <span className="text-slate-750 dark:text-white">{company.groupSize}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Languages className="w-5 h-5 text-sand-500 mt-0.5" />
                    <div>
                      <span className="text-sm text-slate-400 block">Languages</span>
                      <span className="text-slate-750 dark:text-white">{company.languages.join(', ')}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-sand-500 mt-0.5" />
                    <div>
                      <span className="text-sm text-slate-400 block">Difficulty</span>
                      <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${getDifficultyColor(company.difficulty)}`}>
                        {company.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-750 dark:text-white mb-6">
                  Contact
                </h3>

                <div className="space-y-4">
                  <a
                    href={`mailto:${company.email}`}
                    className="flex items-center gap-3 text-slate-500 dark:text-slate-400 hover:text-sand-500 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="text-sm">{company.email}</span>
                  </a>

                  <a
                    href={`tel:${company.phone}`}
                    className="flex items-center gap-3 text-slate-500 dark:text-slate-400 hover:text-sand-500 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span className="text-sm">{company.phone}</span>
                  </a>

                  {company.website && (
                    <a
                      href={`https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-slate-500 dark:text-slate-400 hover:text-sand-500 transition-colors"
                    >
                      <Globe className="w-5 h-5" />
                      <span className="text-sm">{company.website}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      {isInquiryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsInquiryOpen(false)}
          />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 lg:p-8">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                    <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-750 dark:text-white mb-2">
                    Inquiry Sent!
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    {company.name} will contact you soon.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-750 dark:text-white">
                        Send Inquiry
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        To {company.name}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsInquiryOpen(false)}
                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      ×
                    </button>
                  </div>

                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={inquiryData.name}
                          onChange={(e) => setInquiryData({ ...inquiryData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-750 dark:text-white focus:outline-none focus:border-sand-500"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={inquiryData.email}
                          onChange={(e) => setInquiryData({ ...inquiryData, email: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-750 dark:text-white focus:outline-none focus:border-sand-500"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={inquiryData.phone}
                          onChange={(e) => setInquiryData({ ...inquiryData, phone: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-750 dark:text-white focus:outline-none focus:border-sand-500"
                          placeholder="+1 234 567 890"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Travel Date
                        </label>
                        <input
                          type="date"
                          value={inquiryData.travelDate}
                          onChange={(e) => setInquiryData({ ...inquiryData, travelDate: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-750 dark:text-white focus:outline-none focus:border-sand-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Group Size
                      </label>
                      <select
                        value={inquiryData.groupSize}
                        onChange={(e) => setInquiryData({ ...inquiryData, groupSize: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-750 dark:text-white focus:outline-none focus:border-sand-500"
                      >
                        <option value="">Select group size</option>
                        <option value="1">Solo traveler</option>
                        <option value="2">2 people</option>
                        <option value="3-5">3-5 people</option>
                        <option value="6-10">6-10 people</option>
                        <option value="10+">10+ people</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Message *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={inquiryData.message}
                        onChange={(e) => setInquiryData({ ...inquiryData, message: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-750 dark:text-white focus:outline-none focus:border-sand-500 resize-none"
                        placeholder="Tell us about your travel plans, preferences, and any questions you have..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-4 bg-sand-500 hover:bg-sand-600 text-white font-medium rounded-lg transition-all hover:shadow-lg"
                    >
                      <Send className="w-4 h-4" />
                      Send Inquiry
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
