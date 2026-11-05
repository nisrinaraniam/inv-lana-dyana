import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Heart,
  MapPin,
  Calendar,
  Clock,
  Gift,
  Copy,
  Check,
  Send,
  Music2,
  Music,
  Sparkles,
  Mail,
  Cake,
  ChevronDown,
  Loader2,
} from "lucide-react";

import heroCouple from "@/assets/hero-couple.png";
import cartoonBride from "@/assets/cartoon-bride.png";
import cartoonGroom from "@/assets/cartoon-groom.png";
import story1 from "@/assets/story-1.png";
import story2 from "@/assets/story-2.png";
import story3 from "@/assets/story-3.png";
import story4 from "@/assets/story-4.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lana & Dyana — Our Wedding Invitation" },
      {
        name: "description",
        content:
          "Save the date and celebrate with Lana & Dyana — a little illustrated wedding invitation from us to you.",
      },
    ],
  }),
  component: Invitation,
});

const WEDDING_DATE = new Date("2027-01-15T09:00:00+07:00");
const COUPLE = { groom: "Lana", bride: "Dyana" };

// ---------- Small building blocks ----------

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, shown };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.9s ease-out ${delay}ms, transform 0.9s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3 text-cherry">
      <span className="h-px w-10 bg-cherry/40" />
      <span className="hand text-2xl">{children}</span>
      <span className="h-px w-10 bg-cherry/40" />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="serif mt-3 text-center text-4xl leading-tight text-ink sm:text-5xl">
      {children}
    </h2>
  );
}

// A tiny hand-drawn divider
function Divider() {
  return (
    <div className="my-8 flex items-center justify-center gap-3 text-cherry/60">
      <svg width="80" height="12" viewBox="0 0 80 12" fill="none">
        <path
          d="M2 6 Q 20 -2, 40 6 T 78 6"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <Heart className="h-3.5 w-3.5 fill-cherry text-cherry" />
      <svg width="80" height="12" viewBox="0 0 80 12" fill="none">
        <path
          d="M2 6 Q 20 14, 40 6 T 78 6"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

// ---------- Floating decor ----------

function FloatingHearts({ count = 6 }: { count?: number }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: 6 + ((i * 17) % 88),
        delay: (i * 0.9) % 5,
        size: 12 + ((i * 7) % 10),
        opacity: 0.5 + ((i * 13) % 40) / 100,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((h, i) => (
        <Heart
          key={i}
          className="animate-heart absolute bottom-0 fill-cherry/70 text-cherry/70"
          style={{
            left: `${h.left}%`,
            width: h.size,
            height: h.size,
            animationDelay: `${h.delay}s`,
            opacity: h.opacity,
          }}
        />
      ))}
    </div>
  );
}

function Clouds() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[0, 1, 2].map((i) => (
        <svg
          key={i}
          className="animate-drift absolute text-white/80"
          style={{
            top: `${8 + i * 14}%`,
            animationDuration: `${50 + i * 20}s`,
            animationDelay: `${-i * 12}s`,
            width: 120 + i * 40,
            filter: "drop-shadow(0 6px 10px rgba(180,80,80,0.08))",
          }}
          viewBox="0 0 120 40"
          fill="currentColor"
        >
          <path d="M20 30 Q 10 30 10 22 Q 10 14 20 14 Q 22 6 32 8 Q 40 2 50 10 Q 62 6 66 16 Q 78 16 78 24 Q 78 32 66 30 Z" />
        </svg>
      ))}
    </div>
  );
}

// ---------- Countdown ----------

function useCountdown(target: Date) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (now === null) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const minutes = Math.floor((diff / 60000) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown(WEDDING_DATE);
  const items = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];
  return (
    <div className="mx-auto grid max-w-md grid-cols-4 gap-2 sm:gap-3">
      {items.map((it) => (
        <div
          key={it.label}
          className="paper flex flex-col items-center rounded-2xl px-2 py-3 sm:py-4"
        >
          <div className="serif text-2xl text-cherry sm:text-3xl">
            {String(it.value).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-ink-soft sm:text-xs">
            {it.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- Main page ----------

function Invitation() {
  const [opened, setOpened] = useState(false);
  const [music, setMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const guest = useGuestName();

  // Lock scroll before opening
  useEffect(() => {
    if (!opened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  const handleOpen = () => {
    setOpened(true);
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setMusic(true);
        })
        .catch((err) => {
          console.warn("Autoplay was prevented:", err);
        });
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (music) {
      audioRef.current.pause();
      setMusic(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setMusic(true);
        })
        .catch((err) => {
          console.warn("Play failed:", err);
        });
    }
  };

  return (
    <div className="relative min-h-screen bg-ivory text-ink">
      <audio ref={audioRef} src="/audio.mp3" loop preload="auto" />

      {!opened && <CoverGate guest={guest} onOpen={handleOpen} />}

      {opened && <MusicToggle on={music} onToggle={toggleMusic} />}

      <Hero guest={guest} />
      <Couple />
      <LoveStory />
      <Events />
      <Venue />
      {/* <RSVP /> */}
      <GiftSection />
      <Wishes />
      <Closing />
    </div>
  );
}

// ---------- Cover gate ----------

function useGuestName() {
  const [name, setName] = useState("Bapak/Ibu Saudara/i di Tempat");
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const to = p.get("to") || p.get("guest");
      if (to) setName(decodeURIComponent(to));
    } catch {
      // ignore
    }
  }, []);
  return name;
}

function CoverGate({ guest, onOpen }: { guest: string; onOpen: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-ivory via-blush-soft to-cream px-6">
      <Clouds />
      <div className="animate-fade-up relative z-10 flex max-w-md flex-col items-center text-center">
        <span className="hand text-2xl text-cherry">The Wedding of</span>
        <h1 className="serif mt-2 text-5xl leading-tight text-ink sm:text-6xl">
          {COUPLE.groom}
          <span className="mx-3 inline-block align-middle text-cherry">&</span>
          {COUPLE.bride}
        </h1>
        <div className="mt-4 flex items-center gap-2 text-sm text-ink-soft">
          <Calendar className="h-4 w-4 text-cherry" />
          <span>Friday · January 15, 2027</span>
        </div>

        <div className="animate-float relative mt-6">
          <img
            src={heroCouple}
            alt="Cartoon of the bride and groom waving"
            width={260}
            height={260}
            className="h-56 w-56 object-contain sm:h-64 sm:w-64"
          />
        </div>

        <p className="mt-4 text-xs uppercase tracking-widest text-ink-soft">
          Kepada Yth.
        </p>
        <p className="hand mt-1 max-w-xs px-2 text-center text-2xl text-cherry sm:text-3xl">
          {guest}
        </p>

        <button
          onClick={onOpen}
          className="animate-soft-pulse mt-6 inline-flex items-center gap-2 rounded-full bg-cherry px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-cherry/25 transition hover:brightness-110"
        >
          <Mail className="h-4 w-4" />
          Open Invitation
        </button>
        <div className="mt-6 flex items-center gap-1 text-xs text-ink-soft/70">
          <ChevronDown className="h-3 w-3" />
          scroll gently
        </div>
      </div>
    </div>
  );
}

function MusicToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={on ? "Pause music" : "Play music"}
      title={on ? "Pause music" : "Play music"}
      className={`fixed bottom-5 right-5 z-40 flex h-10 w-10 items-center justify-center rounded-full border shadow-md backdrop-blur-sm transition active:scale-95 ${
        on
          ? "border-cherry/40 bg-white/95 text-cherry hover:scale-105"
          : "border-ink-soft/30 bg-white/85 text-ink-soft hover:border-cherry/40 hover:text-cherry"
      }`}
    >
      {on ? (
        <Music2 className="h-5 w-5 animate-[spin_4s_linear_infinite]" />
      ) : (
        <div className="relative flex items-center justify-center">
          <Music className="h-5 w-5 opacity-40" />
          <span className="absolute h-[1.5px] w-6 rotate-45 rounded-full bg-cherry/70" />
        </div>
      )}
    </button>
  );
}

// ---------- Hero ----------

function Hero({ guest }: { guest: string }) {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-ivory via-blush-soft/60 to-cream px-4 py-16"
    >
      <Clouds />
      <FloatingHearts count={5} />

      <Reveal className="relative z-10 text-center">
        <SectionLabel>The Wedding of</SectionLabel>
        <h1 className="serif mt-4 text-6xl leading-none text-ink sm:text-7xl md:text-8xl">
          {COUPLE.groom}
          <span className="mx-2 text-cherry">&</span>
          {COUPLE.bride}
        </h1>
        <p className="mt-4 text-sm text-ink-soft">
          Kepada Yth.{" "}
          <span className="hand text-lg text-cherry">{guest}</span>
        </p>
      </Reveal>

      <div className="relative z-10 mt-6 flex items-end justify-center">
        <div className="relative">
          <img
            src={heroCouple}
            alt="Illustrated bride and groom waving"
            width={520}
            height={520}
            className="h-64 w-64 object-contain drop-shadow-xl sm:h-80 sm:w-80 md:h-96 md:w-96"
          />
          {/* waving hand hearts */}
          <Heart className="animate-float-sm absolute -left-6 top-6 h-6 w-6 fill-cherry text-cherry" />
          <Heart
            className="animate-float-sm absolute -right-4 top-16 h-4 w-4 fill-blush text-blush"
            style={{ animationDelay: "1.2s" }}
          />
          <Sparkles className="absolute right-10 top-0 h-5 w-5 text-cherry-soft" />
        </div>
      </div>

      <Reveal delay={200} className="relative z-10 mt-8 w-full max-w-md text-center">
        <p className="serif text-lg text-ink">
          Friday, 15 January 2027
        </p>
        <p className="text-xs uppercase tracking-[0.25em] text-ink-soft">
          Leuwinutug, Bogor · Indonesia
        </p>
        <div className="mt-6">
          <Countdown />
        </div>
      </Reveal>

      <Reveal delay={400} className="relative z-10 mt-10 flex flex-col items-center gap-2">
        <a
          href="#story"
          className="inline-flex items-center gap-2 rounded-full border border-cherry/30 bg-white/60 px-6 py-2.5 text-sm text-cherry backdrop-blur transition hover:bg-white"
        >
          Read our story
          <ChevronDown className="h-4 w-4" />
        </a>
      </Reveal>
    </section>
  );
}

// ---------- Couple ----------

function Couple() {
  const items = [
    {
      role: "The Groom",
      name: "Maulana Fajri",
      parents: "Putra dari Alm. Bpk. Helmi & Ibu Upi Yessi",
      cartoon: cartoonGroom,
      tape: "-6deg",
    },
    {
      role: "The Bride",
      name: "Muzayyanah",
      parents: "Putri dari Bpk. Nawawi & Ibu Hamimah",
      cartoon: cartoonBride,
      tape: "4deg",
    },
  ];
  return (
    <section id="couple" className="relative px-4 py-24 sm:py-28">
      <Reveal>
        <SectionLabel>with joy, we introduce</SectionLabel>
        <SectionTitle>The Groom & Bride</SectionTitle>
        <p className="mx-auto mt-4 max-w-lg text-center text-sm leading-relaxed text-ink-soft">
          Two little hearts, one big adventure. Meet the humans (and their tiny
          cartoon versions) behind this celebration.
        </p>
      </Reveal>

      <Divider />

      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2">
        {items.map((p, i) => (
          <Reveal key={p.role} delay={i * 150}>
            <div className="paper relative rounded-[2rem] p-6 sm:p-8">
              <span
                className="tape-strip -top-2 left-8"
                style={{ transform: `rotate(${p.tape})` }}
              />
              <div className="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-2xl bg-blush-soft">
                <FloatingHearts count={3} />
                <span className="absolute left-6 top-8 h-20 w-20 rounded-full border border-cherry/10" />
                <span className="absolute bottom-10 right-7 h-12 w-12 rounded-full border border-cherry/10" />
                <img
                  src={p.cartoon}
                  alt={`Cartoon of ${p.name}`}
                  width={420}
                  height={420}
                  loading="lazy"
                  className="animate-float relative z-10 h-56 w-56 object-contain drop-shadow-md sm:h-64 sm:w-64"
                />
                <Sparkles className="animate-soft-pulse absolute right-8 top-8 h-6 w-6 text-cherry" />
              </div>
              <div className="mt-6 text-center">
                <span className="hand text-xl text-cherry">{p.role}</span>
                <h3 className="serif mt-1 text-3xl text-ink">{p.name}</h3>
                <p className="mt-2 text-sm text-ink-soft">{p.parents}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ---------- Love Story ----------

function LoveStory() {
  const scenes = [
    {
      date: "June 2024",
      title: "Meet",
      text: "Awal perkenalan dan kisah manis kita yang mulai bersemi.",
      img: story1,
    },
    {
      date: "December 2025",
      title: "First Meet",
      text: "Pertemuan pertama bertatap muka, penuh senyuman dan debar bahagia.",
      img: story2,
    },
    {
      date: "Agustus 2026",
      title: "Promise Ring",
      text: "Saling menyematkan cincin janji suci untuk melangkah ke jenjang masa depan.",
      img: story3,
    },
    {
      date: "Januari 2027",
      title: "Our Wedding",
      text: "Hari pernikahan yang dinanti, mengikat janji suci sehidup semati.",
      img: story4,
    },
  ];

  return (
    <section
      id="story"
      className="relative overflow-hidden bg-blush-soft/40 px-4 py-24 sm:py-28"
    >
      <Reveal>
        <SectionLabel>chapter by chapter</SectionLabel>
        <SectionTitle>Our Little Love Story</SectionTitle>
      </Reveal>

      <Divider />

      <div className="relative -mx-4 overflow-x-auto pb-4">
        <div className="mx-auto flex w-max gap-6 px-6 sm:gap-8">
          {scenes.map((s, i) => (
            <Reveal key={s.title} delay={i * 120}>
              <article className="paper relative w-[280px] shrink-0 rounded-3xl p-5 sm:w-[320px]">
                <span
                  className="tape-strip -top-3"
                  style={{ left: `${20 + i * 8}%` }}
                />
                <div className="overflow-hidden rounded-2xl bg-ivory">
                  <img
                    src={s.img}
                    alt={s.title}
                    width={900}
                    height={900}
                    loading="lazy"
                    className="animate-float-sm aspect-square w-full object-contain p-2"
                    style={{ animationDelay: `${i * 0.4}s` }}
                  />
                </div>
                <div className="mt-4">
                  <span className="hand text-lg text-cherry">{s.date}</span>
                  <h3 className="serif mt-1 text-2xl text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {s.text}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-ink-soft/70">
        ← swipe to keep reading →
      </p>
    </section>
  );
}

// ---------- Events ----------

function Events() {
  const events = [
    {
      title: "Akad Nikah",
      icon: <Heart className="h-5 w-5 fill-cherry text-cherry" />,
      date: "Friday, 15 January 2027",
      time: "09:00 WIB – Selesai",
      place: "Kediaman Mempelai Wanita (Ds. Leuwinutug)",
      note: "Momen sakral ijab kabul & syukuran bersama keluarga dan sahabat tercinta.",
      calendarUrl:
        "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Akad+Nikah+Lana+%26+Dyana&dates=20270115T020000Z/20270115T060000Z&details=Akad+Nikah+Maulana+Fajri+%26+Muzayyanah&location=Ds.+Leuwinutug%2C+Citeureup%2C+Bogor",
    },
  ];
  return (
    <section
      id="events"
      className="relative overflow-hidden bg-cream/60 px-4 py-24 sm:py-28"
    >
      <FloatingHearts count={4} />
      <Reveal>
        <SectionLabel>save the day</SectionLabel>
        <SectionTitle>Wedding Event</SectionTitle>
      </Reveal>
      <Divider />
      <div className="mx-auto flex max-w-xl justify-center">
        {events.map((e, i) => (
          <Reveal key={e.title} delay={i * 150} className="w-full">
            <div className="paper relative rounded-[2rem] p-7 text-center">
              <span
                className="tape-strip -top-3 left-1/2 -translate-x-1/2"
                style={{ transform: "translateX(-50%) rotate(-3deg)" }}
              />
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-blush-soft">
                {e.icon}
              </div>
              <h3 className="serif mt-4 text-3xl text-ink">{e.title}</h3>
              <div className="mt-5 space-y-2 text-sm text-ink-soft">
                <p className="flex items-center justify-center gap-2">
                  <Calendar className="h-4 w-4 text-cherry" />
                  {e.date}
                </p>
                <p className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4 text-cherry" />
                  {e.time}
                </p>
                <p className="flex items-center justify-center gap-2">
                  <MapPin className="h-4 w-4 text-cherry" />
                  {e.place}
                </p>
              </div>
              <p className="hand mt-4 text-lg text-cherry">{e.note}</p>
              <a
                href={e.calendarUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-cherry/30 px-5 py-2 text-sm text-cherry transition hover:bg-cherry hover:text-primary-foreground"
              >
                <Calendar className="h-4 w-4" />
                Add to Calendar
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ---------- Venue ----------

function Venue() {
  return (
    <section id="venue" className="relative px-4 py-24 sm:py-28">
      <Reveal>
        <SectionLabel>find your way</SectionLabel>
        <SectionTitle>The Venue</SectionTitle>
      </Reveal>
      <Divider />

      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
        <Reveal>
          <div className="paper relative grid min-h-80 place-items-center overflow-hidden rounded-[2rem] p-8">
            <span className="tape-strip -top-3 left-6" />
            <FloatingHearts count={4} />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="animate-float grid h-28 w-28 place-items-center rounded-full bg-blush-soft shadow-lg shadow-cherry/10">
                <MapPin className="h-12 w-12 text-cherry" />
              </div>
              <div className="mt-5 flex items-center gap-3 text-cherry/50">
                <span className="h-px w-16 bg-cherry/30" />
                <Heart className="animate-soft-pulse h-4 w-4 fill-cherry text-cherry" />
                <span className="h-px w-16 bg-cherry/30" />
              </div>
              <p className="hand mt-4 text-2xl text-cherry">meet us here</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="space-y-5">
            <div>
              <span className="hand text-xl text-cherry">Kediaman Mempelai Wanita</span>
              <h3 className="serif mt-1 text-3xl text-ink">
                Ds. Leuwinutug, Citeureup
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-ink-soft">
              Jl. Anyar, Leuwinutug, Kec. Citeureup, Kabupaten Bogor, Jawa Barat 16810.
            </p>

            <div className="paper rounded-2xl p-4 text-sm text-ink-soft">
              <p className="mb-2 flex items-center gap-2 text-ink">
                <Sparkles className="h-4 w-4 text-cherry" /> Travel tips
              </p>
              <ul className="ml-1 list-disc space-y-1 pl-4">
                <li>Akses mudah melalui Tol Jagorawi (Exit Tol Citeureup).</li>
                <li>Lokasi berada di Jl. Anyar, Ds. Leuwinutug.</li>
                <li>Mohon hadir 15-20 menit sebelum acara akad dimulai 🌸</li>
              </ul>
            </div>

            <a
              href="https://maps.app.goo.gl/2PerHnSgRHo84aB39?g_st=ic"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-cherry px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-cherry/25 transition hover:brightness-110"
            >
              <MapPin className="h-4 w-4" />
              Open in Google Maps
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------- RSVP ----------

function RSVP() {
  const [name, setName] = useState("");
  const [attend, setAttend] = useState<"yes" | "no" | "">("");
  const [guests, setGuests] = useState(1);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !attend) return;
    setSent(true);
  };

  return (
    <section id="rsvp" className="relative px-4 py-24 sm:py-28">
      <Reveal>
        <SectionLabel>please let us know</SectionLabel>
        <SectionTitle>Kindly RSVP</SectionTitle>
      </Reveal>
      <Divider />

      <Reveal className="mx-auto max-w-lg">
        <form
          onSubmit={submit}
          className="paper relative rounded-[2rem] p-6 sm:p-8"
        >
          <span className="tape-strip -top-3 left-6" />
          {sent ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-cherry text-primary-foreground">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="serif text-2xl text-ink">Thank you, {name}!</h3>
              <p className="text-sm text-ink-soft">
                Your reply has been noted. We can’t wait to celebrate with you 🌸
              </p>
            </div>
          ) : (
            <>
              <label className="mb-1 block text-xs uppercase tracking-widest text-ink-soft">
                Your name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Nara Prameswari"
                className="w-full rounded-2xl border border-border bg-ivory px-4 py-3 text-sm outline-none transition focus:border-cherry"
              />

              <label className="mb-1 mt-5 block text-xs uppercase tracking-widest text-ink-soft">
                Will you be there?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    { v: "yes", label: "Yes, with love 💌" },
                    { v: "no", label: "Sadly, cannot" },
                  ] as const
                ).map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => setAttend(o.v)}
                    className={`rounded-2xl border px-4 py-3 text-sm transition ${
                      attend === o.v
                        ? "border-cherry bg-cherry text-primary-foreground"
                        : "border-border bg-ivory text-ink hover:border-cherry/60"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>

              {attend === "yes" && (
                <>
                  <label className="mb-1 mt-5 block text-xs uppercase tracking-widest text-ink-soft">
                    Number of guests
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="h-10 w-10 rounded-full border border-border text-lg text-cherry"
                    >
                      −
                    </button>
                    <div className="paper flex-1 rounded-2xl py-2.5 text-center serif text-xl">
                      {guests}
                    </div>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.min(5, g + 1))}
                      className="h-10 w-10 rounded-full border border-border text-lg text-cherry"
                    >
                      +
                    </button>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-cherry px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-cherry/25 transition hover:brightness-110 disabled:opacity-40"
                disabled={!name || !attend}
              >
                <Send className="h-4 w-4" />
                Send my RSVP
              </button>
            </>
          )}
        </form>
      </Reveal>
    </section>
  );
}

// ---------- Gift ----------

function GiftSection() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (v: string, key: string) => {
    navigator.clipboard?.writeText(v);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const accounts = [
    { bank: "SeaBank", num: "901195226293", name: "Maulana Fajri" },
    { bank: "SeaBank", num: "901765085969", name: "Musayyanah" },
  ];

  return (
    <section
      id="gift"
      className="relative overflow-hidden bg-cream/60 px-4 py-24 sm:py-28"
    >
      <Reveal>
        <SectionLabel>with gratitude</SectionLabel>
        <SectionTitle>Wedding Gift</SectionTitle>
        <p className="mx-auto mt-4 max-w-md text-center text-sm text-ink-soft">
          Your presence is our greatest gift. If you wish to send a token of
          love, this little envelope is for you.
        </p>
      </Reveal>
      <Divider />

      <Reveal className="mx-auto max-w-md">
        <div className="relative">
          {/* Envelope */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="paper relative block w-full overflow-hidden rounded-[2rem] p-8 text-left transition hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cherry text-primary-foreground">
                <Gift className="h-6 w-6" />
              </div>
              <div>
                <p className="hand text-xl text-cherry">a little envelope</p>
                <h3 className="serif text-2xl text-ink">
                  {open ? "Tap to close" : "Tap to open"}
                </h3>
              </div>
            </div>
            <Heart className="absolute right-6 top-6 h-5 w-5 fill-cherry text-cherry animate-float-sm" />
          </button>

          {open && (
            <div className="animate-fade-up mt-4 space-y-3">
              {accounts.map((a) => (
                <div key={a.num} className="paper rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-ink-soft">
                        {a.bank}
                      </p>
                      <p className="serif text-lg text-ink">{a.num}</p>
                      <p className="text-xs text-ink-soft">a.n. {a.name}</p>
                    </div>
                    <button
                      onClick={() => copy(a.num, a.num)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-cherry/30 px-3 py-1.5 text-xs text-cherry hover:bg-cherry hover:text-primary-foreground"
                    >
                      {copied === a.num ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
              {/* QRIS hidden */}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}

function QrDoodle() {
  // Decorative faux QR made of cells
  const cells = Array.from({ length: 49 }, (_, i) => (i * 7 + 3) % 5 !== 0);
  return (
    <div className="grid h-full w-full grid-cols-7 gap-[2px]">
      {cells.map((on, i) => (
        <div
          key={i}
          className={on ? "bg-ink" : "bg-transparent"}
          style={{ borderRadius: 1 }}
        />
      ))}
    </div>
  );
}

// ---------- Wishes ----------

const GOOGLE_SCRIPT_WISHES_URL =
  "https://script.google.com/macros/s/AKfycbynKXlR6IdpEOKNk2q0NmqyfU3PaOZTE40-2iOsfqbNAhohGk-eGtB7ZcVaisbTt0MC/exec";

type Wish = { name: string; msg: string; color: string; date?: string };

const WISH_COLORS = ["bg-blush-soft", "bg-cream", "bg-blush", "bg-cherry/20"];

function Wishes() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load existing wishes from Google Sheets
  useEffect(() => {
    let isMounted = true;
    fetch(GOOGLE_SCRIPT_WISHES_URL)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.wishes)
              ? data.wishes
              : [];
        const parsed: Wish[] = list
          .map((item: any, i: number) => ({
            name: item.name || item.nama || item.Nama || "Tamu",
            msg:
              item.msg ||
              item.message ||
              item.ucapan ||
              item.Ucapan ||
              item.pesan ||
              item.Pesan ||
              "",
            date: item.date || item.tanggal || item.timestamp || "",
            color: WISH_COLORS[i % WISH_COLORS.length],
          }))
          .filter((w: Wish) => w.msg);
        setWishes(parsed);
      })
      .catch((err) => {
        console.warn("Could not load wishes from Google Apps Script:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const rot = (i: number) => (i % 2 === 0 ? -2 : 2) + ((i * 3) % 3);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !msg.trim() || submitting) return;

    const trimmedName = name.trim();
    const trimmedMsg = msg.trim();

    const newWish: Wish = {
      name: trimmedName,
      msg: trimmedMsg,
      color: WISH_COLORS[wishes.length % WISH_COLORS.length],
    };

    // Optimistically update UI
    setWishes((prev) => [newWish, ...prev]);
    setName("");
    setMsg("");
    setSubmitting(true);

    try {
      // Google Apps Script: use GET with query params (most reliable no-cors method)
      const params = new URLSearchParams({
        name: trimmedName,
        nama: trimmedName,
        msg: trimmedMsg,
        message: trimmedMsg,
        ucapan: trimmedMsg,
        pesan: trimmedMsg,
        timestamp: new Date().toISOString(),
        action: "addWish",
      });

      // Primary: fetch GET (no-cors safe, GAS reads via e.parameter)
      await fetch(`${GOOGLE_SCRIPT_WISHES_URL}?${params.toString()}`, {
        method: "GET",
        mode: "no-cors",
      });
    } catch (err) {
      console.error("Failed to post wish to Google Apps Script:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="wishes" className="relative px-4 py-24 sm:py-28">
      <Reveal>
        <SectionLabel>leave a little note</SectionLabel>
        <SectionTitle>Guest Wishes</SectionTitle>
      </Reveal>
      <Divider />

      <Reveal className="mx-auto max-w-lg">
        <form
          onSubmit={add}
          className="paper mb-10 rounded-[2rem] p-5 sm:p-6"
        >
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="rounded-2xl border border-border bg-ivory px-4 py-3 text-sm outline-none focus:border-cherry"
            />
            <span />
          </div>
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Write a little wish…"
            rows={3}
            className="mt-3 w-full rounded-2xl border border-border bg-ivory px-4 py-3 text-sm outline-none focus:border-cherry"
          />
          <button
            type="submit"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-cherry px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-cherry/25 hover:brightness-110 disabled:opacity-50"
            disabled={!name.trim() || !msg.trim() || submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" /> Send a wish
              </>
            )}
          </button>
        </form>
      </Reveal>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 text-ink-soft">
          <Loader2 className="mb-2 h-6 w-6 animate-spin text-cherry" />
          <p className="text-sm">Memuat ucapan doa restu…</p>
        </div>
      ) : wishes.length === 0 ? (
        <div className="paper mx-auto max-w-md rounded-2xl p-6 text-center text-ink-soft">
          <Heart className="mx-auto mb-2 h-6 w-6 fill-cherry/20 text-cherry/60" />
          <p className="text-sm">Belum ada ucapan doa restu.</p>
          <p className="hand mt-1 text-lg text-cherry">
            Jadilah yang pertama menuliskan doa untuk Lana &amp; Dyana! ✨
          </p>
        </div>
      ) : (
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 md:grid-cols-3">
          {wishes.map((w, i) => (
            <Reveal key={i} delay={i * 80}>
              <div
                className={`relative rounded-2xl ${w.color} p-5 shadow-md`}
                style={{ transform: `rotate(${rot(i)}deg)` }}
              >
                <span
                  className="tape-strip -top-2 left-1/2"
                  style={{ transform: "translateX(-50%) rotate(-6deg)" }}
                />
                <p className="serif text-sm leading-relaxed text-ink">“{w.msg}”</p>
                <p className="hand mt-3 text-lg text-cherry">— {w.name}</p>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

// ---------- Closing ----------

function Closing() {
  return (
    <section
      id="closing"
      className="relative overflow-hidden bg-gradient-to-b from-blush-soft/40 via-ivory to-cream px-4 py-28 text-center"
    >
      <FloatingHearts count={8} />
      <Clouds />
      <Reveal className="relative z-10 mx-auto max-w-2xl">
        <SectionLabel>with all our love</SectionLabel>
        <h2 className="serif mt-4 text-5xl leading-tight text-ink sm:text-6xl">
          Thank you, from the <br />
          <span className="text-cherry">bottom of our hearts</span>
        </h2>
        <img
          src={heroCouple}
          alt="Bride and groom waving thank you"
          width={520}
          height={520}
          className="animate-float mx-auto mt-8 h-64 w-64 object-contain sm:h-80 sm:w-80"
        />
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-ink-soft">
          Your presence, prayers, and warm wishes mean the world to us. See you
          soon — with cake, confetti, and a very tight hug.
        </p>
        <p className="hand mt-6 text-4xl text-cherry">
          {COUPLE.groom} <Heart className="mx-1 inline h-6 w-6 fill-cherry" /> {COUPLE.bride}
        </p>
        <p className="mt-8 text-xs uppercase tracking-[0.3em] text-ink-soft/70">
          Leuwinutug, Bogor · 15.01.2027
        </p>
      </Reveal>
    </section>
  );
}
