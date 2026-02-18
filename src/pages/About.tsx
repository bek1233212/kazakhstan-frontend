import { useState } from 'react';
import { MapPin, Mail, Phone, Send, CheckCircle, Users, Globe, Award, Heart } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Authentic Experiences',
    description: 'We believe in genuine cultural immersion and meaningful connections with local communities.',
  },
  {
    icon: Users,
    title: 'Local Partnerships',
    description: 'We work exclusively with verified local operators who know Kazakhstan inside and out.',
  },
  {
    icon: Globe,
    title: 'Sustainable Travel',
    description: 'We promote responsible tourism that preserves nature and supports local economies.',
  },
  {
    icon: Award,
    title: 'Quality Assurance',
    description: 'Every tour operator on our platform meets our rigorous standards for safety and service.',
  },
];

const team = [
  {
    name: 'Tashkul Bek',
    role: 'Founder',
    bio: 'Happy to assist your travels!',
  },
  {
    name: 'Tashkul Bek',
    role: 'Founder',
    bio: 'Happy to assist your travels!',
  },
  {
    name: 'Tashkul Bek',
    role: 'Founder',
    bio: 'Happy to assist your travels!',
  },
];

export default function About() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-slate-850 pt-20">
      {/* Hero */}
      <section className="relative py-24 lg:py-32 bg-slate-850 overflow-hidden">
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
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-sand-500/20 text-sand-300 text-sm font-medium rounded-full mb-6">
              About Us
            </span>
            <h1 className="heading-xl text-white mb-6">
              Connecting Travelers with Kazakhstan's Best
            </h1>
            <p className="text-xl text-white/60 leading-relaxed max-w-3xl mx-auto">
              We're a team of passionate locals dedicated to showcasing the beauty, culture, and adventure that Kazakhstan has to offer.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 lg:py-32">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-sand-100 dark:bg-sand-500/20 text-sand-700 dark:text-sand-300 text-sm font-medium rounded-full mb-6">
                Our Story
              </span>
              <h2 className="heading-lg text-slate-750 dark:text-white mb-6">
                Born from a Love of Adventure
              </h2>
              <div className="space-y-4 text-slate-500 dark:text-slate-400 leading-relaxed">
                <p>
                  Kazakhstan Tours was founded in 2018 with a simple mission: to help travelers discover the incredible beauty and rich cultural heritage of Kazakhstan through authentic, locally-led experiences.
                </p>
                <p>
                  What started as a small team of passionate guides has grown into a trusted marketplace connecting thousands of travelers with verified local tour operators across the country.
                </p>
                <p>
                  From the snow-capped peaks of the Tien Shan to the ancient cities of the Silk Road, we believe every corner of Kazakhstan has a story to tell. Our job is to help you hear those stories.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-48 bg-gradient-to-br from-sand-200 to-sand-300 dark:from-sand-500/30 dark:to-sand-600/30 rounded-2xl" />
                <div className="h-64 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl" />
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-64 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl" />
                <div className="h-48 bg-gradient-to-br from-sand-300 to-sand-400 dark:from-sand-600/30 dark:to-sand-700/30 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 lg:py-32 bg-sand-100 dark:bg-slate-800/50">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-sand-200 dark:bg-sand-500/20 text-sand-700 dark:text-sand-300 text-sm font-medium rounded-full mb-4">
              Our Values
            </span>
            <h2 className="heading-lg text-slate-750 dark:text-white mb-6">
              What We Stand For
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 text-center"
                >
                  <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-sand-100 dark:bg-sand-500/20 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-sand-600 dark:text-sand-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-750 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 lg:py-32">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 bg-sand-100 dark:bg-sand-500/20 text-sand-700 dark:text-sand-300 text-sm font-medium rounded-full mb-4">
              Our Team
            </span>
            <h2 className="heading-lg text-slate-750 dark:text-white mb-6">
              Meet the People Behind the Adventure
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-slate-600 to-slate-800" />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-750 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sand-600 dark:text-sand-400 text-sm font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 lg:py-32 bg-slate-850">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16">
          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div>
              <span className="inline-block px-4 py-1.5 bg-sand-500/20 text-sand-300 text-sm font-medium rounded-full mb-6">
                Get in Touch
              </span>
              <h2 className="heading-lg text-white mb-6">
                Contact Us
              </h2>
              <p className="text-white/60 leading-relaxed mb-8">
                Have questions about a tour? Want to partner with us? We'd love to hear from you. Reach out and we'll get back to you as soon as possible.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-sand-500/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-sand-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Address</h4>
                    <p className="text-white/60 text-sm">
                      Kabanbay Batyr Ave 62<br />
                      Almaty 050000, Kazakhstan
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-sand-500/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-sand-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Email</h4>
                    <p className="text-white/60 text-sm">info@kazakhstantours.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-sand-500/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-sand-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Phone</h4>
                    <p className="text-white/60 text-sm">+7 727 312 3456</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700">
              {isSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-750 dark:text-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-750 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sand-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-750 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sand-500"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-750 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sand-500"
                      placeholder="Tour Inquiry"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-750 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sand-500 resize-none"
                      placeholder="Tell us about your travel plans..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-4 bg-sand-500 hover:bg-sand-600 text-white font-medium rounded-lg transition-all hover:shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
