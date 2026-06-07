import React from "react";
import { useNavigate } from "react-router-dom";
import { Cat, Dog, PawPrint, Rabbit } from "lucide-react";
import { useSmartSite } from "../context/SmartSiteContext";

const BUTTONS = [
  { intent: "dogs", label: "Dogs", href: "/dogs", Icon: Dog },
  { intent: "cats", label: "Cats", href: "/cats", Icon: Cat },
  { intent: "critters", label: "Small & Exotic Pets", href: "/critters", Icon: Rabbit },
];

/**
 * Hero call-to-action for the default (unknown-intent) state.
 * Each button is ALSO a smart-site signal: clicking it writes an
 * intent_select event for the visitor, then navigates to the
 * corresponding animal page.
 */
export default function AnimalButtons({ variant = "hero" }) {
  const { setIntent } = useSmartSite();
  const navigate = useNavigate();

  const onPick = async (b) => {
    // Signal first, then navigate. setIntent awaits the POST so by the time
    // the next page mounts, the session already has the right parent_intent.
    await setIntent(b.intent, null, { label: `hero_animal_button:${b.intent}` });
    navigate(b.href);
  };

  const baseBtn =
    variant === "hero"
      ? "group inline-flex min-w-[132px] items-center justify-between gap-4 rounded-full pr-2.5 pl-5 py-2.5 font-semibold transition-all shadow-lg backdrop-blur-md"
      : "group inline-flex min-w-[132px] items-center justify-between gap-4 rounded-full pr-2.5 pl-5 py-2.5 font-semibold transition-all";

  return (
    <div
      className="flex flex-wrap items-center gap-4 sm:gap-5"
      data-testid="animal-buttons"
    >
      {BUTTONS.map((b) => (
        <button
          key={b.intent}
          type="button"
          onClick={() => onPick(b)}
          className={`${baseBtn} ${
            variant === "hero"
              ? "bg-white/96 hover:bg-white text-clinic-navy shadow-black/10 ring-1 ring-clinic-sage-deep/30"
              : "bg-clinic-navy hover:bg-clinic-navy-hover text-white"
          }`}
          data-testid={`hero-animal-${b.intent}`}
        >
          <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm">
            <b.Icon className="h-4 w-4 text-clinic-forest" strokeWidth={2.2} />
            {b.label}
          </span>
          <span
            className={`h-9 w-9 rounded-full grid place-items-center transition-transform group-hover:scale-110 ${
              variant === "hero"
                ? "bg-clinic-red text-white shadow-inner"
                : "bg-white/15 text-white"
            }`}
          >
            <PawPrint className="h-4 w-4" />
          </span>
        </button>
      ))}
    </div>
  );
}
