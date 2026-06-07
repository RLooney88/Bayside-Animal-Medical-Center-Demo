import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Cat, ChevronDown, Dog, Menu, Phone, Rabbit, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useSmartSite } from "../context/SmartSiteContext";
import { brand, contact, features, getExternalLinks, links, practice } from "../site/siteConfig";

const BASE_NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/appointment", label: "Request Visit" },
  { to: "/portal/login", label: "Client Portal" },
];

const ANIMAL_ITEMS = [
  { intent: "dogs", href: "/dogs", label: "Dogs", blurb: "Puppies, adults & seniors", Icon: Dog },
  { intent: "cats", href: "/cats", label: "Cats", blurb: "Gentle feline medicine", Icon: Cat },
  { intent: "critters", href: "/critters", label: "Small & Exotic Pets", blurb: "Rabbits, guinea pigs & more", Icon: Rabbit },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [animalsOpen, setAnimalsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { setIntent } = useSmartSite();
  const navigate = useNavigate();
  const overHero = pathname === "/";
  const nav = BASE_NAV.filter((item) => item.to !== "/portal/login" || features.clientPortal !== false);
  const externalLinks = getExternalLinks();
  const appointmentHref = links.appointment || "/appointment";
  const isExternalAppointment = /^https?:\/\//i.test(appointmentHref);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = overHero && !scrolled && !open;

  const pickAnimal = async (item, { closeMobile = false } = {}) => {
    setAnimalsOpen(false);
    if (closeMobile) setOpen(false);
    await setIntent(item.intent, null, { label: `nav_animals_menu:${item.intent}` });
    navigate(item.href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        transparent
          ? "bg-transparent border-b border-transparent"
          : "bg-sand-50/90 backdrop-blur-md border-b border-sand-300/60"
      }`}
      data-testid="site-navbar"
      data-transparent={transparent ? "true" : "false"}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-10 xl:px-12">
        <div className="flex items-center justify-between h-[76px] gap-6">
          <Link to="/" className="flex items-center shrink-0 max-w-[210px] xl:max-w-[245px]" data-testid="nav-logo-link">
            <img
              src={brand.logo}
              alt={brand.logoAlt || practice.name}
              className={`h-11 w-auto max-w-full object-contain rounded-xl transition-all ${transparent ? "bg-white/95 p-1.5 shadow-sm" : ""}`}
            />
          </Link>

          <nav className="hidden lg:flex flex-1 items-center justify-end gap-4 xl:gap-6 min-w-0">
            {nav.slice(0, 1).map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end
                className={({ isActive }) => linkCls(transparent, isActive)}
                data-testid="nav-link-home"
              >
                {n.label}
              </NavLink>
            ))}

            {/* Animals We Serve, dropdown (also a signal surface) */}
            <DropdownMenu open={animalsOpen} onOpenChange={setAnimalsOpen}>
              <DropdownMenuTrigger
                className={`inline-flex items-center gap-1 text-[13px] xl:text-sm font-semibold focus:outline-none whitespace-nowrap transition-colors ${
                  transparent ? "text-sand-50/95 hover:text-clinic-amber" : "text-clinic-ink hover:text-clinic-forest"
                }`}
                data-testid="nav-animals-trigger"
              >
                Animals We Serve
                <ChevronDown className="h-3.5 w-3.5 opacity-75" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={12}
                className="w-72 rounded-2xl border border-sand-300/70 bg-white p-2 shadow-[0_24px_60px_rgba(0,0,0,0.12)]"
                data-testid="nav-animals-menu"
              >
                {ANIMAL_ITEMS.map((item) => (
                  <DropdownMenuItem
                    key={item.intent}
                    onSelect={(e) => {
                      e.preventDefault();
                      pickAnimal(item);
                    }}
                    className="group flex items-center gap-3 rounded-xl px-3 py-3 cursor-pointer focus:bg-clinic-red-soft data-[highlighted]:bg-clinic-red-soft"
                    data-testid={`nav-animals-${item.intent}`}
                  >
                    <span className="h-10 w-10 rounded-xl bg-clinic-sage text-clinic-forest grid place-items-center group-hover:bg-clinic-red group-hover:text-white transition-colors">
                      <item.Icon className="h-5 w-5" strokeWidth={2.2} />
                    </span>
                    <span className="flex-1">
                      <span className="block font-display font-bold text-clinic-navy leading-tight">{item.label}</span>
                      <span className="block text-xs text-clinic-mist">{item.blurb}</span>
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {nav.slice(1).map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) => linkCls(transparent, isActive)}
                data-testid={`nav-link-${n.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {n.label}
              </NavLink>
            ))}
            {externalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={linkCls(transparent, false)}
                data-testid={`nav-external-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0 ml-2 xl:ml-6">
            <a
              href={isExternalAppointment ? appointmentHref : contact.phoneHref}
              target={isExternalAppointment ? "_blank" : undefined}
              rel={isExternalAppointment ? "noreferrer" : undefined}
              className={`hidden md:inline-flex items-center gap-2 rounded-full px-5 xl:px-6 py-3 font-semibold text-sm whitespace-nowrap shadow-lg transition-colors ${
                transparent
                  ? "bg-clinic-red/95 hover:bg-clinic-red-hover text-white shadow-clinic-navy/25"
                  : "bg-clinic-navy hover:bg-clinic-navy-hover text-white shadow-clinic-navy/15"
              }`}
              data-testid="nav-call-btn"
            >
              <Phone className="h-4 w-4" />
              {isExternalAppointment ? "Book Online" : contact.phone}
            </a>
            <button
              onClick={() => setOpen((o) => !o)}
              className={`lg:hidden p-2 rounded-full transition-colors ${
                transparent ? "text-sand-50 hover:bg-white/10" : "hover:bg-sand-200"
              }`}
              aria-label="Toggle menu"
              data-testid="nav-menu-toggle"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden pb-6 flex flex-col gap-2 bg-sand-50 rounded-b-2xl" data-testid="nav-mobile-menu">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-2 px-3 rounded-lg font-semibold text-clinic-ink hover:bg-sand-200"
              >
                {n.label}
              </NavLink>
            ))}
            {externalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 rounded-lg font-semibold text-clinic-ink hover:bg-sand-200"
              >
                {link.label}
              </a>
            ))}
            <div className="px-3 pt-3 pb-1 text-[11px] uppercase tracking-widest font-bold text-clinic-forest">
              Animals We Serve
            </div>
            {ANIMAL_ITEMS.map((a) => (
              <button
                key={a.intent}
                onClick={() => pickAnimal(a, { closeMobile: true })}
                className="mx-3 flex items-center gap-3 py-2 px-3 rounded-lg font-semibold text-clinic-ink hover:bg-sand-200 text-left"
                data-testid={`nav-animals-mobile-${a.intent}`}
              >
                <a.Icon className="h-4 w-4 text-clinic-forest" strokeWidth={2.2} />
                {a.label}
              </button>
            ))}
            <a
              href={isExternalAppointment ? appointmentHref : contact.phoneHref}
              target={isExternalAppointment ? "_blank" : undefined}
              rel={isExternalAppointment ? "noreferrer" : undefined}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-clinic-red px-5 py-3 text-white font-semibold"
            >
              <Phone className="h-4 w-4" /> {isExternalAppointment ? "Book Online" : contact.phone}
            </a>
          </div>
        )}
      </div>
    </header>
  );
}

function linkCls(transparent, isActive) {
  if (transparent) {
    return `text-[13px] xl:text-sm font-semibold whitespace-nowrap transition-colors ${
      isActive ? "text-clinic-amber" : "text-sand-50/95 hover:text-clinic-amber"
    }`;
  }
  return `text-[13px] xl:text-sm font-semibold whitespace-nowrap transition-colors ${
    isActive ? "text-clinic-red" : "text-clinic-ink hover:text-clinic-red"
  }`;
}


