import { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/membership", label: "Membership" },
  { to: "/verify", label: "Verify Membership" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-navy-950/95 backdrop-blur supports-[backdrop-filter]:bg-navy-950/90">
      <div className="section flex h-16 items-center justify-between">
        <NavLink to="/" className="shrink-0" onClick={() => setOpen(false)}>
          <Logo />
        </NavLink>

        <nav className="hidden items-center gap-2 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `relative rounded-md px-4 py-2.5 text-sm transition-all duration-200 after:absolute after:bottom-1 after:left-4 after:right-4 after:h-[2.5px] after:rounded-full after:bg-gold-400 after:transition-transform after:duration-200 ${
                  isActive
                    ? "bg-gold-400/10 font-semibold text-gold-400 after:scale-x-100"
                    : "font-medium text-white/70 after:scale-x-0 hover:bg-white/5 hover:text-white hover:after:scale-x-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <NavLink to="/member-login" className="btn-ghost-light !py-2 !px-4 text-sm">
            Member Login
          </NavLink>
          <NavLink to="/apply" className="btn-gold !py-2 !px-4 text-sm">
            Join ADPAP
          </NavLink>
        </div>

        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle navigation menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-navy-950 px-6 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2.5 text-sm font-medium ${
                    isActive ? "bg-white/5 text-gold-400" : "text-white/85"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink to="/member-login" onClick={() => setOpen(false)} className="btn-ghost-light mt-2 w-full">
              Member Login
            </NavLink>
            <NavLink to="/apply" onClick={() => setOpen(false)} className="btn-gold mt-2 w-full">
              Join ADPAP
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}
