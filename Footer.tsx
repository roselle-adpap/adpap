import { Link } from "react-router-dom";
import Logo from "./Logo";
import { ORG } from "@/data/siteConfig";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white/70">
      <div className="section grid gap-10 py-14 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
            {ORG.brandName} — a professional membership community operated by{" "}
            <span className="text-white/75">{ORG.operator}</span>
          </p>
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-3">
            <img
              src="/assets/globalknowledge-logo.png"
              alt={ORG.operator}
              className="h-10 w-10 shrink-0 object-contain"
            />
            <div className="leading-tight">
              <p className="text-[10px] uppercase tracking-[0.14em] text-white/40">Operated by</p>
              <p className="text-sm font-medium text-white/80">{ORG.operator}</p>
            </div>
          </div>
          <p className="mt-4 text-sm">
            <a href={`mailto:${ORG.secretariatEmail}`} className="text-gold-400 hover:underline">
              {ORG.secretariatEmail}
            </a>
          </p>
        </div>

        <div>
          <div className="eyebrow !text-gold-400/80 mb-3">Navigate</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/membership" className="hover:text-white">Membership</Link></li>
            <li><Link to="/apply" className="hover:text-white">Apply</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow !text-gold-400/80 mb-3">Members</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/member-login" className="hover:text-white">Member Login</Link></li>
            <li><Link to="/verify" className="hover:text-white">Verify Membership</Link></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow !text-gold-400/80 mb-3">Legal</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy-notice" className="hover:text-white">Privacy Notice</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms &amp; Conditions</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="section flex flex-col gap-2 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {ORG.brandName}. All Rights Reserved.</p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>{ORG.regulatorDisclaimer}</span>
            <Link to="/admin-login" className="text-white/40 underline decoration-white/20 underline-offset-2 hover:text-white/70">
              Secretariat access
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
