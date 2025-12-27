import { 
  Waves, 
  Utensils, 
  Tv, 
  Refrigerator, 
  Speaker, 
  BedDouble, 
  Car, 
  Zap,
  Trees,
  Users,
  UserCheck,
  Volleyball,
  Activity
} from 'lucide-react';
import { Amenity, TimingInfo, Accommodation } from './types';

export const CONTACT_INFO = {
  phone1: "+91 97638 53147",
  phone2: "+91 9226139414",
  phone3: "+91 8482831551",
  locationLink: "https://www.google.com/maps?q=18.69732666015625,73.52864837646484&z=17&hl=en",
  address: "DSK Farm by Hempushpa Farms",
  socialHandle: "@hempushpafarm"
};

export const AMENITIES: Amenity[] = [
  { icon: Waves, label: "Private 2 Swimming Pool" },
  { icon: Trees, label: "Common Garden Area" },
  { icon: Utensils, label: "Common Restaurant" },
  { icon: Users, label: "Capacity of 45 people" },
  { icon: Tv, label: "TV" },
  { icon: Refrigerator, label: "Fridge" },
  { icon: Speaker, label: "Speaker" },
  { icon: BedDouble, label: "Extra mattress" },
  { icon: UserCheck, label: "Caretaker" },
  { icon: Car, label: "Parking area" },
  { icon: Volleyball, label: "Volleyball" },
  { icon: Activity, label: "Cricket" },
  { icon: Zap, label: "Generator" },
];

export const TIMINGS: TimingInfo[] = [
  { title: "Pool Timing", time: "8 AM - 12 PM & 3 PM - 8 PM" },
  { title: "Breakfast", time: "8:30 AM - 10 AM" },
  { title: "Lunch", time: "1 PM - 3 PM" },
  { title: "High Tea", time: "5:30 PM - 6:00 PM" },
  { title: "Dinner", time: "9:00 PM - 10:30 PM" },
  { title: "Music (Common)", time: "8 AM - 1:30 PM & 5 PM - 10:30 PM" },
];

export const ACCOMMODATIONS: Accommodation[] = [
  {
    title: "2BHK Bungalow",
    desc: "A spacious retreat perfect for families or large groups wanting privacy and comfort.",
    capacity: "Family / Group Friendly",
    image: "https://picsum.photos/id/164/800/600", // Boat/River vibe placeholder
    features: ["Spacious Hall", "Private Feel", "Garden View", "AC Bedrooms"]
  },
  {
    title: "Deluxe AC Rooms",
    desc: "Cozy and vibrant rooms designed for couples or small families.",
    capacity: "Total 6 Rooms Available",
    image: "https://picsum.photos/id/235/800/600", // Mountain/nature vibe placeholder
    features: ["Air Conditioning", "Attached Bathroom", "Comfortable Bedding", "Daily Housekeeping"]
  }
];

export const RULES = [
  "Valid Government ID required at check-in (Aadhaar, Passport, License). Pan Card not accepted.",
  "No room service for food. Meals served in the restaurant (Buffet/Ala Carte).",
  "Pets are not allowed in the resort.",
  "Swimming at your own risk. Parents must supervise kids.",
  "No food or drinks allowed around the pool area.",
  "Non-occupants are not allowed to gather or visit guests in rooms.",
  "Cancellation: 100% charges if cancelled within 7 days of check-in."
];
