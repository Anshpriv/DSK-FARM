import { LucideIcon } from 'lucide-react';

export interface Amenity {
  icon: LucideIcon;
  label: string;
}

export interface TimingInfo {
  title: string;
  time: string;
}

export interface Accommodation {
  title: string;
  desc: string;
  capacity: string;
  image: string;
  features: string[];
}