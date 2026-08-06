import { NextRequest, NextResponse } from "next/server";
import {
  BRANCHES,
  findNearestBranch,
  getBranchesByCity,
} from "@/lib/branch-router";
import type { Branch } from "@/lib/branch-router";

export const revalidate = 86400; // Data is static — recheck once per day

const CACHE = {
  headers: {
    "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
  },
};

/* ─── Karnataka pincode → lat/lng lookup ────────────────────────── */
// Covers pincodes for areas where MK Gold branches are located.
const PINCODE_COORDS: Record<string, { lat: number; lng: number }> = {
  // Bangalore
  "560010": { lat: 12.9916, lng: 77.5518 }, // Rajajinagar
  "560003": { lat: 13.0035, lng: 77.5668 }, // Malleshwaram
  "560040": { lat: 12.9719, lng: 77.5218 }, // Vijayanagar
  "560079": { lat: 12.9803, lng: 77.5324 }, // Basaveshwaranagar
  "560022": { lat: 13.0215, lng: 77.5485 }, // Yeshwanthpur
  "560041": { lat: 12.9299, lng: 77.5832 }, // Jayanagar
  "560038": { lat: 12.9719, lng: 77.6412 }, // Indiranagar
  "560034": { lat: 12.9352, lng: 77.6245 }, // Koramangala
  "560066": { lat: 12.9698, lng: 77.75 }, // Whitefield
  "560078": { lat: 12.9063, lng: 77.5857 }, // JP Nagar
  // Common Bangalore pincodes
  "560001": { lat: 12.9716, lng: 77.5946 }, // MG Road / Central
  "560002": { lat: 12.9659, lng: 77.5938 },
  "560004": { lat: 12.98, lng: 77.59 },
  "560011": { lat: 12.96, lng: 77.53 },
  "560018": { lat: 12.955, lng: 77.554 },
  "560019": { lat: 12.946, lng: 77.571 },
  "560020": { lat: 12.94, lng: 77.55 },
  "560023": { lat: 12.975, lng: 77.68 },
  "560024": { lat: 12.98, lng: 77.66 },
  "560025": { lat: 12.965, lng: 77.71 },
  "560026": { lat: 12.98, lng: 77.72 },
  "560027": { lat: 12.955, lng: 77.65 },
  "560029": { lat: 12.99, lng: 77.5 },
  "560032": { lat: 13.01, lng: 77.53 },
  "560033": { lat: 13.02, lng: 77.52 },
  "560035": { lat: 12.96, lng: 77.5 },
  "560036": { lat: 13.03, lng: 77.54 },
  "560037": { lat: 12.93, lng: 77.61 },
  "560039": { lat: 12.9, lng: 77.62 },
  "560043": { lat: 12.905, lng: 77.57 },
  "560045": { lat: 12.915, lng: 77.6 },
  "560047": { lat: 12.98, lng: 77.74 },
  "560048": { lat: 12.96, lng: 77.76 },
  "560050": { lat: 13.045, lng: 77.59 },
  "560055": { lat: 13.01, lng: 77.61 },
  "560056": { lat: 13.03, lng: 77.62 },
  "560058": { lat: 13.02, lng: 77.49 },
  "560060": { lat: 12.91, lng: 77.55 },
  "560061": { lat: 12.89, lng: 77.56 },
  "560062": { lat: 12.88, lng: 77.53 },
  "560064": { lat: 12.875, lng: 77.57 },
  "560068": { lat: 12.92, lng: 77.5 },
  "560069": { lat: 12.9, lng: 77.51 },
  "560070": { lat: 13.05, lng: 77.65 },
  "560072": { lat: 13.06, lng: 77.7 },
  "560076": { lat: 13.0, lng: 77.48 },
  "560085": { lat: 13.07, lng: 77.68 },
  "560086": { lat: 13.06, lng: 77.63 },
  "560091": { lat: 12.935, lng: 77.69 },
  "560094": { lat: 12.98, lng: 77.7 },
  "560095": { lat: 13.08, lng: 77.6 },
  "560096": { lat: 13.09, lng: 77.61 },
  "560097": { lat: 12.86, lng: 77.66 },
  "560100": { lat: 12.84, lng: 77.67 },
  // Mysore
  "570001": { lat: 12.2958, lng: 76.6394 },
  "570002": { lat: 12.3215, lng: 76.6221 },
  "570004": { lat: 12.31, lng: 76.63 },
  "570008": { lat: 12.285, lng: 76.65 },
  "570009": { lat: 12.27, lng: 76.64 },
  "570010": { lat: 12.3, lng: 76.61 },
  "570011": { lat: 12.26, lng: 76.62 },
  "570012": { lat: 12.34, lng: 76.61 },
  "570017": { lat: 12.3401, lng: 76.6105 },
  "570019": { lat: 12.32, lng: 76.65 },
  "570020": { lat: 12.25, lng: 76.63 },
  "570023": { lat: 12.3, lng: 76.66 },
  // Mangalore
  "575001": { lat: 12.8698, lng: 74.8431 },
  "575002": { lat: 12.8832, lng: 74.8457 },
  "575003": { lat: 12.855, lng: 74.835 },
  "575004": { lat: 12.875, lng: 74.86 },
  "575006": { lat: 12.89, lng: 74.83 },
  "575007": { lat: 12.845, lng: 74.82 },
  "575008": { lat: 12.83, lng: 74.85 },
  // Davangere
  "577001": { lat: 14.4644, lng: 75.9218 },
  "577002": { lat: 14.47, lng: 75.91 },
  "577003": { lat: 14.48, lng: 75.93 },
  "577004": { lat: 14.455, lng: 75.94 },
  "577005": { lat: 14.44, lng: 75.91 },
  "577006": { lat: 14.49, lng: 75.9 },
};

const CITY_MAP: Record<string, Branch["city"]> = {
  bangalore: "Bangalore",
  bengaluru: "Bangalore",
  mysore: "Mysore",
  mysuru: "Mysore",
  mangalore: "Mangalore",
  mangaluru: "Mangalore",
  davangere: "Davangere",
  davanagere: "Davangere",
};

/* ─── GET /api/branch-finder ─────────────────────────────────────── */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pincode = searchParams.get("pincode");
  const latStr = searchParams.get("lat");
  const lngStr = searchParams.get("lng");
  const city = searchParams.get("city");

  // ?city=bangalore
  if (city) {
    const normalised = city.toLowerCase().trim();
    const cityKey = CITY_MAP[normalised];
    if (!cityKey) {
      return NextResponse.json(
        {
          error:
            "Unknown city. Valid values: bangalore, mysore, mangalore, davangere",
        },
        { status: 400 },
      );
    }
    const branches = getBranchesByCity(cityKey);
    return NextResponse.json({ branches }, CACHE);
  }

  // ?lat=X&lng=Y
  if (latStr && lngStr) {
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: "lat and lng must be numbers" },
        { status: 400 },
      );
    }
    const branch = findNearestBranch(lat, lng);
    return NextResponse.json({ branch }, CACHE);
  }

  // ?pincode=560010
  if (pincode) {
    const coords = PINCODE_COORDS[pincode.trim()];
    if (!coords) {
      // Unknown pincode — return all branches as fallback
      return NextResponse.json(
        {
          branches: BRANCHES,
          note: "Pincode not found — showing all branches",
        },
        CACHE,
      );
    }
    const branch = findNearestBranch(coords.lat, coords.lng);
    return NextResponse.json({ branch }, CACHE);
  }

  return NextResponse.json(
    { error: "Provide one of: pincode, lat+lng, or city" },
    { status: 400 },
  );
}
