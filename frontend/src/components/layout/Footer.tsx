import { Link } from "react-router-dom";
import { Heart, Globe, Camera, AtSign, ShieldCheck, Lock } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center size-8 rounded-lg bg-white text-primary">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                SatuTangan
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Platform donasi dan penggalangan dana online terpercaya untuk
              membantu sesama mewujudkan harapan dan cita-cita.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                className="text-white/70 hover:text-white transition-colors"
                href="#"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                className="text-white/70 hover:text-white transition-colors"
                href="#"
              >
                <Camera className="w-5 h-5" />
              </a>
              <a
                className="text-white/70 hover:text-white transition-colors"
                href="#"
              >
                <AtSign className="w-5 h-5" />
              </a>
            </div>
          </div>
          {/* Links 1 */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-300">
              Tentang Kami
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <Link
                  className="hover:text-white transition-colors"
                  to="/about"
                >
                  Profil SatuTangan
                </Link>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Karir
                </a>
              </li>
              <li>
                <Link
                  className="hover:text-white transition-colors"
                  to="/contact"
                >
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Media Partner
                </a>
              </li>
            </ul>
          </div>
          {/* Links 2 */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-300">Bantuan</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Cara Donasi
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="#">
                  Cara Galang Dana
                </a>
              </li>
              <li>
                <Link
                  className="hover:text-white transition-colors"
                  to="/terms"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-white transition-colors"
                  to="/privacy"
                >
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>
          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-300">
              Berlangganan
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              Dapatkan update terbaru tentang campaign pilihan setiap minggunya.
            </p>
            <form
              className="flex flex-col gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-secondary text-sm"
                placeholder="Alamat Email"
                type="email"
              />
              <button className="px-4 py-2 rounded-lg bg-secondary text-white font-bold text-sm hover:bg-secondary/90 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© {currentYear} SatuTangan Foundation. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-[18px] h-[18px]" />
              Terverifikasi ISO 27001
            </span>
            <span className="flex items-center gap-2">
              <Lock className="w-[18px] h-[18px]" />
              SSL Secured
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
