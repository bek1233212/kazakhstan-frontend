import { Mountain, Mail, Phone, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';
import { useRouter } from '../hooks/useRouter';

export default function Footer() {
  const { navigate } = useRouter();

  const quickLinks = [
    { path: '/', label: 'Home' },
    { path: '/tours', label: 'Tours' },
    { path: '/destinations', label: 'Destinations' },
    { path: '/about', label: 'About Us' },
  ];

  const legalLinks = ['Privacy Policy', 'Terms of Service', 'Imprint'];

  return (
    <footer className="bg-slate-850 border-t border-slate-800">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="space-y-6">
            <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
              <Mountain
                className="w-8 h-8 text-sand-500 group-hover:text-sand-400 transition-colors"
                strokeWidth={1.5}
              />
              <span className="font-serif text-xl tracking-wider text-white">
                KAZAKHSTAN
              </span>
            </button>
            <p className="text-slate-400 text-sm leading-relaxed">
              Discover the heart of Central Asia. Connect with verified local tour operators for authentic Kazakh experiences.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-sand-500 hover:text-white transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-sand-500 hover:text-white transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-sand-500 hover:text-white transition-all"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-medium mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path as any)}
                    className="text-slate-400 hover:text-sand-400 transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-medium mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-sand-500 mt-1" />
                <span className="text-slate-400 text-sm">info@kazakhstantours.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-sand-500 mt-1" />
                <span className="text-slate-400 text-sm">+7 727 312 3456</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-sand-500 mt-1" />
                <span className="text-slate-400 text-sm">
                  Kabanbay Batyr Ave 62<br />
                  Almaty 050000, Kazakhstan
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-medium mb-6">Newsletter</h3>
            <p className="text-slate-400 text-sm mb-4">
              Subscribe for travel inspiration and exclusive offers.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sand-500"
              />
              <button
                type="submit"
                className="w-full px-4 py-3 bg-sand-500 hover:bg-sand-600 text-white font-medium rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2026 Kazakhstan Tours. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <button
                key={link}
                onClick={() => {}}
                className="text-slate-500 hover:text-sand-400 transition-colors text-sm"
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
