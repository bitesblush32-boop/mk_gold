export interface Branch {
  slug: string;
  name: string;
  city: "Bangalore" | "Mysore" | "Mangalore" | "Davangere";
  area: string;
  address: string;
  phone: string;
  whatsapp: string;
  coordinates: { lat: number; lng: number };
  openHours: {
    days: string;
    time: string;
  };
}

export const BRANCHES: Branch[] = [
  // ─── Bangalore ────────────────────────────────────────────────
  {
    slug: "sell-gold-rajajinagar",
    name: "MK Gold Rajajinagar",
    city: "Bangalore",
    area: "Rajajinagar",
    address: "Rajajinagar, Bangalore, Karnataka 560010",
    phone: "+91 80 0000 0001",
    whatsapp: "+918000000001",
    coordinates: { lat: 12.9916, lng: 77.5518 },
    openHours: { days: "Mon–Sat", time: "9:30 AM – 7:00 PM" },
  },
  {
    slug: "sell-gold-malleshwaram",
    name: "MK Gold Malleshwaram",
    city: "Bangalore",
    area: "Malleshwaram",
    address: "Malleshwaram, Bangalore, Karnataka 560003",
    phone: "+91 80 0000 0002",
    whatsapp: "+918000000002",
    coordinates: { lat: 13.0035, lng: 77.5668 },
    openHours: { days: "Mon–Sat", time: "9:30 AM – 7:00 PM" },
  },
  {
    slug: "sell-gold-vijayanagar",
    name: "MK Gold Vijayanagar",
    city: "Bangalore",
    area: "Vijayanagar",
    address: "Vijayanagar, Bangalore, Karnataka 560040",
    phone: "+91 80 0000 0003",
    whatsapp: "+918000000003",
    coordinates: { lat: 12.9719, lng: 77.5218 },
    openHours: { days: "Mon–Sat", time: "9:30 AM – 7:00 PM" },
  },
  {
    slug: "sell-gold-basaveshwaranagar",
    name: "MK Gold Basaveshwaranagar",
    city: "Bangalore",
    area: "Basaveshwaranagar",
    address: "Basaveshwaranagar, Bangalore, Karnataka 560079",
    phone: "+91 80 0000 0004",
    whatsapp: "+918000000004",
    coordinates: { lat: 12.9803, lng: 77.5324 },
    openHours: { days: "Mon–Sat", time: "9:30 AM – 7:00 PM" },
  },
  {
    slug: "sell-gold-yeshwanthpur",
    name: "MK Gold Yeshwanthpur",
    city: "Bangalore",
    area: "Yeshwanthpur",
    address: "Yeshwanthpur, Bangalore, Karnataka 560022",
    phone: "+91 80 0000 0005",
    whatsapp: "+918000000005",
    coordinates: { lat: 13.0215, lng: 77.5485 },
    openHours: { days: "Mon–Sat", time: "9:30 AM – 7:00 PM" },
  },
  {
    slug: "sell-gold-jayanagar",
    name: "MK Gold Jayanagar",
    city: "Bangalore",
    area: "Jayanagar",
    address: "Jayanagar, Bangalore, Karnataka 560041",
    phone: "+91 80 0000 0006",
    whatsapp: "+918000000006",
    coordinates: { lat: 12.9299, lng: 77.5832 },
    openHours: { days: "Mon–Sat", time: "9:30 AM – 7:00 PM" },
  },
  {
    slug: "sell-gold-indiranagar",
    name: "MK Gold Indiranagar",
    city: "Bangalore",
    area: "Indiranagar",
    address: "Indiranagar, Bangalore, Karnataka 560038",
    phone: "+91 80 0000 0007",
    whatsapp: "+918000000007",
    coordinates: { lat: 12.9719, lng: 77.6412 },
    openHours: { days: "Mon–Sat", time: "9:30 AM – 7:00 PM" },
  },
  {
    slug: "sell-gold-koramangala",
    name: "MK Gold Koramangala",
    city: "Bangalore",
    area: "Koramangala",
    address: "Koramangala, Bangalore, Karnataka 560034",
    phone: "+91 80 0000 0008",
    whatsapp: "+918000000008",
    coordinates: { lat: 12.9352, lng: 77.6245 },
    openHours: { days: "Mon–Sat", time: "9:30 AM – 7:00 PM" },
  },
  {
    slug: "sell-gold-whitefield",
    name: "MK Gold Whitefield",
    city: "Bangalore",
    area: "Whitefield",
    address: "Whitefield, Bangalore, Karnataka 560066",
    phone: "+91 80 0000 0009",
    whatsapp: "+918000000009",
    coordinates: { lat: 12.9698, lng: 77.7500 },
    openHours: { days: "Mon–Sat", time: "9:30 AM – 7:00 PM" },
  },
  {
    slug: "sell-gold-jp-nagar",
    name: "MK Gold JP Nagar",
    city: "Bangalore",
    area: "JP Nagar",
    address: "JP Nagar, Bangalore, Karnataka 560078",
    phone: "+91 80 0000 0010",
    whatsapp: "+918000000010",
    coordinates: { lat: 12.9063, lng: 77.5857 },
    openHours: { days: "Mon–Sat", time: "9:30 AM – 7:00 PM" },
  },
  // ─── Mysore ───────────────────────────────────────────────────
  {
    slug: "sell-gold-mysore-city",
    name: "MK Gold Mysore City",
    city: "Mysore",
    area: "Mysore City",
    address: "Mysore City, Mysore, Karnataka 570001",
    phone: "+91 82 1000 0001",
    whatsapp: "+918210000001",
    coordinates: { lat: 12.2958, lng: 76.6394 },
    openHours: { days: "Mon–Sat", time: "9:30 AM – 7:00 PM" },
  },
  {
    slug: "sell-gold-gokulam",
    name: "MK Gold Gokulam",
    city: "Mysore",
    area: "Gokulam",
    address: "Gokulam, Mysore, Karnataka 570002",
    phone: "+91 82 1000 0002",
    whatsapp: "+918210000002",
    coordinates: { lat: 12.3215, lng: 76.6221 },
    openHours: { days: "Mon–Sat", time: "9:30 AM – 7:00 PM" },
  },
  {
    slug: "sell-gold-vijayanagar-mysore",
    name: "MK Gold Vijayanagar Mysore",
    city: "Mysore",
    area: "Vijayanagar Mysore",
    address: "Vijayanagar, Mysore, Karnataka 570017",
    phone: "+91 82 1000 0003",
    whatsapp: "+918210000003",
    coordinates: { lat: 12.3401, lng: 76.6105 },
    openHours: { days: "Mon–Sat", time: "9:30 AM – 7:00 PM" },
  },
  // ─── Mangalore ────────────────────────────────────────────────
  {
    slug: "sell-gold-mangalore-city",
    name: "MK Gold Mangalore City",
    city: "Mangalore",
    area: "Mangalore City",
    address: "Mangalore, Karnataka 575001",
    phone: "+91 82 4000 0001",
    whatsapp: "+918240000001",
    coordinates: { lat: 12.8698, lng: 74.8431 },
    openHours: { days: "Mon–Sat", time: "9:30 AM – 7:00 PM" },
  },
  {
    slug: "sell-gold-kadri",
    name: "MK Gold Kadri",
    city: "Mangalore",
    area: "Kadri",
    address: "Kadri, Mangalore, Karnataka 575002",
    phone: "+91 82 4000 0002",
    whatsapp: "+918240000002",
    coordinates: { lat: 12.8832, lng: 74.8457 },
    openHours: { days: "Mon–Sat", time: "9:30 AM – 7:00 PM" },
  },
  // ─── Davangere ────────────────────────────────────────────────
  {
    slug: "sell-gold-davangere",
    name: "MK Gold Davangere",
    city: "Davangere",
    area: "Davangere",
    address: "Davangere, Karnataka 577001",
    phone: "+91 81 9200 0001",
    whatsapp: "+918192000001",
    coordinates: { lat: 14.4644, lng: 75.9218 },
    openHours: { days: "Mon–Sat", time: "9:30 AM – 7:00 PM" },
  },
];

/** Haversine formula — distance in km between two lat/lng points */
function haversineKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function findNearestBranch(lat: number, lng: number): Branch {
  return BRANCHES.reduce((nearest, branch) => {
    const distNearest = haversineKm(lat, lng, nearest.coordinates.lat, nearest.coordinates.lng);
    const distBranch  = haversineKm(lat, lng, branch.coordinates.lat,  branch.coordinates.lng);
    return distBranch < distNearest ? branch : nearest;
  });
}

export function getBranchBySlug(slug: string): Branch | undefined {
  return BRANCHES.find((b) => b.slug === slug);
}

export function getBranchesByCity(city: Branch["city"]): Branch[] {
  return BRANCHES.filter((b) => b.city === city);
}
