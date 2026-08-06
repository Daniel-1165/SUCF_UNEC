import Link from "next/link";
import { FiInstagram, FiFacebook, FiYoutube, FiPhone, FiMail } from "react-icons/fi";

const socials = [
  { icon: <FiInstagram />, link: "https://www.instagram.com/sucf.unec/" },
  { icon: <FiFacebook />, link: "https://www.facebook.com/sucfunec" },
  { icon: <FiYoutube />, link: "https://www.youtube.com/@sucfunec" },
];

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-white pt-10 pb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-900/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

      <div className="page-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-4 space-y-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight mb-1">SUCF UNEC</h2>
              <p className="text-emerald-500/80 text-[10px] uppercase font-bold tracking-[0.3em]">
                The Unique Fellowship
              </p>
            </div>
            <p className="text-emerald-100/60 text-xs leading-relaxed max-w-xs">
              Committed to reaching children, young people, and families, nurturing them
              through Bible engagement to become committed Christians of influence.
            </p>
            <div className="flex gap-2 pt-1">
              {socials.map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm hover:bg-emerald-600 hover:border-emerald-500 hover:scale-110 transition-all duration-500"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500 mb-3">
                Navigation
              </h3>
              <ul className="space-y-2 text-xs font-medium text-emerald-100/70">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/activities" className="hover:text-white transition-colors">
                    Gatherings
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="hover:text-white transition-colors">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link href="/library" className="hover:text-white transition-colors">
                    Library
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500 mb-3">
                Meetings
              </h3>
              <ul className="space-y-2 text-xs text-emerald-100/70">
                <li>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-emerald-500/70">
                    Sunday
                  </p>
                  <p className="font-bold text-white text-xs">3:00 PM</p>
                </li>
                <li>
                  <p className="text-[10px] font-medium uppercase tracking-widest text-emerald-500/70">
                    Thursday
                  </p>
                  <p className="font-bold text-white text-xs">5:00 PM</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-5">
            <div className="space-y-4 px-2">
              <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-500/70">
                Support Ministry
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-emerald-100/30 uppercase tracking-tighter">Bank</span>
                  <span className="font-bold text-emerald-100">Access Bank</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-emerald-100/30 uppercase tracking-tighter">Number</span>
                  <span className="tabular-nums font-bold text-emerald-100 tracking-[0.2em]">
                    0011790503
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-emerald-100/30 uppercase tracking-tighter">Name</span>
                  <span className="font-bold text-white uppercase text-[10px]">SUCF UNEC</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <a href="tel:07069753310" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <FiPhone size={14} />
                </div>
                <span className="text-xs font-bold">Call</span>
              </a>
              <a href="mailto:sucfunec01@gmail.com" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <FiMail size={14} />
                </div>
                <span className="text-xs font-bold">Email</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-5 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-emerald-100/20 uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} SUCF UNEC • The Unique Fellowship
          </p>
        </div>
      </div>
    </footer>
  );
}
