
"use client";

import { useEffect, useRef, useState } from "react";
import { toBlob } from "html-to-image";
import { supabase } from "./lib/supabase";

type PosterTheme =
  | "royal" | "emerald" | "black" | "cream"
  | "navy" | "maroon" | "ocean" | "purple"
  | "sunset" | "teal" | "rose" | "desert";

type FlightData = {
  airline: string;
  returnAirline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  returnDate: string;
  returnFlight: string;
  returnTime: string;
  seatsAvailable?: string;
};

type PosterDesign = "classic" | "schedule" | "offer" | "airlineTable";

type FlightSchedule = {
  id: string;
  departureDate: string;
  departureTime: string;
  returnDate: string;
  returnTime: string;
};

function blankSchedule(id: string): FlightSchedule {
  return { id, departureDate: "", departureTime: "", returnDate: "", returnTime: "" };
}

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
  design?: PosterDesign;
  schedules?: FlightSchedule[];
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
  "royal", "emerald", "black", "cream",
  "navy", "maroon", "ocean", "purple",
  "sunset", "teal", "rose", "desert",
];

const airlineOptions = [
  "Airblue",
  "PIA",
  "Fly Jinnah",
  "AirSial",
  "Riyadh Air",
  "Saudia",
  "SalamAir",
];

// Local airline logos: images must be inside public/airlines/
const airlineLogos: Record<string, string> = {
  PIA: "/airlines/pia.png",
  Airblue: "/airlines/airblue.png",
  AirSial: "/airlines/airsial.png",
  "Fly Jinnah": "/airlines/fly-jinnah.png",
  "Riyadh Air": "/airlines/riyadh-air.png",
  Saudia: "/airlines/saudia.png",
  SalamAir: "/airlines/salam-air.png",
};

const blankFlight: FlightData = {
  airline: "Airblue",
  returnAirline: "Airblue",
  flightNumber: "",
  origin: "Multan",
  destination: "Jeddah",
  departureDate: "",
  departureTime: "",
  returnDate: "",
  returnFlight: "",
  returnTime: "",
  seatsAvailable: "",
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

function AirlineLogo({ airline, compact = false }: { airline: string; compact?: boolean }) {
  const [failed, setFailed] = useState(false);
  const logo = airlineLogos[airline];

  if (!logo || failed) {
    return (
      <div className={`flex shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-1 text-center font-black text-slate-700 ${compact ? "h-8 w-12 text-[8px]" : "h-14 w-20 text-xs"}`}>
        {airline || "AIRLINE"}
      </div>
    );
  }

  return (
    <img
      src={logo}
      alt={`${airline} logo`}
      crossOrigin="anonymous"
      className={`shrink-0 rounded-lg border border-slate-200 bg-white p-1 object-contain shadow-sm ${compact ? "h-8 w-12" : "h-14 w-20"}`}
      onError={() => setFailed(true)}
    />
  );
}

// Same itinerary layout for outbound and return
function FlightItineraryRow({
  label,
  airline,
  flightNumber,
  origin,
  destination,
  date,
  time,
  accent,
}: {
  label: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  accent: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_1.15fr_100px] items-center gap-3">
      {/* LEFT: FLIGHT NUMBER + DATE/TIME */}
      <div className="min-w-0">
        <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-black text-slate-800">
          {flightNumber || "Flight number"}
        </p>
        <p className="mt-1 text-[10px] font-semibold text-slate-500">
          {dateText(date)}
        </p>
        <p className="text-[10px] font-semibold text-slate-500">
          {timeText(time)}
        </p>
      </div>

      {/* MIDDLE: SECTOR */}
      <div className="min-w-0 text-center">
        <p className="break-words text-base font-black text-slate-800">
          {origin || "Origin"} → {destination || "Destination"}
        </p>
        <div
          className="mx-auto mt-2 h-0.5 w-16 rounded-full"
          style={{ background: accent }}
        />
        <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-slate-500">
          Sector
        </p>
      </div>

      {/* RIGHT: SELECTED AIRLINE LOGO */}
      <div className="flex min-w-0 flex-col items-end justify-center">
        <AirlineLogo airline={airline} />
        <p className="mt-1 max-w-full text-right text-[9px] font-bold text-slate-500">
          {airline}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [flight, setFlight] = useState<FlightData>(blankFlight);

  const [packages, setPackages] = useState<PackageData[]>([
    blankPackage("package-1", 1),
  ]);

  const [title, setTitle] = useState("UMRAH PACKAGE");
  const [theme, setTheme] = useState<PosterTheme>("emerald");
  const [posterDesign, setPosterDesign] = useState<PosterDesign>("classic");
  const [schedules, setSchedules] = useState<FlightSchedule[]>([blankSchedule("schedule-1")]);

  const [services, setServices] = useState(
    "Visa • Return Ticket • Accommodation • Transport • 21 Days",
  );

  const [savedPosters, setSavedPosters] = useState<SavedPoster[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activePoster, setActivePoster] = useState<SavedPoster | null>(null);
  const [message, setMessage] = useState("");
  const [copying, setCopying] = useState(false);
  const [authUser, setAuthUser] = useState<{ id: string; email?: string } | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authPassword, setAuthPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authMessage, setAuthMessage] = useState("");

  const posterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const user = data.session?.user;
      setAuthUser(user ? { id: user.id, email: user.email || undefined } : null);
      setAuthReady(true);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      setAuthUser(user ? { id: user.id, email: user.email || undefined } : null);
      setAuthReady(true);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authReady) return;
    if (!authUser) {
      setMessage("Sign in to load your shared cloud posters.");
      return;
    }

    let cancelled = false;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const normalizePosters = (items: SavedPoster[]): SavedPoster[] =>
      items.map((poster: SavedPoster): SavedPoster => ({
        ...poster,
        design:
          poster.design === "airlineTable"
            ? "airlineTable"
            : poster.design === "offer"
              ? "offer"
              : poster.design === "schedule"
                ? "schedule"
                : "classic",
        schedules:
          Array.isArray(poster.schedules) && poster.schedules.length
            ? poster.schedules.map((item, index) => ({
                ...blankSchedule(`legacy-${index}`),
                ...item,
              }))
            : [blankSchedule("schedule-legacy")],
        flight: {
          ...blankFlight,
          ...(poster.flight || {}),
          returnAirline:
            poster.flight?.returnAirline || poster.flight?.airline || "Airblue",
        },
        packages: Array.isArray(poster.packages) ? poster.packages : [],
      }));

    const loadCloudPosters = async () => {
      const { data: sessionResult, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionResult.session) {
        if (!cancelled) {
          setMessage("Please sign in to sync posters across devices.");
        }
        return;
      }

      const { data, error } = await supabase
        .from("umrah_poster_cloud")
        .select("id, poster_data, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Cloud poster loading error:", error);
        if (!cancelled) {
          setMessage("Cloud sync failed. Please create the Supabase table and check your connection.");
        }
        return;
      }

      const cloudPosters = normalizePosters(
        (data || []).map((row: { poster_data: SavedPoster }) => row.poster_data),
      );

      if (cloudPosters.length === 0) {
        let localPosters: SavedPoster[] = [];
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          const parsed = raw ? JSON.parse(raw) : [];
          if (Array.isArray(parsed)) localPosters = normalizePosters(parsed);
        } catch (storageError) {
          console.error("Local poster migration error:", storageError);
        }

        if (localPosters.length > 0) {
          const rows = localPosters.map((poster) => ({
            id: poster.id,
            poster_data: poster,
            created_at: poster.createdAt || new Date().toISOString(),
          }));
          const { error: migrationError } = await supabase
            .from("umrah_poster_cloud")
            .upsert(rows, { onConflict: "id" });

          if (migrationError) {
            console.error("Poster migration error:", migrationError);
            if (!cancelled) setMessage("Old posters loaded locally, but cloud migration failed.");
          } else if (!cancelled) {
            setSavedPosters(localPosters);
            setMessage("Previous saved posters migrated to cloud successfully.");
          }
        } else if (!cancelled) {
          setSavedPosters([]);
        }
      } else if (!cancelled) {
        setSavedPosters(cloudPosters);
      }


      channel = supabase
        .channel("umrah-poster-cloud-live-sync")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "umrah_poster_cloud" },
          async () => {
            const { data: refreshed, error: refreshError } = await supabase
              .from("umrah_poster_cloud")
              .select("id, poster_data, created_at")
              .order("created_at", { ascending: false });

            if (!refreshError && !cancelled && refreshed) {
              setSavedPosters(
                normalizePosters(
                  refreshed.map((row: { poster_data: SavedPoster }) => row.poster_data),
                ),
              );
            }
          },
        )
        .subscribe();
    };

    void loadCloudPosters();

    return () => {
      cancelled = true;
      if (channel) void supabase.removeChannel(channel);
    };
  }, [authReady, authUser?.id]);

  async function handleAuth() {
    const loginEmail = process.env.NEXT_PUBLIC_SUPABASE_LOGIN_EMAIL?.trim();

    if (!loginEmail) {
      setAuthMessage("Login setup missing. .env.local mein NEXT_PUBLIC_SUPABASE_LOGIN_EMAIL set karein.");
      return;
    }

    if (!authPassword) {
      setAuthMessage("Password enter karein.");
      return;
    }

    setAuthBusy(true);
    setAuthMessage("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: authPassword,
      });
      if (error) throw error;
      setAuthPassword("");
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "Incorrect password. Dobara try karein.");
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) setMessage(error.message);
    else {
      setEditingId(null);
      setActivePoster(null);
      setMessage("Signed out.");
    }
  }

  function updateFlight(key: keyof FlightData, value: string) {
    setFlight((current) => ({
      ...current,
      [key]: value,
    }));
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
    const currentHasPackageData = packages.some((pkg) =>
      Boolean(
        pkg.makkahHotel || pkg.madinahHotel || pkg.makkahDistance ||
        pkg.madinahDistance || pkg.sharing || pkg.quad || pkg.triple || pkg.double
      ),
    );
    const currentHasFlightData = Boolean(
      flight.flightNumber || flight.returnFlight || flight.departureDate ||
      flight.returnDate || flight.departureTime || flight.returnTime
    );
    const source: SavedPoster | null =
      (currentHasPackageData || currentHasFlightData) ? {
        id: "current-copy",
        title,
        theme,
        design: posterDesign,
        schedules,
        flight,
        packages,
        services,
        createdAt: new Date().toISOString(),
      } : (activePoster || (editingId ? savedPosters.find((item) => item.id === editingId) : null) || savedPosters[0] || null);

    if (source) {
      setTitle(source.title);
      setTheme(source.theme);
      setPosterDesign(source.design === "airlineTable" ? "airlineTable" : source.design === "offer" ? "offer" : source.design === "schedule" ? "schedule" : "classic");
      setSchedules(
        (source.schedules?.length ? source.schedules : [blankSchedule(`schedule-${Date.now()}`)])
          .map((item, index) => ({ ...blankSchedule(`schedule-${Date.now()}-${index}`), ...item })),
      );
      setFlight({ ...blankFlight, ...source.flight });
      setPackages(
        source.packages.map((pkg, index) => ({
          ...pkg,
          id: `package-${Date.now()}-${index}`,
        })),
      );
      setServices(source.services);
    } else {
      setTitle("UMRAH PACKAGE");
      setTheme("emerald");
      setPosterDesign("classic");
      setSchedules([blankSchedule(`schedule-${Date.now()}`)]);
      setFlight({ ...blankFlight });
      setPackages([blankPackage(`package-${Date.now()}`, 1)]);
      setServices("Visa • Return Ticket • Accommodation • Transport • 21 Days");
    }

    setEditingId(null);
    setActivePoster(null);
    setMessage(source
      ? `New poster ready with all ${source.packages.length} previous package(s). Save it as a new poster.`
      : "New poster form is ready.");
  }

  async function savePoster() {
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
      design: posterDesign,
      schedules: schedules.map((item) => ({ ...item })),
      flight: { ...flight },
      packages: packages.map((pkg) => ({ ...pkg })),
      services,
      createdAt: new Date().toISOString(),
    };

    setMessage("Saving poster to cloud...");

    const { data: sessionResult, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionResult.session) {
      setMessage("Please sign in first. Cloud saving requires an authenticated Supabase session.");
      return;
    }

    const { error } = await supabase
      .from("umrah_poster_cloud")
      .upsert(
        { id: poster.id, poster_data: poster, created_at: poster.createdAt },
        { onConflict: "id" },
      );

    if (error) {
      console.error("Cloud poster save error:", error);
      setMessage(`Cloud save failed: ${error.message}`);
      return;
    }

    setSavedPosters((current) => {
      const withoutCurrent = current.filter((item) => item.id !== poster.id);
      return [poster, ...withoutCurrent];
    });

    setEditingId(poster.id);
    setActivePoster(poster);
    setMessage(editingId
      ? "Poster updated in cloud. It will appear on all devices."
      : "Poster saved to cloud. It will appear on all devices.");
  }

  function editPoster(poster: SavedPoster) {
    setTitle(poster.title);
    setTheme(poster.theme);
    setPosterDesign(poster.design === "airlineTable" ? "airlineTable" : poster.design === "offer" ? "offer" : poster.design === "schedule" ? "schedule" : "classic");
    setSchedules((poster.schedules?.length ? poster.schedules : [blankSchedule(`schedule-${Date.now()}`)]).map((item, index) => ({ ...blankSchedule(`schedule-${Date.now()}-${index}`), ...item })));
    setFlight({ ...blankFlight, ...poster.flight });

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
    setPosterDesign(poster.design === "airlineTable" ? "airlineTable" : poster.design === "offer" ? "offer" : poster.design === "schedule" ? "schedule" : "classic");
    setSchedules((poster.schedules?.length ? poster.schedules : [blankSchedule(`schedule-${Date.now()}`)]).map((item, index) => ({ ...blankSchedule(`schedule-${Date.now()}-${index}`), ...item })));
    setFlight({ ...blankFlight, ...poster.flight });

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

  async function deletePoster(id: string) {
    if (!window.confirm("Are you sure you want to delete this poster from all devices?")) {
      return;
    }

    const { error } = await supabase
      .from("umrah_poster_cloud")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Cloud poster delete error:", error);
      setMessage(`Could not delete from cloud: ${error.message}`);
      return;
    }

    setSavedPosters((current) => current.filter((poster) => poster.id !== id));

    if (editingId === id) {
      setEditingId(null);
      setActivePoster(null);
    }

    setMessage("Poster deleted from cloud and all devices.");
  }

  async function copyPosterImage() {
    const target = posterRef.current;

    if (!target) {
      setMessage("Poster preview is not ready.");
      return;
    }

    setCopying(true);
    setMessage("");

    const options = {
      pixelRatio: 2,
      backgroundColor: "#F7F7F3",
      cacheBust: true,
      width: target.scrollWidth,
      height: target.scrollHeight,
      style: {
        width: `${target.scrollWidth}px`,
        maxWidth: "none",
        height: "auto",
        overflow: "visible",
      },
    };

    function downloadImage(blob: Blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${title || "umrah-poster"}.png`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => URL.revokeObjectURL(url), 3000);
    }

    try {
      await document.fonts.ready;

      if (
        navigator.clipboard &&
        typeof ClipboardItem !== "undefined" &&
        window.isSecureContext
      ) {
        const imagePromise = toBlob(target, options).then((blob) => {
          if (!blob) {
            throw new Error("Poster image could not be generated.");
          }
          return blob;
        });

        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": imagePromise }),
        ]);

        setMessage("Poster copied successfully! Now paste it into WhatsApp.");
      } else {
        const blob = await toBlob(target, options);

        if (!blob) {
          throw new Error("Poster image could not be generated.");
        }

        downloadImage(blob);
        setMessage("Clipboard unavailable. Poster downloaded instead.");
      }
    } catch (error) {
      console.error("Poster copy error:", error);

      try {
        const blob = await toBlob(target, options);

        if (!blob) {
          throw new Error("Poster image could not be generated.");
        }

        downloadImage(blob);
        setMessage("Copy unavailable. Poster downloaded successfully.");
      } catch (downloadError) {
        console.error("Poster download error:", downloadError);
        setMessage(
          "Image failed. Please check browser permissions and image loading.",
        );
      }
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

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  const shownPoster: SavedPoster = activePoster
    ? {
        ...activePoster,
        title,
        theme,
        design: posterDesign,
        schedules,
        flight,
        packages,
        services,
      }
    : {
        id: "preview",
        title,
        theme,
        design: posterDesign,
        schedules,
        flight,
        packages,
        services,
        createdAt: "",
      };

  const posterTheme = themes[shownPoster.theme] || themes.royal;

  const startingPrice = shownPoster.packages
    .flatMap((pkg) => [pkg.sharing, pkg.quad, pkg.triple, pkg.double])
    .map((rate) => {
      const value = Number(String(rate || "").replace(/[^\\d.]/g, ""));
      return Number.isFinite(value) && value > 0 ? value : null;
    })
    .filter((rate): rate is number => rate !== null)
    .reduce<number | null>(
      (lowest, rate) => lowest === null ? rate : Math.min(lowest, rate),
      null,
    );

  const outboundSectorOrigin = flight.origin || "Origin";
  const outboundSectorDestination = flight.destination || "Destination";

  const returnSectorOrigin = flight.destination || "Destination";
  const returnSectorDestination = flight.origin || "Origin";

  if (!authReady || !authUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F5F2] px-4 py-10">
        <div className="w-full max-w-md rounded-3xl border border-[#D8C18F] bg-white p-7 shadow-2xl">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#123B2E] text-2xl text-[#E6BD70]">✦</div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#A87935]">Haram Junoon Travels & Tours</p>
            <h1 className="mt-2 text-2xl font-black text-slate-800">Umrah Poster Generator</h1>
            <p className="mt-2 text-sm text-slate-500">Sign in to access shared posters on all your devices.</p>
          </div>

          {!authReady ? (
            <p className="py-5 text-center text-sm font-semibold text-slate-500">Checking account...</p>
          ) : (
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase text-slate-600">Access Password</span>
                <input type="password" autoComplete="current-password" value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void handleAuth(); }} className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#C79A4C]" placeholder="Enter your password" />
              </label>
              <button onClick={() => void handleAuth()} disabled={authBusy || !authPassword} className="w-full rounded-xl bg-[#123B2E] px-4 py-3 font-black text-white hover:bg-[#1B5942] disabled:opacity-60">
                {authBusy ? "Please wait..." : "Unlock Poster Generator"}
              </button>
              {authMessage && <p className="rounded-xl bg-amber-50 p-3 text-center text-xs font-semibold text-amber-800">{authMessage}</p>}
              {message && <p className="text-center text-xs text-slate-500">{message}</p>}
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F5F7] text-slate-800" style={{ backgroundImage: "radial-gradient(circle at 8% 8%, rgba(214,181,109,0.10), transparent 26%), radial-gradient(circle at 92% 22%, rgba(6,78,59,0.07), transparent 28%), linear-gradient(135deg, #F7F8F6 0%, #F2F4F1 100%)" }}>
      <header className="relative overflow-hidden border-b border-[#D8C18F] bg-[#123B2E] px-4 py-5 text-white shadow-xl sm:px-8" style={{ backgroundImage: "linear-gradient(115deg, #092D22 0%, #14543D 55%, #0B382B 100%)" }}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent 0 20px, rgba(230,189,112,.55) 21px 22px, transparent 23px 42px), repeating-linear-gradient(-45deg, transparent 0 20px, rgba(230,189,112,.3) 21px 22px, transparent 23px 42px)", backgroundSize: "42px 42px" }} />
        <div className="relative z-10 mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4">
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
              onClick={() => void handleSignOut()}
              className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Sign Out
            </button>
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

      <div className="mx-auto max-w-[1500px] px-4 pt-5 lg:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs font-black uppercase tracking-wider text-slate-500">Choose Poster Design</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <button type="button" onClick={() => { setPosterDesign("classic"); setActivePoster(null); }} className={`rounded-xl border-2 p-4 text-left transition ${posterDesign === "classic" ? "border-[#C79A4C] bg-[#FBF5E9]" : "border-slate-200 hover:border-slate-300"}`}>
              <span className="block text-sm font-black text-slate-800">Previous Poster Design</span>
              <span className="mt-1 block text-xs text-slate-500">Existing layout — unchanged</span>
            </button>
            <button type="button" onClick={() => { setPosterDesign("schedule"); setActivePoster(null); }} className={`rounded-xl border-2 p-4 text-left transition ${posterDesign === "schedule" ? "border-blue-700 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
              <span className="block text-sm font-black text-slate-800">New Flight Schedule Design</span>
              <span className="mt-1 block text-xs text-slate-500">Multiple departure & return dates</span>
            </button>
            <button type="button" onClick={() => { setPosterDesign("offer"); setActivePoster(null); }} className={`rounded-xl border-2 p-4 text-left transition ${posterDesign === "offer" ? "border-amber-500 bg-amber-50" : "border-slate-200 hover:border-amber-300"}`}>
              <span className="block text-sm font-black text-slate-800">🎉 Bumper Offer Design</span>
              <span className="mt-1 block text-xs text-slate-500">Premium promotional look with gold offer highlights</span>
            </button>
            <button type="button" onClick={() => { setPosterDesign("airlineTable"); setActivePoster(null); }} className={`rounded-xl border-2 p-4 text-left transition ${posterDesign === "airlineTable" ? "border-[#1976C2] bg-[#EAF4FC]" : "border-slate-200 hover:border-[#1976C2]"}`}>
              <span className="block text-sm font-black text-slate-800">✈ Airline & Package Table</span>
              <span className="mt-1 block text-xs text-slate-500">Reference image jaisa flight summary aur hotel-rate table</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-6 p-4 lg:grid-cols-[440px_minmax(0,1fr)] lg:p-6">
        <section className="space-y-5">
          {/* POSTER DETAILS */}
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

          {/* FLIGHT DETAILS FORM */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800">
                Flight Details
              </h2>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                Shared flight
              </span>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 p-3">
                <h3 className="mb-3 text-sm font-black text-slate-800">
                  Outbound Flight
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <SelectField
                    label="Outbound Airline"
                    value={flight.airline}
                    onChange={(value) => updateFlight("airline", value)}
                    options={airlineOptions}
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
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-3">
                <h3 className="mb-3 text-sm font-black text-slate-800">
                  Return Journey
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <SelectField
                    label="Return Airline"
                    value={flight.returnAirline || flight.airline}
                    onChange={(value) => updateFlight("returnAirline", value)}
                    options={airlineOptions}
                  />
                  <Field
                    label="Return Flight Number"
                    value={flight.returnFlight}
                    onChange={(value) => updateFlight("returnFlight", value)}
                    placeholder="PA-124"
                  />
                  <Field
                    label="Return Date"
                    type="date"
                    value={flight.returnDate}
                    onChange={(value) => updateFlight("returnDate", value)}
                  />
                  <Field
                    label="Return Time"
                    type="time"
                    value={flight.returnTime}
                    onChange={(value) => updateFlight("returnTime", value)}
                  />
                  <Field
                    label="Available Seats"
                    type="number"
                    value={flight.seatsAvailable || ""}
                    onChange={(value) => updateFlight("seatsAvailable", value)}
                    placeholder="e.g. 10"
                  />
                </div>
              </div>
            </div>
          </div>

          {posterDesign === "schedule" && (
            <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-black text-slate-800">Multiple Flight Schedules</h2>
                  <p className="text-xs text-slate-500">Har row mein departure aur return ki dates aur timings add karein.</p>
                </div>
                <button type="button" onClick={() => setSchedules((current) => [...current, blankSchedule(`schedule-${Date.now()}-${current.length}`)])} className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-black text-white hover:bg-blue-800">+ Add Schedule</button>
              </div>
              <div className="space-y-3">
                {schedules.map((item, index) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-black text-slate-800">Schedule {index + 1}</h3>
                      <button type="button" disabled={schedules.length === 1} onClick={() => setSchedules((current) => current.filter((row) => row.id !== item.id))} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 disabled:opacity-40">Remove</button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Field label="Departure Date" type="date" value={item.departureDate} onChange={(value) => setSchedules((current) => current.map((row) => row.id === item.id ? { ...row, departureDate: value } : row))} />
                      <Field label="Departure Time" type="time" value={item.departureTime} onChange={(value) => setSchedules((current) => current.map((row) => row.id === item.id ? { ...row, departureTime: value } : row))} />
                      <Field label="Return Date" type="date" value={item.returnDate} onChange={(value) => setSchedules((current) => current.map((row) => row.id === item.id ? { ...row, returnDate: value } : row))} />
                      <Field label="Return Time" type="time" value={item.returnTime} onChange={(value) => setSchedules((current) => current.map((row) => row.id === item.id ? { ...row, returnTime: value } : row))} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Departure Flight Number" value={flight.flightNumber} onChange={(value) => updateFlight("flightNumber", value)} placeholder="PA 872" />
                <Field label="Return Flight Number" value={flight.returnFlight} onChange={(value) => updateFlight("returnFlight", value)} placeholder="PA 873" />
              </div>
            </div>
          )}

          {/* PACKAGE FORM */}
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
                    onChange={(value) => updatePackage(pkg.id, "name", value)}
                    placeholder="Package No. 1"
                  />
                  <Field
                    label="Total Nights"
                    value={pkg.nights}
                    onChange={(value) => updatePackage(pkg.id, "nights", value)}
                    placeholder="21"
                  />
                </div>

                <div className="my-5 border-t border-dashed border-slate-200" />

                <div className="mb-3 flex items-center gap-2">
                  <span className="text-lg">🕋</span>
                  <h4 className="font-black text-[#8A4B12]">Makkah Hotel</h4>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field
                    label="Hotel Name"
                    value={pkg.makkahHotel}
                    onChange={(value) => updatePackage(pkg.id, "makkahHotel", value)}
                    placeholder="Makkah hotel name"
                  />
                  <SelectField
                    label="Hotel Category"
                    value={pkg.makkahCategory}
                    onChange={(value) => updatePackage(pkg.id, "makkahCategory", value)}
                    options={["Economy", "3 Star", "4 Star", "5 Star"]}
                  />
                  <Field
                    label="Distance from Haram"
                    value={pkg.makkahDistance}
                    onChange={(value) => updatePackage(pkg.id, "makkahDistance", value)}
                    placeholder="500 Meter"
                  />
                </div>

                <div className="my-5 border-t border-dashed border-slate-200" />

                <div className="mb-3 flex items-center gap-2">
                  <span className="text-lg">🕌</span>
                  <h4 className="font-black text-[#08734D]">Madinah Hotel</h4>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field
                    label="Hotel Name"
                    value={pkg.madinahHotel}
                    onChange={(value) => updatePackage(pkg.id, "madinahHotel", value)}
                    placeholder="Madinah hotel name"
                  />
                  <SelectField
                    label="Hotel Category"
                    value={pkg.madinahCategory}
                    onChange={(value) => updatePackage(pkg.id, "madinahCategory", value)}
                    options={["Economy", "3 Star", "4 Star", "5 Star"]}
                  />
                  <Field
                    label="Distance from Masjid Nabawi"
                    value={pkg.madinahDistance}
                    onChange={(value) => updatePackage(pkg.id, "madinahDistance", value)}
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
                    onChange={(value) => updatePackage(pkg.id, "sharing", value)}
                    placeholder="226299"
                  />
                  <Field
                    label="Quad"
                    value={pkg.quad}
                    onChange={(value) => updatePackage(pkg.id, "quad", value)}
                    placeholder="230899"
                  />
                  <Field
                    label="Triple"
                    value={pkg.triple}
                    onChange={(value) => updatePackage(pkg.id, "triple", value)}
                    placeholder="238399"
                  />
                  <Field
                    label="Double"
                    value={pkg.double}
                    onChange={(value) => updatePackage(pkg.id, "double", value)}
                    placeholder="253499"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* SAVE AND COPY BUTTONS */}
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

          {/* SAVED POSTERS */}
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
                          {poster.createdAt
                            ? new Date(poster.createdAt).toLocaleDateString("en-GB")
                            : "Date unavailable"}
                        </p>
                      </div>
                      <span className="rounded-full bg-[#F8F0E1] px-2.5 py-1 text-[10px] font-bold text-[#87612B]">
                        {poster.design === "airlineTable" ? "Airline & Package Table" : poster.design === "offer" ? "Bumper Offer" : poster.design === "schedule" ? "Flight Schedule" : (themes[poster.theme]?.name || "Royal Blue")}
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

        {/* LIVE POSTER PREVIEW */}
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

          {posterDesign === "airlineTable" ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-lg sm:p-4">
              <div ref={posterRef} className="mx-auto min-w-[1180px] overflow-hidden rounded-xl border border-[#A9C4D9] bg-white font-sans text-[#23445F] shadow-sm" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
                <div className="flex h-[54px] items-center justify-between gap-4 border-b border-[#D5E3EE] bg-[#F5FAFE] px-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <AirlineLogo airline={flight.airline} compact />
                    <strong className="whitespace-nowrap text-[17px] font-black tracking-wide">{(flight.origin || "LAHORE").toUpperCase()} → {(flight.destination || "JEDDAH").toUpperCase()} → {(flight.origin || "LAHORE").toUpperCase()}</strong>
                    <span className="whitespace-nowrap rounded-md border border-[#B8D7F1] bg-[#EAF4FC] px-3 py-2 text-[11px] font-bold uppercase text-[#2674B7]">▦ DEPARTURE&nbsp; {dateText(flight.departureDate).toUpperCase()}</span>
                  </div>
                  <span className="whitespace-nowrap rounded-md bg-[#1674BC] px-3 py-2 text-[11px] font-black text-white">♙ {flight.seatsAvailable ? `${flight.seatsAvailable} SEATS AVAILABLE` : "SEATS: CONTACT US"}</span>
                </div>
                <div className="grid grid-cols-[1fr_1fr_205px] border-b border-[#D8E5EF]">
                  <div className="border-r border-[#D8E5EF] px-4 py-3">
                    <div className="mb-2 flex items-center justify-between text-[11px] font-black tracking-wider text-[#3984BD]"><span>OUTBOUND</span><span>{flight.flightNumber || "FLIGHT NO."}</span></div>
                    <div className="flex items-center justify-between gap-3">
                      <div><p className="text-[16px] font-black">{(flight.origin || "ORIGIN").toUpperCase()}</p><p className="text-[11px] text-slate-500">{timeText(flight.departureTime)}</p><p className="mt-1 text-[11px] font-bold text-slate-500">{dateText(flight.departureDate).toUpperCase()}</p></div>
                      <div className="flex min-w-0 flex-1 items-center gap-1 text-[#2479BC]"><span className="h-px flex-1 border-t border-dashed border-[#91B7D5]"/><span className="text-lg">✈</span><span className="h-px flex-1 border-t border-dashed border-[#91B7D5]"/></div>
                      <div className="text-right"><p className="text-[16px] font-black">{(flight.destination || "DESTINATION").toUpperCase()}</p><p className="text-[11px] text-slate-500">{flight.airline || "AIRLINE"}</p></div>
                    </div>
                  </div>
                  <div className="border-r border-[#D8E5EF] px-4 py-3">
                    <div className="mb-2 flex items-center justify-between text-[11px] font-black tracking-wider text-[#3984BD]"><span>INBOUND</span><span>{flight.returnFlight || "FLIGHT NO."}</span></div>
                    <div className="flex items-center justify-between gap-3">
                      <div><p className="text-[16px] font-black">{(flight.destination || "DESTINATION").toUpperCase()}</p><p className="text-[11px] text-slate-500">{timeText(flight.returnTime)}</p><p className="mt-1 text-[11px] font-bold text-slate-500">{dateText(flight.returnDate).toUpperCase()}</p></div>
                      <div className="flex min-w-0 flex-1 items-center gap-1 text-[#2479BC]"><span className="h-px flex-1 border-t border-dashed border-[#91B7D5]"/><span className="text-lg">✈</span><span className="h-px flex-1 border-t border-dashed border-[#91B7D5]"/></div>
                      <div className="text-right"><p className="text-[16px] font-black">{(flight.origin || "ORIGIN").toUpperCase()}</p><p className="text-[11px] text-slate-500">{flight.returnAirline || flight.airline}</p></div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center bg-[#F8FBFE] px-4 py-3">
                    <span className="text-[10px] font-bold tracking-wider text-slate-500">STARTING FROM</span>
                    <strong className="mt-1 whitespace-nowrap text-[25px] font-black leading-none text-[#1674BC]">{startingPrice !== null ? money(startingPrice) : "CONTACT FOR PRICE"}</strong>
                    <span className="mt-2 text-[10px] font-bold text-slate-500">PER PERSON · SHARING</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-7 gap-y-2 border-b border-[#D8E5EF] px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-[#6B8296]">
                  <span>PACKAGE DURATION&nbsp; <b className="text-[#315B7C]">{packages[0]?.nights || "—"} NIGHTS</b></span>
                  <span>FLIGHT&nbsp; <b className="text-[#315B7C]">{flight.airline || "—"}</b></span>
                  <span>SERVICES&nbsp; <b className="text-[#315B7C]">{services || "CONTACT FOR DETAILS"}</b></span>
                </div>
                <div className="flex items-center justify-between bg-[#F5F9FC] px-4 py-2.5">
                  <div className="flex items-center gap-2"><h2 className="text-[15px] font-black uppercase tracking-wide text-[#294C68]">AVAILABLE PACKAGES</h2><span className="rounded bg-[#E2EEF7] px-2 py-0.5 text-[11px] font-black text-[#2876B2]">{packages.length}</span></div>
                  <span className="text-[10px] font-black tracking-widest text-[#3984BD]">CHOOSE YOUR STAY</span>
                </div>
                <div className="grid grid-cols-[25%_25%_12.5%_12.5%_12.5%_12.5%] items-center border-b border-[#D8E5EF] bg-[#EAF2F8] px-3 py-2 text-[10px] font-black uppercase text-[#71889B]">
                  {["MAKKAH HOTEL", "MADINAH HOTEL", "SHARING", "QUAD", "TRIPLE", "DOUBLE"].map((heading) => <div key={heading} className="px-2">{heading}</div>)}
                </div>
                {packages.map((pkg, index) => (
                  <div key={pkg.id} className="grid min-h-[64px] grid-cols-[25%_25%_12.5%_12.5%_12.5%_12.5%] items-center border-b border-[#DCE7EF] bg-white px-3 py-2 last:border-b-0">
                    <div className="min-w-0 px-2"><p className="break-words text-[11px] font-black leading-snug text-[#315B7C]">{(pkg.makkahHotel || `MAKKAH HOTEL ${index + 1}`).toUpperCase()}</p><p className="mt-1 text-[10px] font-medium text-slate-500">{pkg.makkahDistance ? `${pkg.makkahDistance} FROM HARAM` : `${pkg.nights || "—"} NIGHTS`}</p></div>
                    <div className="min-w-0 px-2"><p className="break-words text-[11px] font-black leading-snug text-[#315B7C]">{(pkg.madinahHotel || `MADINAH HOTEL ${index + 1}`).toUpperCase()}</p><p className="mt-1 text-[10px] font-medium text-slate-500">{pkg.madinahDistance ? `${pkg.madinahDistance} FROM MASJID NABAWI` : `${pkg.nights || "—"} NIGHTS`}</p></div>
                    {[pkg.sharing, pkg.quad, pkg.triple, pkg.double].map((rate, rateIndex) => <div key={`${pkg.id}-airline-rate-${rateIndex}`} className="border-l border-[#E7EEF4] px-1 text-center"><p className="text-[12px] font-black text-[#315B7C]">{rate ? money(rate).replace("PKR ", "") : "—"}</p><span className="mt-1 inline-block rounded bg-[#1674BC] px-2.5 py-1 text-[9px] font-black text-white">{rate ? "PER PERSON" : "ASK RATE"}</span></div>)}
                  </div>
                ))}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#D8E5EF] bg-[#F5F9FC] px-4 py-3"><span className="text-[10px] font-bold uppercase tracking-wider text-[#71889B]">HARAM JUNOON TRAVELS & TOURS · YOUR JOURNEY, OUR CARE</span><span className="text-[11px] font-black text-[#315B7C]">03137183111 · 03216837494 · 03128992016</span></div>
              </div>
            </div>
          ) : posterDesign !== "schedule" ? (
            <>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-lg sm:p-4">
            <div
              ref={posterRef}
              className={`mx-auto w-full min-w-[760px] overflow-hidden ${posterDesign === "offer" ? "bg-[#FFF9EA]" : "bg-[#F7F7F3]"}`}
              style={{
                color: posterTheme.text,
                border: posterDesign === "offer" ? "3px solid #D5A63C" : `1px solid ${posterTheme.border}`,
                boxShadow: posterDesign === "offer" ? "0 20px 48px rgba(120,35,25,.24)" : `0 18px 42px ${posterTheme.primary}22`,
                fontFamily: "Arial, Helvetica, sans-serif",
              }}
            >
              {/* POSTER HEADER */}
              <div
                className="relative overflow-hidden px-8 py-8 text-center text-white"
                style={{
                  backgroundImage: posterDesign === "offer"
                    ? "linear-gradient(125deg, rgba(8,55,39,.96) 0%, rgba(17,93,61,.88) 48%, rgba(126,31,25,.91) 100%), url('https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1800&q=85')"
                    : `linear-gradient(125deg, ${posterTheme.primary}F2 0%, ${posterTheme.primary}C8 48%, ${posterTheme.secondary}D9 100%), url('https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1800&q=85')`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  boxShadow: posterDesign === "offer" ? "inset 0 -10px 30px rgba(245,190,75,.35)" : `inset 0 -8px 24px ${posterTheme.primary}55`,
                }}
              >
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.16]" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent 0 18px, rgba(238,211,151,.55) 19px 20px, transparent 21px 39px), repeating-linear-gradient(-45deg, transparent 0 18px, rgba(238,211,151,.35) 19px 20px, transparent 21px 39px)", backgroundSize: "40px 40px" }} />
                <div aria-hidden="true" className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.12)]" />
                <div aria-hidden="true" className="pointer-events-none absolute -right-16 -bottom-24 h-64 w-64 rounded-full border border-[#E6BD70]/35 shadow-[0_0_55px_rgba(230,189,112,0.18)]" />
                <div className="relative z-10">
                  {posterDesign === "offer" && (
                    <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border-2 border-[#FFE6A1] bg-gradient-to-r from-[#8E211D] via-[#C23B24] to-[#8E211D] px-7 py-2.5 text-sm font-black uppercase tracking-[0.2em] text-[#FFF4CC] shadow-[0_7px_22px_rgba(0,0,0,.35)]">
                      <span aria-hidden="true">✦</span> BUMPER OFFER <span aria-hidden="true">✦</span>
                    </div>
                  )}
                  <img
                    src="/haram-junoon-logo.png"
                    alt="Haram Junoon Travels & Tours"
                    crossOrigin="anonymous"
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
                    {posterDesign === "offer" ? "SPECIAL UMRAH DEAL • BOOK YOUR JOURNEY TODAY" : "YOUR JOURNEY, OUR CARE"}
                  </p>
                  <p className="mt-3 text-xs font-semibold text-white/85">
                    {shownPoster.services}
                  </p>
                </div>
              </div>
              <div className="relative flex h-3 items-center justify-center" style={{ background: posterDesign === "offer" ? "linear-gradient(90deg, #8E211D, #E5B94D, #0D593B, #E5B94D, #8E211D)" : `linear-gradient(90deg, ${posterTheme.primary}, ${posterTheme.secondary}, ${posterTheme.primary})` }}>
                <span className="h-2 w-2 rotate-45 border border-[#F3D99D] bg-[#D6B56D] shadow-sm" />
                <span className="absolute left-1/2 top-1/2 h-px w-24 -translate-x-1/2 -translate-y-1/2" style={{ background: `${posterTheme.accent}99` }} />
              </div>

              <div className="px-5 py-5" style={{ background: `linear-gradient(145deg, #FFFFFF 0%, ${posterTheme.light} 52%, #FFFFFF 100%)` }}>
                {/* FLIGHT DETAILS */}
                <div
                  className="relative mb-4 overflow-hidden rounded-xl p-4"
                  style={{
                    background: `linear-gradient(135deg, #FFFFFF 0%, ${posterTheme.light} 100%)`,
                    border: `1px solid ${posterTheme.border}`,
                    boxShadow: `0 8px 22px ${posterTheme.primary}14, inset 0 1px 0 #FFFFFF`,
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

                  {/* OUTBOUND: NUMBER LEFT, SECTOR MIDDLE, LOGO RIGHT */}
                  <FlightItineraryRow
                    label="Outbound Journey"
                    airline={flight.airline}
                    flightNumber={flight.flightNumber}
                    origin={outboundSectorOrigin}
                    destination={outboundSectorDestination}
                    date={flight.departureDate}
                    time={flight.departureTime}
                    accent={posterTheme.accent}
                  />

                  {/* RETURN: SAME LAYOUT */}
                  <div className="my-3 border-t border-dashed border-slate-200" />

                  <FlightItineraryRow
                    label="Return Journey"
                    airline={flight.returnAirline || flight.airline}
                    flightNumber={flight.returnFlight}
                    origin={returnSectorOrigin}
                    destination={returnSectorDestination}
                    date={flight.returnDate}
                    time={flight.returnTime}
                    accent={posterTheme.accent}
                  />
                  <div
                    className="mt-3 flex items-center justify-between rounded-lg px-3 py-2"
                    style={{
                      background: `${posterTheme.accent}20`,
                      border: `1px solid ${posterTheme.border}`,
                    }}
                  >
                    <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: posterTheme.primary }}>
                      Package Starting From
                    </span>
                    <span className="text-sm font-black tabular-nums" style={{ color: posterTheme.primary }}>
                      {startingPrice !== null ? money(startingPrice) : "Contact For Price"}
                    </span>
                  </div>
                </div>

                {/* AVAILABLE PACKAGES */}
                <div className="mb-3 flex items-center justify-between">
                  <h2
                    className="text-base font-black uppercase tracking-wider"
                    style={{ color: posterTheme.primary }}
                  >
                    {posterDesign === "offer" ? "Bumper Offer Packages" : "Available Umrah Packages"}
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

                {/* HOTEL AND RATES TABLE */}
                <div
                  className="overflow-hidden rounded-lg"
                  style={{
                    border: "1px solid #E8D8B7",
                    background: "#FFFFFF",
                    fontFamily: "Arial, Helvetica, sans-serif",
                  }}
                >
                  <div
                    className="grid grid-cols-[14%_25%_25%_9%_9%_9%_9%] items-center gap-0 px-2 py-2.5"
                    style={{
                      background: `linear-gradient(90deg, ${posterTheme.light}, ${posterTheme.accent}35, ${posterTheme.light})`,
                      borderBottom: `1px solid ${posterTheme.border}`,
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
                        className="px-1 text-center text-[10px] font-bold text-[#173E30]"
                      >
                        {heading}
                      </div>
                    ))}
                  </div>

                  {packages.map((pkg, index) => (
                    <div
                      key={pkg.id}
                      className="grid grid-cols-[14%_25%_25%_9%_9%_9%_9%] items-center gap-0 px-2 py-2.5"
                      style={{
                        background: index % 2 === 0 ? "#FFFFFF" : posterTheme.light,
                        borderBottom: `1px dashed ${posterTheme.border}`,
                      }}
                    >
                      <div className="min-w-0 px-1">
                        <p className="break-words text-[10px] font-bold leading-tight text-[#174B38]">
                          {pkg.name || `UP-${110175 + index}`}
                        </p>
                        <p className="mt-2 rounded-md bg-[#F2E7D0] px-2 py-1 text-[9px] font-black text-[#8B642D]">
                          TOTAL: {pkg.nights || "—"} NIGHTS
                        </p>
                      </div>

                      <div className="flex min-w-0 items-start gap-1.5 px-1">
                        <div
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[12px]"
                          style={{
                            border: "1px solid #E8D8B7",
                            background: "#FBF8F0",
                          }}
                        >
                          🕋
                        </div>
                        <div className="min-w-0">
                          <p className="break-words text-[10px] font-bold leading-snug text-[#174B38]">
                            {(pkg.makkahHotel || "HOTEL NOT ADDED").toUpperCase()}
                          </p>
                          <p className="mt-1 break-words text-[9px] font-normal leading-snug text-[#777777]">
                            {pkg.makkahDistance
                              ? `${pkg.makkahDistance} ${
                                  pkg.makkahDistance.toLowerCase().includes("meter")
                                    ? ""
                                    : "METER "
                                }FROM HARAM`
                              : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex min-w-0 items-start gap-1.5 px-1">
                        <div
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[12px]"
                          style={{
                            border: "1px solid #E8D8B7",
                            background: "#FBF8F0",
                          }}
                        >
                          🕌
                        </div>
                        <div className="min-w-0">
                          <p className="break-words text-[10px] font-bold leading-snug text-[#174B38]">
                            {(pkg.madinahHotel || "HOTEL NOT ADDED").toUpperCase()}
                          </p>
                          <p className="mt-1 break-words text-[9px] font-normal leading-snug text-[#777777]">
                            {pkg.madinahDistance
                              ? `${pkg.madinahDistance} ${
                                  pkg.madinahDistance.toLowerCase().includes("meter")
                                    ? ""
                                    : "METER "
                                }FROM MASJID NABAWI`
                              : ""}
                          </p>
                        </div>
                      </div>

                      {[pkg.sharing, pkg.quad, pkg.triple, pkg.double].map(
                        (rate, rateIndex) => (
                          <div
                            key={`${pkg.id}-rate-${rateIndex}`}
                            className="min-w-0 px-0.5 text-center"
                          >
                            <span className="break-words text-[10px] font-black leading-tight tabular-nums text-[#174B38]">
                              {rate ? money(rate) : "—"}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  ))}
                </div>

                {/* CONTACT FOOTER */}
                <div
                  className="mt-5 rounded-xl px-4 py-3 text-center"
                  style={{
                    background: posterDesign === "offer" ? "linear-gradient(115deg, #7F1D1D 0%, #0D593B 55%, #7F1D1D 100%)" : `linear-gradient(115deg, ${posterTheme.primary} 0%, ${posterTheme.secondary} 58%, ${posterTheme.primary} 100%)`,
                    color: "#FFFFFF",
                    boxShadow: posterDesign === "offer" ? "0 10px 26px rgba(127,29,29,.28), inset 0 1px 0 rgba(255,225,155,.45)" : `0 8px 22px ${posterTheme.primary}30, inset 0 1px 0 ${posterTheme.accent}66`,
                    border: posterDesign === "offer" ? "1px solid #E6BD70" : `1px solid ${posterTheme.accent}88`,
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

                <div
                  className="mt-4 border-t pt-3 text-center"
                  style={{ borderColor: posterTheme.border }}
                >
                  <p className="text-[9px] font-semibold tracking-wide text-slate-500">
                    SYSTEM DESIGNED & DEVELOPED BY AMEER HAMZA
                  </p>
                </div>
          </div>
          </div>
          </div>
            </>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-lg sm:p-4">
              <div ref={posterRef} className="mx-auto min-w-[760px] overflow-hidden" style={{ border: `1px solid ${posterTheme.border}`, boxShadow: `0 18px 42px ${posterTheme.primary}22` }}>
                <div className="bg-white" style={{ color: posterTheme.text, fontFamily: "Arial, Helvetica, sans-serif" }}>
                  <div
                    className="relative isolate min-h-[245px] overflow-hidden px-4 pb-5 pt-4 text-center text-white sm:min-h-[265px] sm:px-7"
                    style={{
                      background: `linear-gradient(125deg, ${posterTheme.primary}F2 0%, ${posterTheme.primary}C8 42%, ${posterTheme.secondary}E0 72%, ${posterTheme.primary}E8 100%)`,
                      boxShadow: `inset 0 -10px 28px ${posterTheme.primary}55`,
                    }}
                  >
                    {/* MAKKAH + MADINAH PHOTOS BLENDED INTO HEADER BACKGROUND */}
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 grid grid-cols-2">
                      <div className="relative overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1565330770968-0240c0046ce3?auto=format&fit=crop&w=1200&q=90"
                          alt=""
                          crossOrigin="anonymous"
                          loading="eager"
                          className="h-full w-full object-cover"
                          style={{ objectPosition: "center 48%" }}
                        />
                        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${posterTheme.primary}55, ${posterTheme.primary}C9 100%)` }} />
                      </div>
                      <div className="relative overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1573970647850-af23e4fa4628?auto=format&fit=crop&w=1200&q=90"
                          alt=""
                          crossOrigin="anonymous"
                          loading="eager"
                          className="h-full w-full object-cover"
                          style={{ objectPosition: "center 48%" }}
                        />
                        <div className="absolute inset-0" style={{ background: `linear-gradient(270deg, ${posterTheme.secondary}55, ${posterTheme.primary}C9 100%)` }} />
                      </div>
                    </div>
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-[0.22]" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent 0 17px, rgba(231,196,119,.5) 18px 19px, transparent 20px 36px), repeating-linear-gradient(-45deg, transparent 0 17px, rgba(231,196,119,.35) 18px 19px, transparent 20px 36px)", backgroundSize: "34px 34px" }} />
                    <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-24 -z-10 h-64 w-64 rounded-full border border-[#E6BD70]/35 shadow-[0_0_55px_rgba(230,189,112,0.16)]" />
                    <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 -z-10 h-64 w-64 rounded-full border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.12)]" />

                    <div className="relative z-10 mx-auto max-w-[690px]">
                      <div className="mb-2 flex items-center justify-center gap-3">
                        <span className="h-px w-9" style={{ background: posterTheme.accent }} />
                        <span className="rounded-full border px-3 py-1 text-[8px] font-black uppercase tracking-[0.28em] shadow" style={{ borderColor: `${posterTheme.accent}99`, color: posterTheme.accent, background: "rgba(0,0,0,.28)" }}>
                          A Blessed Journey
                        </span>
                        <span className="h-px w-9" style={{ background: posterTheme.accent }} />
                      </div>

                      <img
                        src="/haram-junoon-logo.png"
                        alt="Haram Junoon Travels & Tours"
                        crossOrigin="anonymous"
                        className="mx-auto mb-1 h-10 w-10 rounded-full border-2 bg-white object-contain p-1 shadow-xl sm:h-11 sm:w-11"
                        style={{ borderColor: posterTheme.accent }}
                        onError={(event) => { event.currentTarget.style.display = "none"; }}
                      />
                      <p className="text-[9px] font-black uppercase tracking-[0.26em]" style={{ color: posterTheme.accent }}>
                        HARAM JUNOON TRAVELS & TOURS
                      </p>
                      <h1 className="mt-1 text-2xl font-black uppercase tracking-wide text-white drop-shadow-lg sm:text-3xl">
                        {shownPoster.title || "UMRAH PACKAGE"}
                      </h1>
                      <div className="mx-auto mt-2 h-1 w-16 rounded-full" style={{ background: posterTheme.accent }} />
                      <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/90">
                        YOUR JOURNEY, OUR CARE
                      </p>
                      <p className="mt-2 text-[10px] font-semibold text-white drop-shadow sm:text-xs">
                        {shownPoster.services}
                      </p>
                      <div className="mt-3 flex items-center justify-center gap-3 text-[8px] font-black uppercase tracking-[0.18em] text-[#F4D99A] sm:text-[9px]">
                        <span>✦ MAKKAH MUKARRAMAH</span>
                        <span className="text-white/70">•</span>
                        <span>MADINAH MUNAWWARAH ✦</span>
                      </div>
                    </div>

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-1"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${posterTheme.accent}, transparent)`,
                      }}
                    />
                  </div>
                  <div className="relative h-3" style={{ background: `linear-gradient(90deg, ${posterTheme.primary}, ${posterTheme.secondary}, ${posterTheme.primary})` }}>
                    <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-[#F3D99D] bg-[#D6B56D] shadow-sm" />
                  </div>
                  <div className="p-5 sm:p-7" style={{ background: `linear-gradient(145deg, #FFFFFF 0%, ${posterTheme.light} 48%, #FFFFFF 100%)` }}>
                    <div
                      className="mb-3 overflow-hidden rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                      style={{
                        border: `1.5px solid ${posterTheme.accent}`,
                        boxShadow: `0 9px 24px ${posterTheme.primary}22, inset 0 1px 0 #FFFFFF`,
                        background: `linear-gradient(135deg, #FFFFFF 0%, ${posterTheme.light} 100%)`,
                      }}
                    >
                      {/* COMPACT FLIGHT SCHEDULE HEADER */}
                      <div
                        className="relative flex items-center gap-2 px-3 py-2 text-white"
                        style={{ background: posterTheme.gradient }}
                      >
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-lg shadow-md"
                          style={{
                            background: `${posterTheme.accent}30`,
                            border: `1px solid ${posterTheme.accent}`,
                          }}
                        >
                          ✈
                        </div>

                        <div>
                          <h2 className="text-sm font-black uppercase tracking-wider">
                            Flight Schedule
                          </h2>
                          <p className="text-[8px] font-semibold tracking-widest text-white/75">
                            DEPARTURE & RETURN DETAILS
                          </p>
                        </div>

                        <div
                          className="ml-auto rounded-full px-2 py-1 text-[8px] font-black"
                          style={{
                            background: posterTheme.accent,
                            color: posterTheme.primary,
                          }}
                        >
                          FLIGHTS
                        </div>
                      </div>

                      {/* OUTBOUND AND RETURN FLIGHT DETAILS */}
                      <div
                        className="grid grid-cols-2 text-center text-white"
                        style={{ background: posterTheme.secondary }}
                      >
                        <div className="border-r border-white/20 px-2 py-2">
                          <p className="text-[9px] font-black uppercase tracking-wide">
                            Departure ({flight.origin || "Origin"} – {flight.destination || "Destination"})
                          </p>
                          <p className="mt-0.5 text-xs font-black">
                            {flight.flightNumber || "Flight No."}
                          </p>
                          <div className="mt-1 flex items-center justify-center gap-1.5">
                            <AirlineLogo airline={flight.airline} compact />
                            <p className="text-[9px] font-semibold text-white/85">
                              {flight.airline}
                            </p>
                          </div>
                        </div>

                        <div className="px-2 py-2">
                          <p className="text-[9px] font-black uppercase tracking-wide">
                            Return ({flight.destination || "Destination"} – {flight.origin || "Origin"})
                          </p>
                          <p className="mt-0.5 text-xs font-black">
                            {flight.returnFlight || "Flight No."}
                          </p>
                          <div className="mt-1 flex items-center justify-center gap-1.5">
                            <AirlineLogo airline={flight.returnAirline || flight.airline} compact />
                            <p className="text-[9px] font-semibold text-white/85">
                              {flight.returnAirline || flight.airline}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* COMPACT SCHEDULE TABLE */}
                      <div
                        className="grid grid-cols-4 text-center"
                        style={{ background: posterTheme.light }}
                      >
                        {[
                          "Departure Date",
                          "Departure Time",
                          "Return Date",
                          "Return Time",
                        ].map((heading) => (
                          <div
                            key={heading}
                            className="border-b border-r px-1 py-1.5 text-[8px] font-black uppercase sm:text-[9px]"
                            style={{
                              borderColor: posterTheme.border,
                              color: posterTheme.primary,
                              background: `${posterTheme.accent}20`,
                            }}
                          >
                            {heading}
                          </div>
                        ))}

                        {schedules.map((item, index) => (
                          <div key={item.id} className="contents">
                            <div
                              className="border-r border-b px-1 py-2 text-[10px] font-black sm:text-xs"
                              style={{
                                borderColor: posterTheme.border,
                                background: index % 2 ? "#FFFFFF" : posterTheme.light,
                              }}
                            >
                              {item.departureDate ? dateText(item.departureDate) : "—"}
                            </div>

                            <div
                              className="border-r border-b px-1 py-2 text-[10px] font-black sm:text-xs"
                              style={{
                                borderColor: posterTheme.border,
                                background: index % 2 ? "#FFFFFF" : posterTheme.light,
                              }}
                            >
                              {item.departureTime ? timeText(item.departureTime) : "—"}
                            </div>

                            <div
                              className="border-r border-b px-1 py-2 text-[10px] font-black sm:text-xs"
                              style={{
                                borderColor: posterTheme.border,
                                background: index % 2 ? "#FFFFFF" : posterTheme.light,
                              }}
                            >
                              {item.returnDate ? dateText(item.returnDate) : "—"}
                            </div>

                            <div
                              className="border-b px-1 py-2 text-[10px] font-black sm:text-xs"
                              style={{
                                borderColor: posterTheme.border,
                                background: index % 2 ? "#FFFFFF" : posterTheme.light,
                              }}
                            >
                              {item.returnTime ? timeText(item.returnTime) : "—"}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div
                        className="flex items-center justify-between border-t px-3 py-2"
                        style={{
                          borderColor: posterTheme.border,
                          background: `${posterTheme.accent}20`,
                        }}
                      >
                        <span className="text-[9px] font-black uppercase tracking-wider" style={{ color: posterTheme.primary }}>
                          Package Starting From
                        </span>
                        <span className="text-sm font-black tabular-nums" style={{ color: posterTheme.primary }}>
                          {startingPrice !== null ? money(startingPrice) : "Contact For Price"}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3 flex items-center justify-between">
                      <h2 className="text-base font-black uppercase tracking-wider" style={{ color: posterTheme.primary }}>Available Umrah Packages</h2>
                      <span className="rounded-full px-3 py-1 text-[10px] font-black" style={{ color: posterTheme.primary, background: `${posterTheme.accent}35` }}>{packages.length} PACKAGES</span>
                    </div>
                    <div className="overflow-hidden rounded-lg" style={{ border: `1px solid ${posterTheme.border}` }}>
                      <div className="grid grid-cols-[14%_25%_25%_9%_9%_9%_9%] items-center px-2 py-2.5" style={{ background: posterTheme.light }}>
                        {["Package", "Makkah Hotel", "Madinah Hotel", "Sharing", "Quad", "Triple", "Double"].map((heading) => <div key={heading} className="px-1 text-center text-[10px] font-bold" style={{ color: posterTheme.primary }}>{heading}</div>)}
                      </div>
                      {packages.map((pkg, index) => (
                        <div key={pkg.id} className="grid grid-cols-[14%_25%_25%_9%_9%_9%_9%] items-center px-2 py-2.5" style={{ background: "#FFFFFF", borderTop: `1px dashed ${posterTheme.border}` }}>
                          <div className="min-w-0 px-1"><p className="break-words text-[10px] font-bold leading-tight">{pkg.name || `UP-${110175 + index}`}</p><p className="mt-2 rounded-md px-1 py-1 text-[9px] font-black" style={{ background: posterTheme.light, color: posterTheme.primary }}>TOTAL: {pkg.nights || "—"} NIGHTS</p></div>
                          <div className="min-w-0 px-1"><p className="break-words text-[10px] font-bold">{(pkg.makkahHotel || "HOTEL NOT ADDED").toUpperCase()}</p><p className="mt-1 text-[9px] text-slate-500">{pkg.makkahDistance} {pkg.makkahDistance ? "FROM HARAM" : ""}</p></div>
                          <div className="min-w-0 px-1"><p className="break-words text-[10px] font-bold">{(pkg.madinahHotel || "HOTEL NOT ADDED").toUpperCase()}</p><p className="mt-1 text-[9px] text-slate-500">{pkg.madinahDistance} {pkg.madinahDistance ? "FROM MASJID NABAWI" : ""}</p></div>
                          {[pkg.sharing, pkg.quad, pkg.triple, pkg.double].map((rate, rateIndex) => <div key={`${pkg.id}-new-rate-${rateIndex}`} className="min-w-0 px-0.5 text-center"><span className="break-words text-[10px] font-black leading-tight">{rate ? money(rate) : "—"}</span></div>)}
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 rounded-xl border px-4 py-3 text-center text-white shadow-lg" style={{ background: `linear-gradient(115deg, ${posterTheme.primary} 0%, ${posterTheme.secondary} 58%, ${posterTheme.primary} 100%)`, borderColor: `${posterTheme.accent}88`, boxShadow: `0 9px 24px ${posterTheme.primary}30, inset 0 1px 0 ${posterTheme.accent}55` }}>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Contact Us For Booking & Details</p>
                      <p className="mt-1 text-lg font-black tracking-wide">03137183111 • 03216837494 • 03128992016</p>
                      <p className="mt-1 text-xs font-semibold text-white/85">haramjunoontravels@gmail.com</p>
                    </div>
                    <div className="mt-4 border-t pt-3 text-center" style={{ borderColor: posterTheme.border }}><p className="text-[9px] font-semibold tracking-wide text-slate-500">SYSTEM DESIGNED & DEVELOPED BY AMEER HAMZA</p></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
