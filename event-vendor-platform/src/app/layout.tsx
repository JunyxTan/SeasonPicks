import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "CelebrateHub — Event Vendors & Celebration Packages",
  description: "Find trusted vendors for weddings, birthdays, corporate events and festive celebrations. Request quotes instantly."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="nav">
            <Link className="brand" href="/">
              <span style={{width:28,height:28,borderRadius:10,background:"#fff",display:"inline-block"}} />
              <span>CelebrateHub</span>
              <span className="badge">MVP</span>
            </Link>
            <nav style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"flex-end"}}>
              <Link className="btn" href="/browse">Browse</Link>
              <Link className="btn" href="/vendors/onboard">Vendors</Link>
              <Link className="btn" href="/admin">Admin</Link>
            </nav>
          </header>
        </div>
        {children}
        <div className="container">
          <footer className="footer">
            © {new Date().getFullYear()} CelebrateHub — A multi-vendor event marketplace MVP.
          </footer>
        </div>
      </body>
    </html>
  );
}
