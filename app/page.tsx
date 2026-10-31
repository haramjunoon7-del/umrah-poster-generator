"use client";

import { useEffect, useRef, useState } from "react";
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

type ThemeDetails = {
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
};

const STORAGE_KEY = "haram-junoon-saved-posters-v1";

const themes: Record<PosterTheme, ThemeDetails> = {
  royal: {
    name: "Royal Blue",
    description: "Royal Blue & Champagne Gold",
    primary: "#102B4E",
    secondary: "#245681",
    accent: "#E6BD70",
    light: "#F0F5FA",
    text: "#102B4E",
    border: "#D8C18F",
    headerOverlay: "rgba(8, 25, 45, 0.78)",
    gradient: "linear-gradient(135deg, #102B4E, #245681)",
  },
  emerald: {
    name: "Emerald Green",
    description: "Emerald Green & Gold",
    primary: "#064E3B",
    secondary: "#08734D",
    accent: "#D6B56D",
    light: "#F0F7F2",
    text: "#064E3B",
    border: "#C7DCCB",
    headerOverlay: "rgba(4, 45, 34, 0.78)",
    gradient: "linear-gradient(135deg, #064E3B, #08734D)",
  },
  black: {
    name: "Black Gold",
    description: "Luxury Black & Gold",
    primary: "#171717",
    secondary: "#333333",
    accent: "#D6AE59",
    light: "#F7F5EF",
    text: "#191919",
    border: "#D8C18F",
    headerOverlay: "rgba(0, 0, 0, 0.82)",
    gradient: "linear-gradient(135deg, #111111, #38342B)",
  },
  cream: {
    name: "Cream Gold",
    description: "Elegant Cream & Gold",
    primary: "#6F4B22",
    secondary: "#9A713C",
    accent: "#C79A4C",
    light: "#FBF8F0",
    text: "#49351E",
    border: "#E5D4B3",
    headerOverlay: "rgba(45, 32, 18, 0.72)",
    gradient: "linear-gradient(135deg, #6F4B22, #A77C3F)",
  },
  navy: {
    name: "Midnight Navy",
    description: "Midnight Navy & Gold",
    primary: "#111C3A",
    secondary: "#263D68",
    accent: "#DDBB70",
    light: "#F3F5FA",
    text: "#111C3A",
    border: "#D5D9E3",
    headerOverlay: "rgba(8, 14, 34, 0.82)",
    gradient: "linear-gradient(135deg, #111C3A, #263D68)",
  },
  maroon: {
    name: "Royal Maroon",
    description: "Maroon & Champagne",
    primary: "#641D32",
    secondary: "#8B3048",
    accent: "#D8B778",
    light: "#FBF4F5",
    text: "#641D32",
    border: "#E4C9CE",
    headerOverlay: "rgba(55, 8, 23, 0.8)",
    gradient: "linear-gradient(135deg, #641D32, #8B3048)",
  },
  ocean: {
    name: "Ocean Blue",
    description: "Ocean Blue & Gold",
    primary: "#075985",
    secondary: "#0E7490",
    accent: "#E5BE72",
    light: "#F0F8FB",
    text: "#075985",
    border: "#C9E1E9",
    headerOverlay: "rgba(3, 45, 68, 0.78)",
    gradient: "linear-gradient(135deg, #075985, #0E7490)",
  },
  purple: {
    name: "Royal Purple",
    description: "Purple & Gold",
    primary: "#4C1D75",
    secondary: "#6B35A0",
    accent: "#D9B66F",
    light: "#F7F3FA",
    text: "#4C1D75",
    border: "#DED0EA",
    headerOverlay: "rgba(35, 12, 55, 0.8)",
    gradient: "linear-gradient(135deg, #4C1D75, #6B35A0)",
  },
  sunset: {
    name: "Sunset",
    description: "Warm Sunset & Gold",
    primary: "#873B24",
    secondary: "#B65A35",
    accent: "#E8C27A",
    light: "#FFF6EF",
    text: "#873B24",
    border: "#EBD3C2",
    headerOverlay: "rgba(70, 24, 12, 0.76)",
    gradient: "linear-gradient(135deg, #873B24, #B65A35)",
  },
  teal: {
    name: "Teal",
    description: "Teal & Champagne Gold",
    primary: "#115E59",
    secondary: "#0F766E",
    accent: "#D8B66E",
    light: "#F0F8F7",
    text: "#115E59",
    border: "#C8E0DD",
    headerOverlay: "rgba(4, 47, 45, 0.8)",
    gradient: "linear-gradient(135deg, #115E59, #0F766E)",
  },
  rose: {
    name: "Rose",
    description: "Rose & Gold",
    primary: "#8B3A62",
    secondary: "#AD527A",
    accent: "#E0BC82",
    light: "#FCF4F7",
    text: "#8B3A62",
    border: "#EBD0DD",
    headerOverlay: "rgba(65, 16, 40, 0.78)",
    gradient: "linear-gradient(135deg, #8B3A62, #AD527A)",
  },
  desert: {
    name: "Desert Sand",
    description: "Desert Sand & Gold",
    primary: "#76512D",
    secondary: "#A47742",
    accent: "#D7B36D",
    light: "#FAF6ED",
    text: "#76512D",
    border: "#E6D8BD",
    headerOverlay: "rgba(53, 34, 15, 0.76)",
    gradient: "linear-gradient(135deg, #76512D, #A47742)",
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
    name: `Package No. ${number}`,
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

function money(value: string | number) {
  const number = Number(String(value).replace(/,/g, ""));
  if (!Number.isFinite(number)) return String(value);
  return `PKR ${number.toLocaleString("en-PK")}`;
}

function dateText(value: string) {
  if (!value) return "Date not added";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function timeText(value: string) {
  if (!value) return "Time not added";
  const [hours, minutes] = value.split(":");
  const hour = Number(hours);
  if (!Number.isFinite(hour)) return value;
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes || "00"} ${suffix}`;
}

function Field({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#C79A4C] focus:ring-2 focus:ring-[#C79A4C]/15"
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
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#C79A4C] focus:ring-2 focus:ring-[#C79A4C]/15"
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

const airlineLogos: Record<string, string> = {
  PIA: "https://www.gstatic.com/flights/airline_logos/70px/PK.png",
  "Fly Jinnah": "https://www.gstatic.com/flights/airline_logos/70px/9P.png",
  AirSial: "https://www.gstatic.com/flights/airline_logos/70px/PF.png",
  Airblue: "https://www.gstatic.com/flights/airline_logos/70px/PA.png",
  "Riyadh Air": "https://www.gstatic.com/flights/airline_logos/70px/RX.png",
  Saudia: "https://www.gstatic.com/flights/airline_logos/70px/SV.png",
  SalamAir: "https://www.gstatic.com/flights/airline_logos/70px/OV.png",
};

function AirlineLogo({ airline }: { airline: string }) {
  const [failed, setFailed] = useState(false);
  const logo = airlineLogos[airline];

  useEffect(() => {
    setFailed(false);
  }, [airline]);

  if (!logo || failed) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DCC99E] bg-white text-xs font-black text-[#79551F]">
        {airline.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={logo}
      alt={airline}
      onError={() => setFailed(true)}
      className="h-10 w-10 shrink-0 rounded-xl border border-[#E8D8B7] bg-white object-contain p-1"
    />
  );
}

export default function Home() {
  const [flight, setFlight] = useState<FlightData>(blankFlight);
  const [packages, setPackages] = useState<PackageData[]>([
    blankPackage("package-1", 1),
  ]);
  const [title, setTitle] = useState("UMRAH PACKAGE");
  const [theme, setTheme] = useState<PosterTheme>("royal");
  const [services, setServices] = useState(
    "Visa • Return Ticket • Accommodation • Transport • 21 Days",
  );
  const [savedPosters, setSavedPosters] = useState<SavedPoster[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activePoster, setActivePoster] = useState<SavedPoster | null>(null);
  const [message, setMessage] = useState("");
  const [copying, setCopying] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setSavedPosters(parsed);
      }
    } catch (error) {
      console.error("Saved poster loading error:", error);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPosters));
  }, [savedPosters, hydrated]);

  function updateFlight(key: keyof FlightData, value: string) {
    setFlight((current) => ({ ...current, [key]: value }));
    setActivePoster(null);
  }

  function updatePackage(
    id: string,
    key: keyof PackageData,
    value: string,
  ) {
    setPackages((current) =>
      current.map((pkg) =>
        pkg.id === id ? { ...pkg, [key]: value } : pkg,
      ),
    );
    setActivePoster(null);
  }

  function addPackage() {
    setPackages((current) => [
      ...current,
      blankPackage(
        `package-${Date.now()}-${current.length}`,
        current.length + 1,
      ),
    ]);
    setActivePoster(null);
  }

  function removePackage(id: string) {
    if (packages.length <= 1) {
      setMessage("At least one package is required.");
      return;
    }
    setPackages((current) => current.filter((pkg) => pkg.id !== id));
    setActivePoster(null);
  }

  function newPoster() {
    const latest = savedPosters[0];

    if (latest) {
      setTitle(latest.title);
      setTheme(latest.theme);
      setFlight({ ...latest.flight });
      setPackages(
        latest.packages.map((pkg, index) => ({
          ...pkg,
          id: `package-${Date.now()}-${index}`,
        })),
      );
      setServices(latest.services);
    } else {
      setTitle("UMRAH PACKAGE");
      setTheme("royal");
      setFlight({ ...blankFlight });
      setPackages([blankPackage(`package-${Date.now()}`, 1)]);
      setServices(
        "Visa • Return Ticket • Accommodation • Transport • 21 Days",
      );
    }

    setEditingId(null);
    setActivePoster(null);
    setMessage("New poster form is ready.");
  }

  function savePoster() {
    if (!title.trim()) {
      setMessage("Please enter poster title.");
      return;
    }

    if (packages.length === 0) {
      setMessage("Please add at least one package.");
      return;
    }

    const poster: SavedPoster = {
      id: editingId || `poster-${Date.now()}`,
      title: title.trim(),
      theme,
      flight: { ...flight },
      packages: packages.map((pkg) => ({ ...pkg })),
      services,
      createdAt: new Date().toISOString(),
    };

    setSavedPosters((current) => {
      if (editingId) {
        return current.map((item) =>
          item.id === editingId ? poster : item,
        );
      }
      return [poster, ...current];
    });

    setEditingId(poster.id);
    setActivePoster(poster);
    setMessage(
      editingId ? "Poster updated successfully." : "Poster saved successfully.",
    );
  }

  function editPoster(poster: SavedPoster) {
    setTitle(poster.title);
    setTheme(poster.theme);
    setFlight({ ...poster.flight });
    setPackages(
      poster.packages.map((pkg, index) => ({
        ...pkg,
        id: `package-${Date.now()}-${index}`,
      })),
    );
    setServices(poster.services);
    setEditingId(poster.id);
    setActivePoster(poster);
    setMessage("Poster loaded for editing.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showPoster(poster: SavedPoster) {
    setTitle(poster.title);
    setTheme(poster.theme);
    setFlight({ ...poster.flight });
    setPackages(
      poster.packages.map((pkg, index) => ({
        ...pkg,
        id: `package-${Date.now()}-${index}`,
      })),
    );
    setServices(poster.services);
    setEditingId(poster.id);
    setActivePoster(poster);
    setMessage("Saved poster preview loaded.");
  }

  function deletePoster(id: string) {
    if (!window.confirm("Are you sure you want to delete this poster?")) {
      return;
    }

    setSavedPosters((current) => current.filter((poster) => poster.id !== id));

    if (editingId === id) {
      setEditingId(null);
      setActivePoster(null);
    }

    setMessage("Poster deleted.");
  }

  async function copyPosterImage() {
    const target = posterRef.current;
    if (!target) {
      setMessage("Poster preview is not ready.");
      return;
    }

    setCopying(true);
    setMessage("");

    try {
      const blob = await toBlob(target, {
        pixelRatio: 2,
        backgroundColor: "#f7f7f3",
        cacheBust: true,
        width: target.scrollWidth,
        height: target.scrollHeight,
        style: {
          width: `${target.scrollWidth}px`,
          maxWidth: "none",
          height: "auto",
          overflow: "visible",
        },
      });

      if (!blob) throw new Error("Could not create poster image.");

      if (
        navigator.clipboard &&
        typeof ClipboardItem !== "undefined" &&
        window.isSecureContext
      ) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setMessage("Poster image copied. Paste it in WhatsApp.");
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${title || "umrah-poster"}.png`;
        link.click();
        URL.revokeObjectURL(url);
        setMessage("Poster image downloaded.");
      }
    } catch (error) {
      console.error("Poster copy error:", error);
      setMessage(
        "Image copy failed. Please use localhost or HTTPS and try again.",
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
    link.download = "haram-junoon-posters-backup.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  const shownPoster: SavedPoster = activePoster
    ? {
        ...activePoster,
        title,
        theme,
        flight,
        packages,
        services,
      }
    : {
        id: "preview",
        title,
        theme,
        flight,
        packages,
        services,
        createdAt: new Date().toISOString(),
      };

  const posterTheme = themes[shownPoster.theme] || themes.royal;
  const routeText = `${flight.origin || "Origin"} → ${flight.destination || "Destination"}`;

  return (
    <main className="min-h-screen bg-[#F4F5F7] text-slate-800">
      <header className="border-b border-[#D8C18F] bg-[#171A16] px-4 py-5 text-white shadow-lg sm:px-8">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#D9B66F]">
              Haram Junoon Travels & Tours
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-wide sm:text-3xl">
              Umrah Poster Generator
            </h1>
            <p className="mt-1 text-xs text-white/60">
              Create, save and manage professional Umrah package posters
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={newPoster}
              className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              + New Poster
            </button>
            <button
              onClick={exportSavedData}
              className="rounded-xl bg-[#C79A4C] px-4 py-2.5 text-sm font-black text-[#20170B] transition hover:bg-[#E0B967]"
            >
              Export Backup
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-6 p-4 lg:grid-cols-[440px_minmax(0,1fr)] lg:p-6">
        <section className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800">
                Poster Details
              </h2>
              {editingId && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                  Editing saved poster
                </span>
              )}
            </div>

            <div className="space-y-4">
              <Field
                label="Poster Title"
                value={title}
                onChange={(value) => {
                  setTitle(value);
                  setActivePoster(null);
                }}
                placeholder="Enter poster title"
              />

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                  Poster Theme
                </span>
                <select
                  value={theme}
                  onChange={(event) => {
                    setTheme(event.target.value as PosterTheme);
                    setActivePoster(null);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#C79A4C]"
                >
                  {themeOptions.map((key) => (
                    <option key={key} value={key}>
                      {themes[key].name} — {themes[key].description}
                    </option>
                  ))}
                </select>
              </label>

              <Field
                label="Services"
                value={services}
                onChange={(value) => {
                  setServices(value);
                  setActivePoster(null);
                }}
                placeholder="Visa • Ticket • Hotel • Transport"
              />

              <div className="grid grid-cols-3 gap-2">
                {themeOptions.map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setTheme(key);
                      setActivePoster(null);
                    }}
                    className={`rounded-xl border p-2 text-left transition ${
                      theme === key
                        ? "border-[#C79A4C] bg-[#FBF5E9] ring-2 ring-[#C79A4C]/20"
                        : "border-slate-200 hover:border-[#C79A4C]"
                    }`}
                  >
                    <span
                      className="mb-1 block h-5 rounded-md"
                      style={{ background: themes[key].gradient }}
                    />
                    <span className="text-[10px] font-bold text-slate-700">
                      {themes[key].name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800">
                Flight Details
              </h2>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                Shared flight
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <SelectField
                label="Airline"
                value={flight.airline}
                onChange={(value) => updateFlight("airline", value)}
                options={[
                  "Airblue",
                  "PIA",
                  "Fly Jinnah",
                  "AirSial",
                  "Riyadh Air",
                  "Saudia",
                  "SalamAir",
                ]}
              />
              <Field
                label="Flight Number"
                value={flight.flightNumber}
                onChange={(value) => updateFlight("flightNumber", value)}
                placeholder="PA-123"
              />
              <Field
                label="Origin"
                value={flight.origin}
                onChange={(value) => updateFlight("origin", value)}
                placeholder="Multan"
              />
              <Field
                label="Destination"
                value={flight.destination}
                onChange={(value) => updateFlight("destination", value)}
                placeholder="Jeddah"
              />
              <Field
                label="Departure Date"
                type="date"
                value={flight.departureDate}
                onChange={(value) => updateFlight("departureDate", value)}
              />
              <Field
                label="Departure Time"
                type="time"
                value={flight.departureTime}
                onChange={(value) => updateFlight("departureTime", value)}
              />
              <Field
                label="Return Date"
                type="date"
                value={flight.returnDate}
                onChange={(value) => updateFlight("returnDate", value)}
              />
              <Field
                label="Return Flight"
                value={flight.returnFlight}
                onChange={(value) => updateFlight("returnFlight", value)}
                placeholder="Return flight number"
              />
              <Field
                label="Return Time"
                type="time"
                value={flight.returnTime}
                onChange={(value) => updateFlight("returnTime", value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-800">
                  Package Details
                </h2>
                <p className="text-xs text-slate-500">
                  Add multiple hotel and rate options
                </p>
              </div>
              <button
                onClick={addPackage}
                className="rounded-xl bg-gradient-to-r from-[#9A6B2C] to-[#D4AD63] px-4 py-2.5 text-sm font-black text-white shadow-md transition hover:brightness-105"
              >
                + Add New Package
              </button>
            </div>

            {packages.map((pkg, index) => (
              <div
                key={pkg.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-black text-[#8A642E]">
                    Package {index + 1}
                  </h3>
                  <button
                    onClick={() => removePackage(pkg.id)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field
                    label="Package Name / Code"
                    value={pkg.name}
                    onChange={(value) =>
                      updatePackage(pkg.id, "name", value)
                    }
                    placeholder="Package No. 1"
                  />
                  <Field
                    label="Total Nights"
                    value={pkg.nights}
                    onChange={(value) =>
                      updatePackage(pkg.id, "nights", value)
                    }
                    placeholder="21"
                  />
                </div>

                <div className="my-5 border-t border-dashed border-slate-200" />

                <div className="mb-3 flex items-center gap-2">
                  <span className="text-lg">🕋</span>
                  <h4 className="font-black text-[#8A4B12]">
                    Makkah Hotel
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field
                    label="Hotel Name"
                    value={pkg.makkahHotel}
                    onChange={(value) =>
                      updatePackage(pkg.id, "makkahHotel", value)
                    }
                    placeholder="Makkah hotel name"
                  />
                  <SelectField
                    label="Hotel Category"
                    value={pkg.makkahCategory}
                    onChange={(value) =>
                      updatePackage(pkg.id, "makkahCategory", value)
                    }
                    options={[
                      "Economy",
                      "3 Star",
                      "4 Star",
                      "5 Star",
                    ]}
                  />
                  <Field
                    label="Distance from Haram"
                    value={pkg.makkahDistance}
                    onChange={(value) =>
                      updatePackage(pkg.id, "makkahDistance", value)
                    }
                    placeholder="500 Meter"
                  />
                </div>

                <div className="my-5 border-t border-dashed border-slate-200" />

                <div className="mb-3 flex items-center gap-2">
                  <span className="text-lg">🕌</span>
                  <h4 className="font-black text-[#08734D]">
                    Madinah Hotel
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field
                    label="Hotel Name"
                    value={pkg.madinahHotel}
                    onChange={(value) =>
                      updatePackage(pkg.id, "madinahHotel", value)
                    }
                    placeholder="Madinah hotel name"
                  />
                  <SelectField
                    label="Hotel Category"
                    value={pkg.madinahCategory}
                    onChange={(value) =>
                      updatePackage(pkg.id, "madinahCategory", value)
                    }
                    options={[
                      "Economy",
                      "3 Star",
                      "4 Star",
                      "5 Star",
                    ]}
                  />
                  <Field
                    label="Distance from Masjid Nabawi"
                    value={pkg.madinahDistance}
                    onChange={(value) =>
                      updatePackage(pkg.id, "madinahDistance", value)
                    }
                    placeholder="800 Meter"
                  />
                </div>

                <div className="my-5 border-t border-dashed border-slate-200" />

                <h4 className="mb-3 font-black text-slate-800">
                  Package Rates (PKR)
                </h4>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Field
                    label="Sharing"
                    value={pkg.sharing}
                    onChange={(value) =>
                      updatePackage(pkg.id, "sharing", value)
                    }
                    placeholder="226299"
                  />
                  <Field
                    label="Quad"
                    value={pkg.quad}
                    onChange={(value) =>
                      updatePackage(pkg.id, "quad", value)
                    }
                    placeholder="230899"
                  />
                  <Field
                    label="Triple"
                    value={pkg.triple}
                    onChange={(value) =>
                      updatePackage(pkg.id, "triple", value)
                    }
                    placeholder="238399"
                  />
                  <Field
                    label="Double"
                    value={pkg.double}
                    onChange={(value) =>
                      updatePackage(pkg.id, "double", value)
                    }
                    placeholder="253499"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="sticky bottom-3 z-20 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={savePoster}
                className="rounded-xl bg-[#173E30] px-4 py-3 text-sm font-black text-white transition hover:bg-[#20543F]"
              >
                {editingId ? "Update Poster" : "Save Poster"}
              </button>
              <button
                onClick={copyPosterImage}
                disabled={copying}
                className="rounded-xl bg-gradient-to-r from-[#A87935] to-[#D5B16B] px-4 py-3 text-sm font-black text-white transition hover:brightness-105 disabled:opacity-60"
              >
                {copying ? "Preparing Image..." : "Copy Poster Image"}
              </button>
            </div>
            {message && (
              <p className="mt-2 text-center text-xs font-semibold text-slate-600">
                {message}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-black text-slate-800">
                  Saved Posters
                </h2>
                <p className="text-xs text-slate-500">
                  {savedPosters.length} saved poster(s)
                </p>
              </div>
              <button
                onClick={exportSavedData}
                className="text-xs font-bold text-[#936A2E] underline"
              >
                Download Backup
              </button>
            </div>

            {!savedPosters.length ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                No saved posters yet.
              </div>
            ) : (
              <div className="space-y-3">
                {savedPosters.map((poster) => (
                  <div
                    key={poster.id}
                    className="rounded-xl border border-slate-200 p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-black text-slate-800">
                          {poster.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {poster.packages.length} package(s) •{" "}
                          {new Date(poster.createdAt).toLocaleDateString(
                            "en-GB",
                          )}
                        </p>
                      </div>
                      <span className="rounded-full bg-[#F8F0E1] px-2.5 py-1 text-[10px] font-bold text-[#87612B]">
                        {themes[poster.theme]?.name || "Royal Blue"}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => showPoster(poster)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => editPoster(poster)}
                        className="rounded-lg border border-[#D8BD8A] px-3 py-1.5 text-xs font-bold text-[#805B25] hover:bg-[#FBF5E9]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePoster(poster.id)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-black text-slate-800">
                Live Poster Preview
              </h2>
              <p className="text-xs text-slate-500">
                This is the image that will be copied or downloaded
              </p>
            </div>
            <button
              onClick={copyPosterImage}
              disabled={copying}
              className="rounded-xl bg-[#173E30] px-4 py-2.5 text-sm font-black text-white shadow transition hover:bg-[#20543F] disabled:opacity-60"
            >
              {copying ? "Preparing..." : "Copy Image"}
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-lg sm:p-4">
            <div
              ref={posterRef}
              className="mx-auto w-full min-w-[760px] overflow-hidden bg-[#F7F7F3]"
              style={{
                color: posterTheme.text,
                border: `1px solid ${posterTheme.border}`,
                fontFamily: "Arial, Helvetica, sans-serif",
              }}
            >
              <div
                className="relative overflow-hidden px-8 py-8 text-center text-white"
                style={{
                  backgroundImage: `linear-gradient(${posterTheme.headerOverlay}, ${posterTheme.headerOverlay}), url('https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1800&q=85')`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              >
                <div className="relative z-10">
                  <img
                    src="/haram-junoon-logo.png"
                    alt="Haram Junoon Travels & Tours"
                    className="mx-auto mb-3 h-16 w-16 rounded-full border-2 border-[#D9B66F] bg-white object-contain p-1"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                  <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#E8C981]">
                    HARAM JUNOON TRAVELS & TOURS
                  </p>
                  <h1 className="mt-2 text-4xl font-black uppercase tracking-wide text-white">
                    {shownPoster.title || "UMRAH PACKAGE"}
                  </h1>
                  <div
                    className="mx-auto mt-3 h-1 w-24 rounded-full"
                    style={{ background: posterTheme.accent }}
                  />
                  <p className="mt-3 text-sm font-semibold tracking-wide text-white/90">
                    YOUR JOURNEY, OUR CARE
                  </p>
                  <p className="mt-3 text-xs font-semibold text-white/85">
                    {shownPoster.services}
                  </p>
                </div>
              </div>

              <div className="px-5 py-5">
                <div
                  className="mb-4 rounded-xl p-4"
                  style={{
                    background: "#FFFFFF",
                    border: `1px solid ${posterTheme.border}`,
                  }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h2
                      className="text-sm font-black uppercase tracking-wider"
                      style={{ color: posterTheme.primary }}
                    >
                      Flight Details
                    </h2>
                    <span className="text-[10px] font-bold text-slate-500">
                      SHARED FLIGHT
                    </span>
                  </div>

                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <div className="flex items-center gap-3">
                      <AirlineLogo airline={flight.airline} />
                      <div>
                        <p className="text-sm font-black text-slate-800">
                          {flight.airline || "Airline"}
                        </p>
                        <p className="text-xs font-semibold text-slate-500">
                          {flight.flightNumber || "Flight number"}
                        </p>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-base font-black text-slate-800">
                        {routeText}
                      </p>
                      <p className="mt-1 text-[10px] font-semibold text-slate-500">
                        OUTBOUND JOURNEY
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-700">
                        {dateText(flight.departureDate)}
                      </p>
                      <p className="text-xs font-semibold text-slate-500">
                        {timeText(flight.departureTime)}
                      </p>
                    </div>
                  </div>

                  {(flight.returnDate ||
                    flight.returnFlight ||
                    flight.returnTime) && (
                    <div className="mt-3 border-t border-dashed border-slate-200 pt-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                            Return Journey
                          </p>
                          <p className="text-sm font-black text-slate-800">
                            {flight.destination || "Destination"} →{" "}
                            {flight.origin || "Origin"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-700">
                            {flight.returnFlight || "Return flight"}
                          </p>
                          <p className="text-xs font-semibold text-slate-500">
                            {dateText(flight.returnDate)} •{" "}
                            {timeText(flight.returnTime)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-3 flex items-center justify-between">
                  <h2
                    className="text-base font-black uppercase tracking-wider"
                    style={{ color: posterTheme.primary }}
                  >
                    Available Umrah Packages
                  </h2>
                  <span
                    className="rounded-full px-3 py-1 text-[10px] font-black"
                    style={{
                      color: posterTheme.primary,
                      background: `${posterTheme.accent}35`,
                    }}
                  >
                    {packages.length} PACKAGES
                  </span>
                </div>

                {/* HOTEL AND RATES TABLE - REFERENCE IMAGE LAYOUT */}
                <div
                  className="overflow-hidden rounded-lg"
                  style={{
                    border: "1px solid #E8D8B7",
                    background: "#FFFFFF",
                  }}
                >
                  <div
                    className="grid grid-cols-[14%_25%_25%_9%_9%_9%_9%] items-center gap-0 border-b px-2 py-3"
                    style={{
                      background: "#F7F3E9",
                      borderColor: "#E8D8B7",
                    }}
                  >
                    {[
                      "Package",
                      "Makkah Hotel",
                      "Madinah Hotel",
                      "Sharing",
                      "Quad",
                      "Triple",
                      "Double",
                    ].map((heading) => (
                      <div
                        key={heading}
                        className="px-1 text-center text-[10px] font-black text-[#173E30] sm:text-[11px]"
                      >
                        {heading}
                      </div>
                    ))}
                  </div>

                  {packages.map((pkg, index) => (
                    <div key={pkg.id}>
                      <div
                        className="grid grid-cols-[14%_25%_25%_9%_9%_9%_9%] items-center gap-0 px-2 py-3"
                        style={{
                          background: "#FFFFFF",
                          borderBottom: "1px dashed #E8D8B7",
                        }}
                      >
                        <div className="px-1">
                          <p className="break-words text-[10px] font-black text-[#174B38] sm:text-[11px]">
                            {pkg.name || `UP-${110175 + index}`}
                          </p>
                          <p className="mt-1 text-[9px] font-medium text-slate-500">
                            🕋 Makkah: {pkg.nights || "—"} Nights
                          </p>
                          <p className="text-[9px] font-medium text-slate-500">
                            🕌 Madinah: {pkg.nights || "—"} Nights
                          </p>
                          <p className="text-[9px] font-black text-[#C79A4C]">
                            Total: {pkg.nights || "—"} Nights
                          </p>
                        </div>

                        <div className="flex min-w-0 items-start gap-2 px-1">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#E8D8B7] bg-[#FBF8F0] text-sm shadow-sm">
                            🕋
                          </div>
                          <div className="min-w-0">
                            <p
                              className="break-words text-[10px] font-semibold leading-snug sm:text-[11px]"
                              style={{ color: "#174B38" }}
                            >
                              {(pkg.makkahHotel || "HOTEL NOT ADDED").toUpperCase()}
                            </p>
                            <p className="mt-1 break-words text-[9px] font-medium leading-snug text-slate-500">
                              {pkg.makkahDistance
                                ? `${pkg.makkahDistance} FROM HARAM`
                                : pkg.makkahCategory || "Makkah Hotel"}
                            </p>
                            <p className="mt-1 text-[8px] font-semibold text-slate-400">
                              {pkg.makkahCategory}
                            </p>
                          </div>
                        </div>

                        <div className="flex min-w-0 items-start gap-2 px-1">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#E8D8B7] bg-[#FBF8F0] text-sm shadow-sm">
                            🕌
                          </div>
                          <div className="min-w-0">
                            <p
                              className="break-words text-[10px] font-semibold leading-snug sm:text-[11px]"
                              style={{ color: "#174B38" }}
                            >
                              {(pkg.madinahHotel || "HOTEL NOT ADDED").toUpperCase()}
                            </p>
                            <p className="mt-1 break-words text-[9px] font-medium leading-snug text-slate-500">
                              {pkg.madinahDistance
                                ? `${pkg.madinahDistance} FROM MASJID NABAWI`
                                : pkg.madinahCategory || "Madinah Hotel"}
                            </p>
                            <p className="mt-1 text-[8px] font-semibold text-slate-400">
                              {pkg.madinahCategory}
                            </p>
                          </div>
                        </div>

                        {[pkg.sharing, pkg.quad, pkg.triple, pkg.double].map(
                          (rate, rateIndex) => (
                            <div
                              key={`${pkg.id}-rate-${rateIndex}`}
                              className="px-0.5 text-center"
                            >
                              <span className="break-words text-[10px] font-bold leading-tight tabular-nums text-[#174B38] sm:text-[11px]">
                                {rate ? money(rate) : "—"}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-5 rounded-xl px-4 py-3 text-center"
                  style={{
                    background: posterTheme.gradient,
                    color: "#FFFFFF",
                  }}
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
                    Contact Us For Booking & Details
                  </p>
                  <p className="mt-1 text-lg font-black tracking-wide">
                    03137183111 • 03216837494 • 03128992016
                  </p>
                  <p className="mt-1 text-xs font-semibold text-white/85">
                    haramjunoontravels@gmail.com
                  </p>
                </div>

                <div className="mt-4 border-t pt-3 text-center" style={{ borderColor: posterTheme.border }}>
                  <p className="text-[9px] font-semibold tracking-wide text-slate-500">
                    SYSTEM DESIGNED & DEVELOPED BY AMEER HAMZA
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}