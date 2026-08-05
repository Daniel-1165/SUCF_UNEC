import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Deliberately does NOT read the Auth0 session here. Touching session cookies
// in this layout opts every public page out of static generation, turning the
// whole site dynamic just to decide whether to render one Admin link. The
// Navbar resolves that client-side from /api/auth-state instead, so these
// pages stay statically rendered with ISR.
export default function SiteLayout({ children }) {
  return (
    <div className="min-h-full flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
