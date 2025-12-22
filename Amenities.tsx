import React from 'react';
import { 
  Waves, 
  Trees, 
  Utensils, 
  Users, 
  Tv, 
  Refrigerator, 
  Speaker, 
  Bed, 
  UserCheck, 
  Car, 
  Volleyball, 
  Activity, 
  Zap 
} from 'lucide-react';

const amenities = [
  { icon: Waves, label: "Private 2 Swimming Pool" },
  { icon: Trees, label: "Common Garden Area" },
  { icon: Utensils, label: "Common Restaurant" },
  { icon: Users, label: "Capacity of 45 people" },
  { icon: Tv, label: "TV" },
  { icon: Refrigerator, label: "Fridge" },
  { icon: Speaker, label: "Speaker" },
  { icon: Bed, label: "Extra mattress" },
  { icon: UserCheck, label: "Caretaker" },
  { icon: Car, label: "Parking area" },
  { icon: Volleyball, label: "Volleyball" },
  { icon: Activity, label: "Cricket" },
  { icon: Zap, label: "Generator" },
];

export default function Amenities() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {amenities.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="p-3 bg-green-100 text-green-600 rounded-full mb-4">
                  <Icon size={28} />
                </div>
                <span className="font-semibold text-gray-700 text-center">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
