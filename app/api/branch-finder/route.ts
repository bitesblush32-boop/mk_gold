import { NextRequest, NextResponse } from 'next/server';
import { BRANCHES, findNearestBranch, getBranchesByCity } from '@/lib/branch-router';
import type { Branch } from '@/lib/branch-router';

/* ─── Karnataka pincode → lat/lng lookup ────────────────────────── */
// Covers pincodes for areas where MK Gold branches are located.
const PINCODE_COORDS: Record<string, { lat: number; lng: number }> = {
  // Bangalore
  '560010': { lat: 12.9916, lng: 77.5518 }, // Rajajinagar
  '560003': { lat: 13.0035, lng: 77.5668 }, // Malleshwaram
  '560040': { lat: 12.9719, lng: 77.5218 }, // Vijayanagar
  '560079': { lat: 12.9803, lng: 77.5324 }, // Basaveshwaranagar
  '560022': { lat: 13.0215, lng: 77.5485 }, // Yeshwanthpur
  '560041': { lat: 12.9299, lng: 77.5832 }, // Jayanagar
  '560038': { lat: 12.9719, lng: 77.6412 }, // Indiranagar
  '560034': { lat: 12.9352, lng: 77.6245 }, // Koramangala
  '560066': { lat: 12.9698, lng: 77.7500 }, // Whitefield
  '560078': { lat: 12.9063, lng: 77.5857 }, // JP Nagar
  // Common Bangalore pincodes
  '560001': { lat: 12.9716, lng: 77.5946 }, // MG Road / Central
  '560002': { lat: 12.9659, lng: 77.5938 },
  '560004': { lat: 12.9800, lng: 77.5900 },
  '560011': { lat: 12.9600, lng: 77.5300 },
  '560018': { lat: 12.9550, lng: 77.5540 },
  '560019': { lat: 12.9460, lng: 77.5710 },
  '560020': { lat: 12.9400, lng: 77.5500 },
  '560023': { lat: 12.9750, lng: 77.6800 },
  '560024': { lat: 12.9800, lng: 77.6600 },
  '560025': { lat: 12.9650, lng: 77.7100 },
  '560026': { lat: 12.9800, lng: 77.7200 },
  '560027': { lat: 12.9550, lng: 77.6500 },
  '560029': { lat: 12.9900, lng: 77.5000 },
  '560032': { lat: 13.0100, lng: 77.5300 },
  '560033': { lat: 13.0200, lng: 77.5200 },
  '560035': { lat: 12.9600, lng: 77.5000 },
  '560036': { lat: 13.0300, lng: 77.5400 },
  '560037': { lat: 12.9300, lng: 77.6100 },
  '560039': { lat: 12.9000, lng: 77.6200 },
  '560043': { lat: 12.9050, lng: 77.5700 },
  '560045': { lat: 12.9150, lng: 77.6000 },
  '560047': { lat: 12.9800, lng: 77.7400 },
  '560048': { lat: 12.9600, lng: 77.7600 },
  '560050': { lat: 13.0450, lng: 77.5900 },
  '560055': { lat: 13.0100, lng: 77.6100 },
  '560056': { lat: 13.0300, lng: 77.6200 },
  '560058': { lat: 13.0200, lng: 77.4900 },
  '560060': { lat: 12.9100, lng: 77.5500 },
  '560061': { lat: 12.8900, lng: 77.5600 },
  '560062': { lat: 12.8800, lng: 77.5300 },
  '560064': { lat: 12.8750, lng: 77.5700 },
  '560068': { lat: 12.9200, lng: 77.5000 },
  '560069': { lat: 12.9000, lng: 77.5100 },
  '560070': { lat: 13.0500, lng: 77.6500 },
  '560072': { lat: 13.0600, lng: 77.7000 },
  '560076': { lat: 13.0000, lng: 77.4800 },
  '560085': { lat: 13.0700, lng: 77.6800 },
  '560086': { lat: 13.0600, lng: 77.6300 },
  '560091': { lat: 12.9350, lng: 77.6900 },
  '560094': { lat: 12.9800, lng: 77.7000 },
  '560095': { lat: 13.0800, lng: 77.6000 },
  '560096': { lat: 13.0900, lng: 77.6100 },
  '560097': { lat: 12.8600, lng: 77.6600 },
  '560100': { lat: 12.8400, lng: 77.6700 },
  // Mysore
  '570001': { lat: 12.2958, lng: 76.6394 },
  '570002': { lat: 12.3215, lng: 76.6221 },
  '570004': { lat: 12.3100, lng: 76.6300 },
  '570008': { lat: 12.2850, lng: 76.6500 },
  '570009': { lat: 12.2700, lng: 76.6400 },
  '570010': { lat: 12.3000, lng: 76.6100 },
  '570011': { lat: 12.2600, lng: 76.6200 },
  '570012': { lat: 12.3400, lng: 76.6100 },
  '570017': { lat: 12.3401, lng: 76.6105 },
  '570019': { lat: 12.3200, lng: 76.6500 },
  '570020': { lat: 12.2500, lng: 76.6300 },
  '570023': { lat: 12.3000, lng: 76.6600 },
  // Mangalore
  '575001': { lat: 12.8698, lng: 74.8431 },
  '575002': { lat: 12.8832, lng: 74.8457 },
  '575003': { lat: 12.8550, lng: 74.8350 },
  '575004': { lat: 12.8750, lng: 74.8600 },
  '575006': { lat: 12.8900, lng: 74.8300 },
  '575007': { lat: 12.8450, lng: 74.8200 },
  '575008': { lat: 12.8300, lng: 74.8500 },
  // Davangere
  '577001': { lat: 14.4644, lng: 75.9218 },
  '577002': { lat: 14.4700, lng: 75.9100 },
  '577003': { lat: 14.4800, lng: 75.9300 },
  '577004': { lat: 14.4550, lng: 75.9400 },
  '577005': { lat: 14.4400, lng: 75.9100 },
  '577006': { lat: 14.4900, lng: 75.9000 },
};

const CITY_MAP: Record<string, Branch['city']> = {
  bangalore: 'Bangalore',
  bengaluru: 'Bangalore',
  mysore:    'Mysore',
  mysuru:    'Mysore',
  mangalore: 'Mangalore',
  mangaluru: 'Mangalore',
  davangere: 'Davangere',
  davanagere: 'Davangere',
};

/* ─── GET /api/branch-finder ─────────────────────────────────────── */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pincode = searchParams.get('pincode');
  const latStr  = searchParams.get('lat');
  const lngStr  = searchParams.get('lng');
  const city    = searchParams.get('city');

  // ?city=bangalore
  if (city) {
    const normalised = city.toLowerCase().trim();
    const cityKey = CITY_MAP[normalised];
    if (!cityKey) {
      return NextResponse.json(
        { error: 'Unknown city. Valid values: bangalore, mysore, mangalore, davangere' },
        { status: 400 },
      );
    }
    const branches = getBranchesByCity(cityKey);
    return NextResponse.json({ branches });
  }

  // ?lat=X&lng=Y
  if (latStr && lngStr) {
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ error: 'lat and lng must be numbers' }, { status: 400 });
    }
    const branch = findNearestBranch(lat, lng);
    return NextResponse.json({ branch });
  }

  // ?pincode=560010
  if (pincode) {
    const coords = PINCODE_COORDS[pincode.trim()];
    if (!coords) {
      // Unknown pincode — return all branches as fallback
      return NextResponse.json({ branches: BRANCHES, note: 'Pincode not found — showing all branches' });
    }
    const branch = findNearestBranch(coords.lat, coords.lng);
    return NextResponse.json({ branch });
  }

  return NextResponse.json(
    { error: 'Provide one of: pincode, lat+lng, or city' },
    { status: 400 },
  );
}
