import listing1 from "@/assets/listing-1.jpg";
import listing2 from "@/assets/listing-2.jpg";
import listing3 from "@/assets/listing-3.jpg";
import listing4 from "@/assets/listing-4.jpg";
import listing5 from "@/assets/listing-5.jpg";
import listing6 from "@/assets/listing-6.jpg";

export type Listing = {
  slug: string;
  title: string;
  type: string;
  school: string;
  area: string;
  distance: string;
  beds: number;
  baths: number;
  price: number;
  rating: number;
  verified: boolean;
  image: string;
  description: string;
  amenities: string[];
  landlord: string;
};

export const schools = ["UNILAG", "UI", "ABU", "UNN", "OAU", "UNIBEN"] as const;

export const schoolLabels: Record<string, string> = {
  UNILAG: "University of Lagos (UNILAG)",
  UI: "University of Ibadan (UI)",
  ABU: "Ahmadu Bello University (ABU)",
  UNN: "University of Nigeria, Nsukka (UNN)",
  OAU: "Obafemi Awolowo University (OAU)",
  UNIBEN: "University of Benin (UNIBEN)",
};

export const schoolCities: Record<string, string> = {
  UNILAG: "Lagos",
  UI: "Ibadan",
  ABU: "Zaria",
  UNN: "Enugu",
  OAU: "Ile-Ife",
  UNIBEN: "Benin City",
};

export const roomTypes = ["Self-contain", "Single room", "Shared flat", "Studio", "Ensuite"] as const;

export const budgets = [
  { value: 400000, label: "Under ₦400,000" },
  { value: 600000, label: "Under ₦600,000" },
  { value: 900000, label: "Under ₦900,000" },
];

export const listings: Listing[] = [
  {
    slug: "akoka-self-contain",
    title: "Bright self-contain at Akoka gate",
    type: "Self-contain",
    school: "UNILAG",
    area: "Akoka, Lagos",
    distance: "0.8 km to UNILAG",
    beds: 1,
    baths: 1,
    price: 850000,
    rating: 4.9,
    verified: true,
    image: listing1,
    description:
      "A freshly painted self-contain a short walk from the UNILAG main gate. Tiled floors, big windows and a private bathroom, with a water tank and inverter socket for study nights.",
    amenities: ["Prepaid meter", "Water tank", "Tiled floor", "Security gate", "Private bathroom", "Wardrobe"],
    landlord: "Mr. Adeyemi",
  },
  {
    slug: "bodija-shared-flat",
    title: "Shared 3-bedroom flat in Bodija",
    type: "Shared flat",
    school: "UI",
    area: "Bodija, Ibadan",
    distance: "2.1 km to UI",
    beds: 3,
    baths: 2,
    price: 520000,
    rating: 4.6,
    verified: true,
    image: listing2,
    description:
      "One room in a quiet three-bedroom flat shared with two other students. Furnished sitting room, shared kitchen and a keke stop right at the junction.",
    amenities: ["Furnished lounge", "Shared kitchen", "Borehole water", "Generator", "Parking", "Wi-Fi ready"],
    landlord: "Mrs. Ogunlade",
  },
  {
    slug: "samaru-studio",
    title: "Compact studio with kitchenette, Samaru",
    type: "Studio",
    school: "ABU",
    area: "Samaru, Zaria",
    distance: "1.2 km to ABU",
    beds: 1,
    baths: 1,
    price: 410000,
    rating: 4.5,
    verified: false,
    image: listing3,
    description:
      "Neat studio with its own kitchenette and dining nook. Ideal for a final-year student who cooks and needs quiet space to work.",
    amenities: ["Kitchenette", "Prepaid meter", "Ceiling fan", "Wardrobe", "Tiled floor"],
    landlord: "Alhaji Musa",
  },
  {
    slug: "nsukka-hostel-block",
    title: "Room in modern hostel block, Nsukka",
    type: "Single room",
    school: "UNN",
    area: "Odenigwe, Enugu",
    distance: "1.6 km to UNN",
    beds: 1,
    baths: 1,
    price: 380000,
    rating: 4.4,
    verified: true,
    image: listing4,
    description:
      "A single room in a managed hostel block with a caretaker on site, steady water supply and shared laundry lines at the back.",
    amenities: ["Caretaker on site", "Water supply", "Wardrobe", "Ceiling fan", "Security fence"],
    landlord: "Odenigwe Estates",
  },
  {
    slug: "ife-twin-share",
    title: "Twin-share room near OAU main gate",
    type: "Single room",
    school: "OAU",
    area: "Mayfair, Ile-Ife",
    distance: "0.6 km to OAU",
    beds: 2,
    baths: 1,
    price: 290000,
    rating: 4.3,
    verified: false,
    image: listing5,
    description:
      "Split the rent with a coursemate. Two beds, two desks and the shortest walk to Mayfair on this list — you can hear the campus bell.",
    amenities: ["Two study desks", "Shared bathroom", "Curtains fitted", "Prepaid meter", "Close to market"],
    landlord: "Mr. Fatoyinbo",
  },
  {
    slug: "ekosodin-ensuite",
    title: "Premium ensuite with AC, Ekosodin",
    type: "Ensuite",
    school: "UNIBEN",
    area: "Ekosodin, Benin City",
    distance: "1 km to UNIBEN",
    beds: 1,
    baths: 1,
    price: 720000,
    rating: 4.8,
    verified: true,
    image: listing6,
    description:
      "The most finished room around Ekosodin: split AC, ensuite bathroom, wardrobe wall and 24-hour security at the compound gate.",
    amenities: ["Split AC", "Ensuite bathroom", "24h security", "Inverter backup", "Wardrobe wall", "Parking"],
    landlord: "Ekosodin Homes",
  },
];

export const formatPrice = (n: number) => `₦${n.toLocaleString("en-NG")}`;

export function filterListings(opts: { school?: string; type?: string; budget?: number }) {
  return listings.filter(
    (l) =>
      (!opts.school || l.school === opts.school) &&
      (!opts.type || l.type === opts.type) &&
      (!opts.budget || l.price <= opts.budget),
  );
}
