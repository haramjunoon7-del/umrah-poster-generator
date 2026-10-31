
"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { toBlob } from "html-to-image";

type PosterTheme =
  | "royal"
  | "emerald"
  | "black"
  | "cream"
  | "navy"
  | "maroon"
  | "ocean"
  | "purple"
  | "sunset"
  | "teal"
  | "rose"
  | "desert";

type FlightData = {
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  returnDate: string;
  returnFlight: string;
  returnTime: string;
};

type PackageData = {
  id: string;
  name: string;
  nights: string;
  makkahHotel: string;
  makkahCategory: string;
  makkahDistance: string;
  madinahHotel: string;
  madinahCategory: string;
  madinahDistance: string;
  sharing: string;
  quad: string;
  triple: string;
  double: string;
};

type SavedPoster = {
  id: string;
  title: string;
  theme: PosterTheme;
  flight: FlightData;
  packages: PackageData[];
  services: string;
  createdAt: string;
};

const STORAGE_KEY = "haram-junoon-saved-posters-v1";

const themes: Record<
  PosterTheme,
  {
    name: string;
    description: string;
    primary: string;
    secondary: string;
    accent: string;
    light: string;
    text: string;
    border: string;
    headerOverlay: string;
    gradient: string;
  }
> = {
  royal: {
    name: "Royal Blue",
    description: "Royal Blue & Champagne Gold",
    primary: "#102A43",
    secondary: "#1F5A85",
    accent: "#E0B45C",
    light: "#FFF9ED",
    text: "#102A43",
    border: "#D5AD58",
    headerOverlay: "rgba(16,42,67,0.32)",
    gradient: "linear-gradient(120deg,#102A43,#1F5A85,#D5AD58)",
  },
  emerald: {
    name: "Emerald",
    description: "Emerald Green & Gold",
    primary: "#064E3B",
    secondary: "#16836A",
    accent: "#E4C477",
    light: "#F0F8F3",
    text: "#064E3B",
    border: "#C9A65C",
    headerOverlay: "rgba(6,78,59,0.32)",
    gradient: "linear-gradient(120deg,#064E3B,#16836A,#C9A65C)",
  },
  black: {
    name: "Black Gold",
    description: "Luxury Black & Gold",
    primary: "#171717",
    secondary: "#51402A",
    accent: "#E2B95F",
    light: "#FBF7EF",
    text: "#201A12",
    border: "#C6A15C",
    headerOverlay: "rgba(0,0,0,0.45)",
    gradient: "linear-gradient(120deg,#171717,#51402A,#DDB45D)",
  },
  cream: {
    name: "Cream",
    description: "Warm Cream & Brown",
    primary: "#6A4328",
    secondary: "#A46D3D",
    accent: "#C99A54",
    light: "#FFF8EA",
    text: "#56351F",
    border: "#D7BD91",
    headerOverlay: "rgba(72,48,28,0.30)",
    gradient: "linear-gradient(120deg,#6A4328,#A46D3D,#D8B77A)",
  },
  navy: {
    name: "Navy Silver",
    description: "Navy & Platinum Silver",
    primary: "#142C45",
    secondary: "#45627D",
    accent: "#C9D5E0",
    light: "#F3F6F9",
    text: "#142C45",
    border: "#B8C6D5",
    headerOverlay: "rgba(20,44,69,0.38)",
    gradient: "linear-gradient(120deg,#142C45,#45627D,#AEBFCE)",
  },
  maroon: {
    name: "Maroon",
    description: "Royal Maroon & Gold",
    primary: "#641E35",
    secondary: "#963E56",
    accent: "#E0B86C",
    light: "#FFF3F3",
    text: "#641E35",
    border: "#D2A9AE",
    headerOverlay: "rgba(100,30,53,0.36)",
    gradient: "linear-gradient(120deg,#641E35,#963E56,#E0B86C)",
  },
  ocean: {
    name: "Royal Ocean",
    description: "Ocean Blue Gradient",
    primary: "#102A43",
    secondary: "#2876A8",
    accent: "#E4C477",
    light: "#EFF7FC",
    text: "#102A43",
    border: "#9BC4DE",
    headerOverlay: "rgba(16,42,67,0.34)",
    gradient: "linear-gradient(120deg,#102A43,#2876A8,#54A6C8)",
  },
  purple: {
    name: "Royal Purple",
    description: "Purple & Lavender Gradient",
    primary: "#25245D",
    secondary: "#6256A6",
    accent: "#D6C5F0",
    light: "#F5F1FC",
    text: "#30245D",
    border: "#C7B9EA",
    headerOverlay: "rgba(37,36,93,0.36)",
    gradient: "linear-gradient(120deg,#25245D,#6256A6,#A995D7)",
  },
  sunset: {
    name: "Sunset Luxury",
    description: "Burgundy & Rose Gold",
    primary: "#702B36",
    secondary: "#B65B50",
    accent: "#F0C38B",
    light: "#FFF4EF",
    text: "#702B36",
    border: "#D9A18D",
    headerOverlay: "rgba(112,43,54,0.36)",
    gradient: "linear-gradient(120deg,#702B36,#B65B50,#E7A879)",
  },
  teal: {
    name: "Islamic Teal",
    description: "Deep Teal & Champagne",
    primary: "#064B50",
    secondary: "#14858A",
    accent: "#E6C77B",
    light: "#EFF9F8",
    text: "#064B50",
    border: "#9ACDCA",
    headerOverlay: "rgba(6,75,80,0.36)",
    gradient: "linear-gradient(120deg,#064B50,#14858A,#80BEB2)",
  },
  rose: {
    name: "Rose Gold",
    description: "Rose & Soft Gold",
    primary: "#713B52",
    secondary: "#B36D82",
    accent: "#EAC49D",
    light: "#FFF4F6",
    text: "#713B52",
    border: "#E0B7C3",
    headerOverlay: "rgba(113,59,82,0.36)",
    gradient: "linear-gradient(120deg,#713B52,#B36D82,#EAC49D)",
  },
  desert: {
    name: "Desert Sand",
    description: "Desert Brown & Sand Gold",
    primary: "#56351F",
    secondary: "#A46D3D",
    accent: "#E7C58A",
    light: "#FFF8EA",
    text: "#56351F",
    border: "#D8B77A",
    headerOverlay: "rgba(86,53,31,0.34)",
    gradient: "linear-gradient(120deg,#56351F,#A46D3D,#E7C58A)",
  },
};

const themeOptions: PosterTheme[] = [
  "royal",
  "emerald",
  "black",
  "cream",
  "navy",
  "maroon",
  "ocean",
  "purple",
  "sunset",
  "teal",
  "rose",
  "desert",
];

const blankFlight: FlightData = {
  airline: "Airblue",
  flightNumber: "",
  origin: "Multan",
  destination: "Jeddah",
  departureDate: "",
  departureTime: "",
  returnDate: "",
  returnFlight: "",
  returnTime: "",
};

function blankPackage(id: string, number: number): PackageData {
  return {
    id,
    name: `Package ${number}`,
    nights: "21",
    makkahHotel: "",
    makkahCategory: "3 Star",
    makkahDistance: "",
    madinahHotel: "",
    madinahCategory: "3 Star",
    madinahDistance: "",
    sharing: "",
    quad: "",
    triple: "",
    double: "",
  };
}

function money(value: string) {
  if (!value?.trim()) return "Rate on request";

  const number = Number(value.replace(/,/g, ""));

  return Number.isFinite(number)
    ? `${number.toLocaleString("en-PK")}/-`
    : value;
}

function dateText(value: string) {
  if (!value) return "Date not added";

  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

function timeText(value: string) {
  if (!value) return "Time not added";

  const [hours, minutes] = value.split(":").map(Number);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return value;
  }

  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${
    hours >= 12 ? "PM" : "AM"
  }`;
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block min-w-0 text-sm">
      <span className="mb-1.5 block font-bold text-slate-700">
        {label}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block min-w-0 text-sm">
      <span className="mb-1.5 block font-bold text-slate-700">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-blue-800"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

/* AIRLINE LOGOS */

function getAirlineInfo(name: string) {
  const airline = (name || "").toLowerCase().replace(/[^a-z0-9]/g, "");

  const logos: Record<
    string,
    { name: string; src: string; initials: string }
  > = {
    pia: {
      name: "PIA",
      src: "/airlines/pia.png",
      initials: "PIA",
    },
    flyjinnah: {
      name: "Fly Jinnah",
      src: "/airlines/fly-jinnah.png",
      initials: "FJ",
    },
    airsial: {
      name: "AirSial",
      src: "/airlines/airsial.png",
      initials: "AS",
    },
    airblue: {
      name: "Airblue",
      src: "/airlines/airblue.png",
      initials: "AB",
    },
    riyadhair: {
      name: "Riyadh Air",
      src: "/airlines/riyadh-air.png",
      initials: "RA",
    },
    saudia: {
      name: "Saudia",
      src: "/airlines/saudia.png",
      initials: "SV",
    },
    saudiaairline: {
      name: "Saudia",
      src: "/airlines/saudia.png",
      initials: "SV",
    },
    salamair: {
      name: "SalamAir",
      src: "/airlines/salamair.png",
      initials: "OV",
    },
  };

  return (
    logos[airline] || {
      name: name || "AIRLINE",
      src: "",
      initials: (name || "AIR").slice(0, 3).toUpperCase(),
    }
  );
}

function AirlineLogo({
  airline,
  className = "",
}: {
  airline: string;
  className?: string;
}) {
  const info = getAirlineInfo(airline);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [airline]);

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 ${className}`}
      title={info.name}
    >
      {info.src && !failed ? (
        <img
          src={info.src}
          alt={`${info.name} official logo`}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          className="h-full w-full scale-110 object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-sm font-black text-[#17365d]">
          {info.initials}
        </span>
      )}
    </div>
  );
}

export default function Home() {
  const [flight, setFlight] = useState<FlightData>({ ...blankFlight });

  const [packages, setPackages] = useState<PackageData[]>([
    blankPackage("1", 1),
  ]);

  const [title, setTitle] = useState("UMRAH PACKAGE");
  const [theme, setTheme] = useState<PosterTheme>("royal");

  const [services, setServices] = useState(
    "Visa • Return Ticket • Accommodation • Transport • 21 Days"
  );

  const [savedPosters, setSavedPosters] = useState<SavedPoster[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activePoster, setActivePoster] = useState<SavedPoster | null>(null);
  const [message, setMessage] = useState("");
  const [copying, setCopying] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const posterRef = useRef<HTMLDivElement>(null);

  const currentTheme = themes[theme];

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          const compatiblePosters: SavedPoster[] = parsed.map(
            (poster: SavedPoster) => ({
              ...poster,
              theme: themes[poster.theme] ? poster.theme : "royal",
            })
          );

          setSavedPosters(compatiblePosters);
        }
      }
    } catch {
      setMessage("Saved posters load nahi ho sake.");
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPosters));
    } catch {
      setMessage("Storage full hai. Download Backup use karein.");
    }
  }, [savedPosters, hydrated]);

  function updateFlight(key: keyof FlightData, value: string) {
    setFlight((old) => ({ ...old, [key]: value }));
    setActivePoster(null);
  }

  function updatePackage(
    id: string,
    key: keyof PackageData,
    value: string
  ) {
    setPackages((old) =>
      old.map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      )
    );

    setActivePoster(null);
  }

  function addPackage() {
    setPackages((old) => [
      ...old,
      blankPackage(String(Date.now()), old.length + 1),
    ]);

    setActivePoster(null);
    setMessage("New package add ho gaya.");
  }

  function removePackage(id: string) {
    if (packages.length <= 1) {
      setMessage("Kam az kam aik package zaroor rakhein.");
      return;
    }

    setPackages((old) => old.filter((item) => item.id !== id));
    setActivePoster(null);
  }

  /* NEW POSTER - LOAD LATEST SAVED DETAILS */

  function newPoster() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const saved: SavedPoster[] = stored ? JSON.parse(stored) : [];

      const latestPoster = [...saved].sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )[0];

      if (latestPoster) {
        setTitle(latestPoster.title || "UMRAH PACKAGE");

        setFlight({
          ...blankFlight,
          ...(latestPoster.flight || {}),
        });

        setPackages(
          latestPoster.packages?.length
            ? latestPoster.packages.map((item, index) => ({
                ...item,
                id: `${Date.now()}-${index}`,
              }))
            : [blankPackage(String(Date.now()), 1)]
        );

        setTheme(
          themes[latestPoster.theme] ? latestPoster.theme : "royal"
        );

        setServices(
          latestPoster.services ||
            "Visa • Return Ticket • Accommodation • Transport • 21 Days"
        );

        setSavedPosters(saved);
      } else {
        setTitle("UMRAH PACKAGE");
        setFlight({ ...blankFlight });
        setPackages([blankPackage(String(Date.now()), 1)]);
        setTheme("royal");
        setServices(
          "Visa • Return Ticket • Accommodation • Transport • 21 Days"
        );
      }

      setEditingId(null);
      setActivePoster(null);

      setMessage(
        latestPoster
          ? "Latest saved poster ki details load ho gayi hain. Changes karke naya poster save karein."
          : "Naya poster ready hai."
      );

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
      setMessage("Saved poster load nahi ho saka.");
    }
  }

  /* SAVE POSTER */

  function savePoster() {
    const poster: SavedPoster = {
      id: editingId || String(Date.now()),
      title: title.trim() || "UMRAH PACKAGE",
      theme,
      flight: { ...flight },
      packages: packages.map((item) => ({ ...item })),
      services,
      createdAt: new Date().toISOString(),
    };

    const updatedPosters = editingId
      ? savedPosters.some((item) => item.id === editingId)
        ? savedPosters.map((item) =>
            item.id === editingId ? poster : item
          )
        : [poster, ...savedPosters]
      : [poster, ...savedPosters];

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedPosters)
      );

      setSavedPosters(updatedPosters);
      setActivePoster(poster);
      setEditingId(poster.id);
      setMessage("Poster successfully save ho gaya.");
    } catch (error) {
      console.error(error);
      setMessage("Poster save nahi ho saka. Browser storage check karein.");
    }
  }

  function editPoster(poster: SavedPoster) {
    setTitle(poster.title);
    setTheme(poster.theme || "royal");
    setFlight({ ...poster.flight });
    setPackages(poster.packages.map((item) => ({ ...item })));
    setServices(poster.services);
    setEditingId(poster.id);
    setActivePoster(null);
    setMessage("Poster edit mode mein open hai.");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showPoster(poster: SavedPoster) {
    setTitle(poster.title);
    setTheme(poster.theme || "royal");
    setFlight({ ...poster.flight });
    setPackages(poster.packages.map((item) => ({ ...item })));
    setServices(poster.services);
    setEditingId(poster.id);
    setActivePoster(poster);

    document.getElementById("poster-preview")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function deletePoster(id: string) {
    if (!window.confirm("Kya aap ye poster delete karna chahte hain?")) {
      return;
    }

    setSavedPosters((old) => old.filter((item) => item.id !== id));

    if (editingId === id) newPoster();

    setMessage("Poster delete ho gaya.");
  }

  /* COPY POSTER IMAGE */

  async function copyPosterImage() {
    const target = posterRef.current;

    if (!target) {
      setMessage("Poster preview load hone dein.");
      return;
    }

    setCopying(true);
    setMessage("");

    try {
      await document.fonts.ready;

      const blob = await toBlob(target, {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
      });

      if (!blob) throw new Error("Image create nahi hui.");

      if (
        navigator.clipboard &&
        typeof ClipboardItem !== "undefined" &&
        typeof navigator.clipboard.write === "function"
      ) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);

        setMessage(
          "Poster image copy ho gayi! WhatsApp mein Ctrl + V karein."
        );
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "haram-junoon-umrah-poster.png";

        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
        setMessage("Poster PNG download ho gayi.");
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Copy fail hui. Chrome mein localhost ya HTTPS use karein."
      );
    } finally {
      setCopying(false);
    }
  }

  function exportSavedData() {
    const blob = new Blob([JSON.stringify(savedPosters, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "haram-junoon-saved-posters.json";
    link.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const shownPoster: SavedPoster = activePoster || {
    id: "preview",
    title,
    theme,
    flight,
    packages,
    services,
    createdAt: "",
  };

  const posterTheme = themes[shownPoster.theme || "royal"];

  const routeText = `${
    shownPoster.flight.origin || "MULTAN"
  } - ${shownPoster.flight.destination || "JEDDAH"} - ${
    shownPoster.flight.origin || "MULTAN"
  }`;

  return (
    <main className="min-h-screen bg-[#f1f3f6] text-slate-900">
      <style jsx global>{`
        * {
          font-family: Arial, Helvetica, sans-serif;
        }

        .poster-art {
          width: 100%;
          max-width: 980px;
          background: #fff;
          color: #172d50;
        }

        .poster-art table {
          border-collapse: collapse;
          width: 100%;
          table-layout: fixed;
        }

        .poster-art th,
        .poster-art td {
          overflow-wrap: anywhere;
        }

        .theme-choice {
          transition: all 0.2s ease;
        }

        .theme-choice:hover {
          transform: translateY(-2px);
        }

        .hotel-name {
          font-size: 13px;
          line-height: 1.35;
          font-weight: 900;
          overflow-wrap: anywhere;
        }

        .rate-value {
          font-size: 11px;
          line-height: 1.35;
          font-weight: 900;
          overflow-wrap: anywhere;
          font-variant-numeric: tabular-nums;
        }

        @media (min-width: 640px) {
          .hotel-name {
            font-size: 16px;
          }

          .rate-value {
            font-size: 14px;
          }
        }

        @media (max-width: 380px) {
          .hotel-name {
            font-size: 11px;
          }

          .rate-value {
            font-size: 9px;
          }
        }
      `}</style>

      {/* MAIN HEADER */}

      <header className="bg-gradient-to-r from-[#101f35] via-[#17395e] to-[#244c75] px-5 py-7 text-white shadow-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-xs font-black tracking-[0.28em] text-[#e3bd72]">
              HARAM JUNOON TRAVELS & TOURS
            </p>

            <h1 className="mt-2 text-3xl font-black sm:text-4xl">
              Umrah Poster Studio
            </h1>

            <p className="mt-2 text-sm text-white/70">
              Professional package poster designer
            </p>
          </div>

          <button
            onClick={newPoster}
            className="rounded-xl border border-[#e5c47e]/60 bg-gradient-to-r from-[#e9c77e] to-[#bd9144] px-6 py-3 font-black text-[#172b45] shadow-lg transition hover:brightness-105"
          >
            + New Poster
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-6 p-4 lg:grid-cols-[0.9fr_1.1fr] sm:p-6">
        {/* LEFT SIDE FORM */}

        <section className="space-y-5">
          {/* POSTER DETAILS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <p className="text-xs font-black tracking-widest text-[#b28a49]">
                DESIGN SETTINGS
              </p>

              <h2 className="mt-1 text-xl font-black text-[#17365d]">
                Poster Details
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Poster Heading"
                value={title}
                onChange={(v) => {
                  setTitle(v);
                  setActivePoster(null);
                }}
              />

              <Field
                label="Included Services"
                value={services}
                onChange={(v) => {
                  setServices(v);
                  setActivePoster(null);
                }}
              />
            </div>

            {/* THEME SELECTOR */}

            <div className="mt-6 border-t border-slate-100 pt-5">
              <div className="mb-3">
                <h3 className="font-black text-[#17365d]">
                  Choose Poster Colour Theme
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  12 professional solid and gradient designs
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {themeOptions.map((option) => {
                  const item = themes[option];
                  const selected = theme === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setTheme(option);
                        setActivePoster(null);
                      }}
                      className={`theme-choice rounded-xl border-2 p-3 text-left ${
                        selected
                          ? "border-[#bd9144] bg-amber-50 shadow-md"
                          : "border-slate-200 bg-white hover:border-slate-400"
                      }`}
                    >
                      <div
                        className="mb-3 h-9 overflow-hidden rounded-lg shadow-inner"
                        style={{ background: item.gradient }}
                      />

                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-black text-slate-800">
                          {item.name}
                        </span>

                        {selected && (
                          <span className="text-xs font-black text-[#a7792e]">
                            ✓
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-[10px] text-slate-500">
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* FLIGHT DETAILS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <p className="text-xs font-black tracking-widest text-[#b28a49]">
                TRAVEL INFORMATION
              </p>

              <h2 className="mt-1 text-xl font-black text-[#17365d]">
                ✈ Shared Flight Details
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Select Airline"
                value={flight.airline}
                onChange={(v) => updateFlight("airline", v)}
                options={[
                  "PIA",
                  "Fly Jinnah",
                  "AirSial",
                  "Airblue",
                  "Riyadh Air",
                  "Saudia Airline",
                  "SalamAir",
                ]}
              />

              <Field
                label="Outbound Flight Number"
                value={flight.flightNumber}
                onChange={(v) => updateFlight("flightNumber", v)}
              />

              <Field
                label="Origin"
                value={flight.origin}
                onChange={(v) => updateFlight("origin", v)}
              />

              <Field
                label="Destination"
                value={flight.destination}
                onChange={(v) => updateFlight("destination", v)}
              />

              <Field
                label="Departure Date"
                type="date"
                value={flight.departureDate}
                onChange={(v) => updateFlight("departureDate", v)}
              />

              <Field
                label="Departure Time"
                type="time"
                value={flight.departureTime}
                onChange={(v) => updateFlight("departureTime", v)}
              />

              <Field
                label="Return Date"
                type="date"
                value={flight.returnDate}
                onChange={(v) => updateFlight("returnDate", v)}
              />

              <Field
                label="Return Flight Number"
                value={flight.returnFlight}
                onChange={(v) => updateFlight("returnFlight", v)}
              />

              <Field
                label="Return Time"
                type="time"
                value={flight.returnTime}
                onChange={(v) => updateFlight("returnTime", v)}
              />
            </div>
          </div>

          {/* PACKAGE FORMS */}

          {packages.map((pkg, index) => (
            <div
              key={pkg.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div
                className="flex items-center justify-between p-4 text-white"
                style={{ background: currentTheme.gradient }}
              >
                <div>
                  <p
                    className="text-xs font-black tracking-widest"
                    style={{ color: currentTheme.accent }}
                  >
                    PACKAGE {index + 1}
                  </p>

                  <h2 className="text-lg font-black">Hotel & Rates</h2>
                </div>

                <button
                  onClick={() => removePackage(pkg.id)}
                  className="rounded-lg border border-white/40 px-3 py-2 text-sm font-bold transition hover:bg-white/10"
                >
                  Remove
                </button>
              </div>

              <div className="space-y-4 p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Package Name"
                    value={pkg.name}
                    onChange={(v) => updatePackage(pkg.id, "name", v)}
                  />

                  <Field
                    label="Total Nights"
                    value={pkg.nights}
                    onChange={(v) => updatePackage(pkg.id, "nights", v)}
                  />
                </div>

                {/* MAKKAH HOTEL FORM */}

                <div className="rounded-xl border border-emerald-200 bg-[#f0f8f2] p-4">
                  <h3 className="mb-3 font-black text-[#07543F]">
                    🕋 Makkah Hotel
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Hotel Name"
                      value={pkg.makkahHotel}
                      onChange={(v) =>
                        updatePackage(pkg.id, "makkahHotel", v)
                      }
                    />

                    <SelectField
                      label="Category"
                      value={pkg.makkahCategory}
                      onChange={(v) =>
                        updatePackage(pkg.id, "makkahCategory", v)
                      }
                      options={["Economy", "3 Star", "4 Star", "5 Star"]}
                    />

                    <Field
                      label="Distance from Haram"
                      value={pkg.makkahDistance}
                      onChange={(v) =>
                        updatePackage(pkg.id, "makkahDistance", v)
                      }
                    />
                  </div>
                </div>

                {/* MADINAH HOTEL FORM */}

                <div className="rounded-xl border border-blue-200 bg-[#f0f5fc] p-4">
                  <h3 className="mb-3 font-black text-[#17477D]">
                    ☪ Madinah Hotel
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Hotel Name"
                      value={pkg.madinahHotel}
                      onChange={(v) =>
                        updatePackage(pkg.id, "madinahHotel", v)
                      }
                    />

                    <SelectField
                      label="Category"
                      value={pkg.madinahCategory}
                      onChange={(v) =>
                        updatePackage(pkg.id, "madinahCategory", v)
                      }
                      options={["Economy", "3 Star", "4 Star", "5 Star"]}
                    />

                    <Field
                      label="Distance from Masjid Nabawi"
                      value={pkg.madinahDistance}
                      onChange={(v) =>
                        updatePackage(pkg.id, "madinahDistance", v)
                      }
                    />
                  </div>
                </div>

                {/* RATES FORM */}

                <div className="rounded-xl border border-amber-200 bg-[#fffcf3] p-4">
                  <h3 className="mb-3 font-black text-[#72501E]">
                    Package Rates (PKR)
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Sharing Rate"
                      value={pkg.sharing}
                      onChange={(v) =>
                        updatePackage(pkg.id, "sharing", v)
                      }
                    />

                    <Field
                      label="Quad Sharing Rate"
                      value={pkg.quad}
                      onChange={(v) =>
                        updatePackage(pkg.id, "quad", v)
                      }
                    />

                    <Field
                      label="Triple Sharing Rate"
                      value={pkg.triple}
                      onChange={(v) =>
                        updatePackage(pkg.id, "triple", v)
                      }
                    />

                    <Field
                      label="Double Sharing Rate"
                      value={pkg.double}
                      onChange={(v) =>
                        updatePackage(pkg.id, "double", v)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addPackage}
            className="w-full rounded-xl border-2 border-dashed border-[#23466d] bg-white p-4 font-black text-[#17365d] transition hover:bg-blue-50"
          >
            + Add New Package
          </button>

          {/* SAVE BUTTONS */}

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={savePoster}
              className="rounded-xl px-5 py-4 font-black text-white shadow-lg transition hover:brightness-110"
              style={{ background: currentTheme.gradient }}
            >
              {editingId ? "Save Changes" : "Save Poster"}
            </button>

            <button
              onClick={newPoster}
              className="rounded-xl bg-gradient-to-r from-[#e9c77e] to-[#bd9144] px-5 py-4 font-black text-[#172b45] shadow-lg transition hover:brightness-105"
            >
              + Create New Poster
            </button>
          </div>

          {message && (
            <p className="rounded-xl border border-blue-200 bg-white p-3 text-sm font-semibold text-[#17365d]">
              {message}
            </p>
          )}

          {/* SAVED POSTERS */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-[#17365d]">
                  Saved Posters
                </h2>

                <p className="text-sm text-slate-500">
                  {savedPosters.length} saved poster(s)
                </p>
              </div>

              <button
                disabled={!savedPosters.length}
                onClick={exportSavedData}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold transition hover:bg-slate-50 disabled:opacity-40"
              >
                Download Backup
              </button>
            </div>

            {!hydrated ? (
              <p>Loading...</p>
            ) : savedPosters.length === 0 ? (
              <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                Abhi koi poster save nahi hua.
              </p>
            ) : (
              <div className="space-y-3">
                {savedPosters.map((poster) => {
                  const savedTheme = themes[poster.theme || "royal"];

                  return (
                    <div
                      key={poster.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="break-words font-black text-slate-800">
                          {poster.title}
                        </p>

                        <p className="text-sm text-slate-500">
                          {poster.packages.length} package(s) ·{" "}
                          {poster.flight.airline}
                        </p>

                        <span
                          className="mt-2 inline-block rounded-md px-2 py-1 text-[10px] font-black text-white"
                          style={{ background: savedTheme.gradient }}
                        >
                          {savedTheme.name} Theme
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => showPoster(poster)}
                          className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-bold text-blue-900"
                        >
                          Preview
                        </button>

                        <button
                          onClick={() => editPoster(poster)}
                          className="rounded-lg bg-amber-100 px-3 py-2 text-sm font-bold text-amber-900"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deletePoster(poster.id)}
                          className="rounded-lg bg-red-100 px-3 py-2 text-sm font-bold text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* RIGHT SIDE POSTER PREVIEW */}

        <section id="poster-preview" className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black tracking-widest text-[#b28a49]">
                LIVE DESIGN
              </p>

              <h2 className="mt-1 text-xl font-black text-[#17365d]">
                Poster Preview
              </h2>

              <p className="text-sm text-slate-500">
                {posterTheme.name} · {posterTheme.description}
              </p>
            </div>

            <button
              onClick={copyPosterImage}
              disabled={copying}
              className="rounded-xl px-4 py-3 text-sm font-black text-white shadow-lg transition hover:brightness-110 disabled:opacity-60"
              style={{ background: posterTheme.gradient }}
            >
              {copying ? "Preparing Image..." : "▣ Copy Poster Image"}
            </button>
          </div>

          <div
            ref={posterRef}
            className="poster-art mx-auto overflow-hidden rounded-[20px] border bg-white shadow-2xl"
            style={{
              borderColor: posterTheme.border,
              boxShadow: "0 18px 50px rgba(15,23,42,0.16)",
            }}
          >
            {/* POSTER HEADER */}

            <div className="relative h-[300px] overflow-hidden bg-slate-900 sm:h-[350px]">
              <img
                src="https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1800&q=90"
                alt="Masjid al Haram Makkah"
                crossOrigin="anonymous"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />

              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom, ${posterTheme.headerOverlay}, rgba(0,0,0,0.05) 42%, ${posterTheme.primary} 100%)`,
                  opacity: 0.95,
                }}
              />

              <div
                className="absolute left-4 top-4 z-20 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 bg-white p-1 shadow-xl sm:left-6 sm:top-5 sm:h-[76px] sm:w-[76px]"
                style={{ borderColor: posterTheme.accent }}
              >
                <img
                  src="/haram-junoon-logo.png"
                  alt="Haram Junoon Logo"
                  className="h-full w-full rounded-full object-contain"
                />
              </div>

              <div
                className="absolute right-4 top-5 z-10 rounded-lg border px-3 py-2 text-xs font-black tracking-widest shadow-lg sm:right-6 sm:px-4 sm:text-sm"
                style={{
                  borderColor: posterTheme.accent,
                  background: "rgba(255,255,255,0.96)",
                  color: posterTheme.primary,
                }}
              >
                HARAM JUNOON TRAVELS & TOURS
              </div>

              <div className="absolute bottom-0 left-0 right-0 z-10 px-3 pb-4 text-center">
                <p
                  className="mb-2 text-[10px] font-black tracking-[0.3em] sm:text-xs"
                  style={{ color: posterTheme.accent }}
                >
                  YOUR JOURNEY, OUR CARE
                </p>

                <h2
                  className="mx-auto inline-block max-w-full break-words rounded-lg border px-5 py-2 text-3xl font-black uppercase shadow-lg sm:text-5xl"
                  style={{
                    background: posterTheme.gradient,
                    borderColor: posterTheme.accent,
                    color: "#ffffff",
                  }}
                >
                  {shownPoster.title || "UMRAH PACKAGE"}
                </h2>

                <p
                  className="mt-2 break-words rounded-md px-2 py-2 text-lg font-black uppercase shadow sm:text-2xl"
                  style={{
                    background: "rgba(255,255,255,0.96)",
                    color: posterTheme.text,
                  }}
                >
                  {routeText}
                </p>
              </div>
            </div>

            {/* POSTER BODY */}

            <div className="px-3 pb-4 pt-3 sm:px-5">
              <div
                className="rounded-2xl border p-3 sm:p-4"
                style={{ borderColor: posterTheme.border }}
              >
                {/* FLIGHT CARDS */}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div
                    className="flex min-w-0 items-center gap-3 rounded-xl border bg-white p-3 shadow-sm"
                    style={{ borderColor: posterTheme.border }}
                  >
                    <AirlineLogo
                      airline={shownPoster.flight.airline}
                      className="h-14 w-[76px]"
                    />

                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[10px] font-black uppercase tracking-wider"
                        style={{ color: posterTheme.secondary }}
                      >
                        ✈ DEPARTURE FLIGHT
                      </p>

                      <p
                        className="mt-1 break-words text-xs font-black uppercase sm:text-sm"
                        style={{ color: posterTheme.text }}
                      >
                        {dateText(shownPoster.flight.departureDate)} ·{" "}
                        {shownPoster.flight.flightNumber || "FLIGHT"}
                      </p>

                      <p className="mt-1 break-words text-[10px] font-bold text-slate-600 sm:text-xs">
                        {shownPoster.flight.origin} →{" "}
                        {shownPoster.flight.destination}
                      </p>

                      <p className="mt-1 text-[10px] font-semibold text-slate-600">
                        ◷ {timeText(shownPoster.flight.departureTime)} ·
                        Baggage: 20 KG
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex min-w-0 items-center gap-3 rounded-xl border bg-white p-3 shadow-sm"
                    style={{ borderColor: posterTheme.border }}
                  >
                    <AirlineLogo
                      airline={shownPoster.flight.airline}
                      className="h-14 w-[76px]"
                    />

                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[10px] font-black uppercase tracking-wider"
                        style={{ color: posterTheme.secondary }}
                      >
                        ✈ RETURN FLIGHT
                      </p>

                      <p
                        className="mt-1 break-words text-xs font-black uppercase sm:text-sm"
                        style={{ color: posterTheme.text }}
                      >
                        {dateText(shownPoster.flight.returnDate)} ·{" "}
                        {shownPoster.flight.returnFlight || "FLIGHT"}
                      </p>

                      <p className="mt-1 break-words text-[10px] font-bold text-slate-600 sm:text-xs">
                        {shownPoster.flight.destination} →{" "}
                        {shownPoster.flight.origin}
                      </p>

                      <p className="mt-1 text-[10px] font-semibold text-slate-600">
                        ◷ {timeText(shownPoster.flight.returnTime)} ·
                        Baggage: 20 KG
                      </p>
                    </div>
                  </div>
                </div>

                {/* HOTEL AND RATES TABLE */}

                <div
                  className="mt-4 overflow-hidden rounded-xl border"
                  style={{ borderColor: posterTheme.border }}
                >
                  <table>
                    <colgroup>
                      <col style={{ width: "23%" }} />
                      <col style={{ width: "23%" }} />
                      <col style={{ width: "13.5%" }} />
                      <col style={{ width: "13.5%" }} />
                      <col style={{ width: "13.5%" }} />
                      <col style={{ width: "13.5%" }} />
                    </colgroup>

                    <thead>
                      <tr
                        style={{
                          background: posterTheme.gradient,
                          color: "#ffffff",
                        }}
                      >
                        <th className="px-1 py-3 text-center text-[9px] font-black sm:px-2 sm:text-[11px]">
                          MAKKAH HOTEL
                        </th>

                        <th className="px-1 py-3 text-center text-[9px] font-black sm:px-2 sm:text-[11px]">
                          MADINAH HOTEL
                        </th>

                        <th
                          className="px-1 py-3 text-center text-[9px] font-black sm:text-[11px]"
                          style={{ color: posterTheme.accent }}
                        >
                          SHARING
                        </th>

                        <th
                          className="px-1 py-3 text-center text-[9px] font-black sm:text-[11px]"
                          style={{ color: posterTheme.accent }}
                        >
                          QUAD
                        </th>

                        <th
                          className="px-1 py-3 text-center text-[9px] font-black sm:text-[11px]"
                          style={{ color: posterTheme.accent }}
                        >
                          TRIPLE
                        </th>

                        <th
                          className="px-1 py-3 text-center text-[9px] font-black sm:text-[11px]"
                          style={{ color: posterTheme.accent }}
                        >
                          DOUBLE
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {shownPoster.packages.map((pkg, index) => (
                        <Fragment key={pkg.id}>
                          {/* PACKAGE HEADING */}

                          <tr>
                            <td
                              colSpan={6}
                              className="border-t px-3 py-2 text-left"
                              style={{
                                background: posterTheme.light,
                                borderColor: posterTheme.border,
                              }}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p
                                  className="text-[10px] font-black uppercase sm:text-xs"
                                  style={{ color: posterTheme.primary }}
                                >
                                  {pkg.name || `PACKAGE ${index + 1}`}
                                </p>

                                <p
                                  className="text-[9px] font-black sm:text-[10px]"
                                  style={{ color: posterTheme.secondary }}
                                >
                                  {pkg.nights ? `${pkg.nights} NIGHTS` : ""}
                                </p>
                              </div>
                            </td>
                          </tr>

                          {/* HOTEL AND RATE DATA */}

                          <tr className="bg-white">
                            {/* MAKKAH HOTEL */}

                            <td
                              className="border-t border-slate-200 px-2 py-3 align-top"
                              style={{ background: "#FFF5E5" }}
                            >
                              <p
                                className="hotel-name"
                                style={{ color: "#87450F" }}
                              >
                                {pkg.makkahHotel || "Hotel not added"}
                              </p>

                              <p className="mt-1 text-[10px] font-black text-slate-700 sm:text-xs">
                                {pkg.makkahCategory}
                              </p>

                              {pkg.makkahDistance && (
                                <span
                                  className="mt-1 inline-block rounded-md px-1.5 py-1 text-[9px] font-black sm:text-[11px]"
                                  style={{
                                    background: "#F3DDB7",
                                    color: "#70400F",
                                  }}
                                >
                                  {pkg.makkahDistance}
                                </span>
                              )}
                            </td>

                            {/* MADINAH HOTEL */}

                            <td
                              className="border-t border-slate-200 px-2 py-3 align-top"
                              style={{ background: "#EAF7EF" }}
                            >
                              <p
                                className="hotel-name"
                                style={{ color: "#086341" }}
                              >
                                {pkg.madinahHotel || "Hotel not added"}
                              </p>

                              <p className="mt-1 text-[10px] font-black text-slate-700 sm:text-xs">
                                {pkg.madinahCategory}
                              </p>

                              {pkg.madinahDistance && (
                                <span
                                  className="mt-1 inline-block rounded-md px-1.5 py-1 text-[9px] font-black sm:text-[11px]"
                                  style={{
                                    background: "#CDEBD9",
                                    color: "#07543F",
                                  }}
                                >
                                  {pkg.madinahDistance}
                                </span>
                              )}
                            </td>

                            {/* SHARING RATE */}

                            <td
                              className="border-t border-slate-200 px-1 py-3 text-center align-middle"
                              style={{
                                background: "#FFFCF3",
                                color: "#704713",
                              }}
                            >
                              <span className="rate-value">
                                {pkg.sharing ? money(pkg.sharing) : "—"}
                              </span>
                            </td>

                            {/* QUAD RATE */}

                            <td
                              className="border-t border-slate-200 px-1 py-3 text-center align-middle"
                              style={{
                                background: "#FFFCF3",
                                color: "#704713",
                              }}
                            >
                              <span className="rate-value">
                                {pkg.quad ? money(pkg.quad) : "—"}
                              </span>
                            </td>

                            {/* TRIPLE RATE */}

                            <td
                              className="border-t border-slate-200 px-1 py-3 text-center align-middle"
                              style={{
                                background: "#FFFCF3",
                                color: "#704713",
                              }}
                            >
                              <span className="rate-value">
                                {pkg.triple ? money(pkg.triple) : "—"}
                              </span>
                            </td>

                            {/* DOUBLE RATE */}

                            <td
                              className="border-t border-slate-200 px-1 py-3 text-center align-middle"
                              style={{
                                background: "#FFFCF3",
                                color: "#704713",
                              }}
                            >
                              <span className="rate-value">
                                {pkg.double ? money(pkg.double) : "—"}
                              </span>
                            </td>
                          </tr>
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* POSTER FOOTER */}

                <div
                  className="mt-4 rounded-xl border px-3 py-3"
                  style={{
                    background: posterTheme.light,
                    borderColor: posterTheme.border,
                  }}
                >
                  <p
                    className="text-center text-[10px] font-bold leading-relaxed sm:text-xs"
                    style={{ color: posterTheme.text }}
                  >
                    ✦ Per person price includes visa, return ticket,
                    accommodation & transport
                    {shownPoster.packages[0]?.nights
                      ? ` • ${shownPoster.packages[0].nights} days`
                      : ""}
                  </p>
                </div>

                {shownPoster.services.trim() && (
                  <p
                    className="mt-3 text-center text-[9px] font-black leading-relaxed sm:text-xs"
                    style={{ color: posterTheme.text }}
                  >
                    {shownPoster.services}
                  </p>
                )}

                <div
                  className="mt-3 border-t pt-2 text-center"
                  style={{ borderColor: posterTheme.border }}
                >
                  <p
                    className="text-[9px] font-black tracking-widest sm:text-[10px]"
                    style={{ color: posterTheme.text }}
                  >
                    HARAM JUNOON TRAVELS & TOURS
                  </p>

                  <p className="mt-1 text-[8px] font-semibold text-slate-500">
                    YOUR JOURNEY, OUR CARE
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-500">
            Saved posters isi browser mein store hote hain. Browser data
            clear karne se pehle Download Backup use karein.
          </p>
        </section>
      </div>

      {/* WEBSITE FOOTER */}

      <footer className="border-t-4 border-[#d6ad62] bg-gradient-to-r from-[#101f35] via-[#17395e] to-[#244c75] px-4 py-7 text-center text-white shadow-inner">
        <p className="text-sm font-black tracking-widest text-[#e3bd72]">
          HARAM JUNOON TRAVELS & TOURS
        </p>

        <div className="mx-auto my-4 h-px max-w-xs bg-[#d6ad62]/60" />

        <p className="text-xs font-bold tracking-widest text-white/80">
          SYSTEM DESIGNED & DEVELOPED BY
        </p>

        <h2 className="mt-2 text-xl font-black tracking-wider text-[#e3bd72]">
          AMEER HAMZA
        </h2>

        <p className="mt-3 text-[11px] text-white/60">
          © 2026 All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}
