import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { auth0, auth0Configured } from "@/lib/auth0";

export default async function SiteLayout({ children }) {
  // Resolve the session server-side and pass a plain boolean down, so the
  // client Navbar can show the Admin link without needing an auth provider.
  const session = auth0Configured ? await auth0.getSession() : null;

  return (
    <div className="min-h-full flex flex-col">
      <Navbar isSignedIn={Boolean(session)} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
