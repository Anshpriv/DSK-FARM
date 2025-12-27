import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AdminPanel, { BookingRequest } from './AdminPanel';
import { supabase } from './supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Star, 
  Info, 
  Clock, 
  CheckCircle2, 
  Instagram,
  AlertCircle,
  X,
  Camera,
  Utensils,
  Waves,
  Home,
  BedDouble,
  Calendar,
  Users,
  Car,
  Baby,
  Shield,
  Plus,
  Trash2
} from 'lucide-react';
import { AMENITIES, TIMINGS, RULES, CONTACT_INFO } from './constants';
import heroBg from './farm/1.png';
import aboutImg from './farm/2.png';
import amb1 from './farm/farm_ambience/1.png';
import amb2 from './farm/farm_ambience/2.png';
import amb3 from './farm/farm_ambience/3.png';
import amb4 from './farm/farm_ambience/4.png';
import amb5 from './farm/farm_ambience/5.png';
import amb6 from './farm/farm_ambience/6.png';
import amb7 from './farm/farm_ambience/7.png';
import amb8 from './farm/farm_ambience/8.png';
import cot0 from './farm/cottage/0.png';
import cot1 from './farm/cottage/1.png';
import cot2 from './farm/cottage/2.png';
import cot3 from './farm/cottage/3.png';
import cot4 from './farm/cottage/4.png';
import cot5 from './farm/cottage/5.png';
import cot6 from './farm/cottage/6.png';
import cot7 from './farm/cottage/7.png';
import cot8 from './farm/cottage/8.png';
import caf0 from './farm/cafe/0.png';
import caf1 from './farm/cafe/1.png';
import caf2 from './farm/cafe/2.png';
import caf3 from './farm/cafe/3.png';
import caf4 from './farm/cafe/4.png';
import caf5 from './farm/cafe/5.png';
import caf6 from './farm/cafe/6.png';
import caf7 from './farm/cafe/7.png';
import pool0 from './farm/pool/0.png';
import acr0 from './farm/standardacroom/0.png';
import acr1 from './farm/standardacroom/1.png';
import acr2 from './farm/standardacroom/2.png';
import acr3 from './farm/standardacroom/3.png';
import acr4 from './farm/standardacroom/4.png';
import acr5 from './farm/standardacroom/5.png';
import acr6 from './farm/standardacroom/6.png';
import acr7 from './farm/standardacroom/7.png';
import acr8 from './farm/standardacroom/8.png';
import pool1 from './farm/pool/1.png';
import pool2 from './farm/pool/2.png';
import pool3 from './farm/pool/3.png';
import pool4 from './farm/pool/4.png';
import pool5 from './farm/pool/5.png';
import pool6 from './farm/pool/6.png';
import pool7 from './farm/pool/7.png';
import pool8 from './farm/pool/8.png';
import ac1 from './farm/deluxacrooms/0.png';
import ac2 from './farm/deluxacrooms/1.png';
import ac3 from './farm/deluxacrooms/2.png';
import ac4 from './farm/deluxacrooms/3.png';
import ac5 from './farm/deluxacrooms/4.png';
import ac6 from './farm/deluxacrooms/5.png';
import ac7 from './farm/deluxacrooms/6.png';
import ac8 from './farm/deluxacrooms/7.png';
import ac9 from './farm/deluxacrooms/8.png';
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const AnalogClock = ({ time }: { time: string }) => {
  const [hours, minutes] = time ? time.split(':').map(Number) : [12, 0];
  const minuteDegrees = minutes * 6;
  const hourDegrees = ((hours % 12) * 30) + (minutes * 0.5);

  return (
    <div className="w-10 h-10 rounded-full border-2 border-orange-500 bg-white relative shadow-sm flex items-center justify-center shrink-0 mx-2">
      <div className="w-1 h-1 bg-black rounded-full z-10"></div>
      {/* Hour Hand */}
      <div 
        className="absolute w-0.5 h-2.5 bg-black rounded-full origin-bottom"
        style={{ bottom: '50%', transform: `rotate(${hourDegrees}deg)` }}
      />
      {/* Minute Hand */}
      <div 
        className="absolute w-0.5 h-3.5 bg-gray-400 rounded-full origin-bottom"
        style={{ bottom: '50%', transform: `rotate(${minuteDegrees}deg)` }}
      />
    </div>
  );
};

const BookingModal = ({ onClose, categories, onSubmit, bookings }: { onClose: () => void; categories: any[]; onSubmit: (booking: any) => void; bookings: BookingRequest[] }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    checkInTime: '',
    checkOutTime: '',
    adults: '0',
    vegCount: '0',
    nonVegCount: '0',
    extraMattress: '0',
    comingFrom: '',
    transportMode: 'Private Car',
    roomType: '2BHK Bunglow',
    numberOfRooms: '0',
    cottageType: 'AC rooms'
  });
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [kidsAges, setKidsAges] = useState<string[]>([]);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  const addKid = () => setKidsAges([...kidsAges, '']);
  const removeKid = (index: number) => setKidsAges(kidsAges.filter((_, i) => i !== index));
  const updateKidAge = (index: number, val: string) => {
    const newAges = [...kidsAges];
    newAges[index] = val;
    setKidsAges(newAges);
  };

  const getKidChargeMessage = (ageStr: string) => {
    const age = parseInt(ageStr);
    if (isNaN(age)) return '';
    if (age < 5) return 'Free';
    if (age <= 8) return '50% Charge';
    return 'Full Charge';
  };

  useEffect(() => {
    const adults = parseInt(formData.adults) || 0;
    let kidsChargeHeads = 0;
    kidsAges.forEach(ageStr => {
      const age = parseInt(ageStr);
      if (!isNaN(age)) {
        if (age > 8) kidsChargeHeads += 1;
        else if (age >= 5) kidsChargeHeads += 0.5;
      }
    });

    const totalHeads = adults + kidsChargeHeads;
    let nights = 1;
    if (formData.roomType !== 'Day Trip' && formData.checkIn && formData.checkOut) {
      const diff = new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime();
      nights = Math.max(1, Math.ceil(diff / (1000 * 3600 * 24)));
    }
    const baseRate = formData.roomType === 'Day Trip' ? 1500 : 3000;
    setCalculatedPrice(totalHeads * baseRate * nights);
  }, [formData.adults, kidsAges, formData.roomType, formData.checkIn, formData.checkOut]);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData({ ...formData, comingFrom: val });
    if (val.length > 2) {
      fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(val)}&apiKey=ff169587265a45e4a40ec5a51c68ad53`)
        .then(res => res.json())
        .then(data => setSuggestions(data.features || []))
        .catch(err => console.error(err));
    } else {
      setSuggestions([]);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    return `${d.toString().padStart(2, '0')}/${m.toString().padStart(2, '0')}/${y}`;
  };

  const isDateFull = (dateStr: string) => {
    if (!dateStr) return false;
    
    let roomTypeFilter = formData.roomType;
    if (formData.roomType === 'Cottage') {
      roomTypeFilter = `Cottage - ${formData.cottageType}`;
    }
    
    const existingBookingsCount = bookings.filter(b => {
      let bookingRoomType = b.roomType;
      if (b.roomType.includes('Cottage')) {
        bookingRoomType = b.roomType;
      }
      return bookingRoomType === roomTypeFilter && 
             b.status !== 'declined' &&
             dateStr >= b.checkIn && dateStr < b.checkOut;
    }).reduce((acc, b) => acc + (b.numberOfRooms || 1), 0);

    const requestedRooms = parseInt(formData.numberOfRooms, 10);

    if (formData.roomType === 'Cottage') {
      return (existingBookingsCount + requestedRooms) > 3;
    }
    return false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalGuests = (parseInt(formData.adults) || 0) + kidsAges.length;
    const kidsDetails = kidsAges.map(age => `${age} yrs (${getKidChargeMessage(age)})`).join(', ');
    
    const roomDisplayName = formData.roomType === 'Cottage' ? `Cottage - ${formData.cottageType}` : formData.roomType;
    const message = `New Booking Request at DSK Farm\n\n*Guest Details*\nName: ${formData.name}\nPhone: ${formData.phone}\nFrom: ${formData.comingFrom}\n\n*Stay Details*\nRoom: ${roomDisplayName} (Qty: ${formData.numberOfRooms})\nDates: ${formatDate(formData.checkIn)} to ${formatDate(formData.checkOut)}\nTime: ${formData.checkInTime || 'Standard'} - ${formData.checkOutTime || 'Standard'}\nTransport: ${formData.transportMode}\n\n*Group Info*\nTotal Guests: ${totalGuests}\nAdults: ${formData.adults}\nKids: ${kidsAges.length} [${kidsDetails}]\nVeg: ${formData.vegCount} | Non-Veg: ${formData.nonVegCount}\nExtra Mattress: ${formData.extraMattress}\n\n*Estimated Price: ₹${calculatedPrice.toLocaleString('en-IN')}*\n\nPlease confirm availability.`;
    const encodedText = encodeURIComponent(message);
    
    // Create booking object for Admin Panel
    const bookingRoomType = formData.roomType === 'Cottage' ? `Cottage - ${formData.cottageType}` : formData.roomType;
    const newBooking: BookingRequest = {
      id: Date.now().toString(),
      userName: formData.name,
      userPhone: formData.phone,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      checkInTime: formData.checkInTime || 'Standard',
      checkOutTime: formData.checkOutTime || 'Standard',
      roomType: bookingRoomType,
      status: 'pending',
      price: calculatedPrice,
      numberOfRooms: parseInt(formData.numberOfRooms) || 1
    };
    onSubmit(newBooking);

    window.open(`https://wa.me/918482831551?text=${encodedText}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative z-10"
      >
        <div className="bg-green-800 p-6 text-white flex justify-between items-center sticky top-0 z-20">
          <h3 className="text-2xl font-bold">Book Your Stay</h3>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" placeholder="Your Name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" placeholder="+91 98765 43210" />
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Coming From (City/Area)</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" value={formData.comingFrom} onChange={handleAddressChange} className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" placeholder="Start typing location..." />
            </div>
            {suggestions.length > 0 && (
              <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-lg max-h-48 overflow-y-auto">
                {suggestions.map((item: any, idx: number) => (
                  <li key={idx} onClick={() => { setFormData({...formData, comingFrom: item.properties.formatted}); setSuggestions([]); }} className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 border-b last:border-0 border-gray-100">
                    {item.properties.formatted}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input required type="date" value={formData.checkIn} onChange={e => setFormData({...formData, checkIn: e.target.value})} className={`w-full pl-10 pr-4 py-2 rounded-xl border ${isDateFull(formData.checkIn) ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} outline-none`} />
              </div>
              {isDateFull(formData.checkIn) && <p className="text-xs text-red-500 mt-1">No booking available on this day</p>}
              <div className="flex items-center mt-2">
                <input type="time" value={formData.checkInTime} onChange={e => setFormData({...formData, checkInTime: e.target.value})} className="flex-1 px-2 py-1 text-sm rounded-lg border border-gray-300 outline-none" />
                <AnalogClock time={formData.checkInTime} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input required type="date" value={formData.checkOut} onChange={e => setFormData({...formData, checkOut: e.target.value})} className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div className="flex items-center mt-2">
                <input type="time" value={formData.checkOutTime} onChange={e => setFormData({...formData, checkOutTime: e.target.value})} className="flex-1 px-2 py-1 text-sm rounded-lg border border-gray-300 outline-none" />
                <AnalogClock time={formData.checkOutTime} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input required type="number" min="1" value={formData.adults} onChange={e => setFormData({...formData, adults: e.target.value})} className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kids</label>
            {kidsAges.map((age, idx) => (
              <div key={idx} className="flex items-center gap-3 mb-2">
                <div className="relative flex-1">
                  <Baby className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="number" placeholder="Age" value={age} onChange={e => updateKidAge(idx, e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <span className={`text-xs font-bold whitespace-nowrap ${getKidChargeMessage(age) === 'Free' ? 'text-green-600' : getKidChargeMessage(age) === '50% Charge' ? 'text-orange-500' : 'text-gray-600'}`}>
                  {getKidChargeMessage(age)}
                </span>
                <button type="button" onClick={() => removeKid(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-full">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button type="button" onClick={addKid} className="flex items-center gap-2 text-sm text-green-600 font-bold hover:text-green-700">
              <Plus size={16} />
              Add Kid
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
            <select value={formData.roomType} onChange={e => setFormData({...formData, roomType: e.target.value, cottageType: 'AC rooms'})} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none bg-white">
              <option value="2BHK Bunglow">2BHK Bunglow</option>
              <option value="Cottage">Cottage</option>
              <option value="Day Trip">Day Trip</option>
            </select>
          </div>

          {formData.roomType === 'Cottage' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cottage Room Type</label>
                <select value={formData.cottageType} onChange={e => setFormData({...formData, cottageType: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none bg-white">
                  <option value="AC rooms">AC Rooms</option>
                  <option value="Delux rooms">Delux Rooms</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Rooms (Max 3)</label>
                <select value={formData.numberOfRooms} onChange={e => setFormData({...formData, numberOfRooms: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none bg-white">
                  {[1, 2, 3].map(num => <option key={num} value={num}>{num}</option>)}
                </select>
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-xl">
            <div>
              <label className="block text-xs font-medium text-green-700 mb-1">Veg Meals</label>
              <input type="number" min="0" value={formData.vegCount} onChange={e => setFormData({...formData, vegCount: e.target.value})} className="w-full px-3 py-1 rounded-lg border border-gray-300 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-red-700 mb-1">Non-Veg Meals</label>
              <input type="number" min="0" value={formData.nonVegCount} onChange={e => setFormData({...formData, nonVegCount: e.target.value})} className="w-full px-3 py-1 rounded-lg border border-gray-300 outline-none text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Extra Mattress</label>
              <input type="number" min="0" value={formData.extraMattress} onChange={e => setFormData({...formData, extraMattress: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transport</label>
              <div className="relative">
                <Car className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <select value={formData.transportMode} onChange={e => setFormData({...formData, transportMode: e.target.value})} className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none bg-white">
                  <option value="Private Car">Private Car</option>
                  <option value="Bike">Bike</option>
                  <option value="Bus/Public">Bus/Public</option>
                  <option value="Cab/Taxi">Cab/Taxi</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-xl text-center border border-green-200">
            <p className="text-sm text-gray-600">Estimated Price</p>
            <p className="text-3xl font-bold text-green-700">₹{calculatedPrice.toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-500 mt-1">Final price confirmed by admin.</p>
          </div>

          <button type="submit" disabled={isDateFull(formData.checkIn)} className={`w-full ${isDateFull(formData.checkIn) ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'} text-white font-bold py-3 rounded-xl shadow-lg mt-2 transition-transform active:scale-95`}>Confirm via WhatsApp</button>
          <p className="text-xs text-center text-gray-500">We will confirm availability instantly.</p>
        </form>
      </motion.div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);

  // --- SUPABASE INTEGRATION ---
  
  // 1. Fetch bookings on load
  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
      } else if (data) {
        // Map Database columns (snake_case) to App state (camelCase)
        const mappedBookings: BookingRequest[] = data.map((b: any) => ({
          id: b.id,
          userName: b.user_name,
          userPhone: b.user_phone,
          checkIn: b.check_in,
          checkOut: b.check_out,
          checkInTime: b.check_in_time,
          checkOutTime: b.check_out_time,
          roomType: b.room_type,
          status: b.status
        }));
        setBookings(mappedBookings);
      }
    };

    fetchBookings();

    // Optional: Subscribe to real-time changes so Admin updates instantly
    const subscription = supabase
      .channel('bookings_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 2. Update status in Database
  const handleUpdateStatus = async (id: string, status: 'confirmed' | 'declined') => {
    // Optimistic update (update UI immediately)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    
    // Update Supabase
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (error) console.error('Error updating status:', error);
  };

  // 3. Delete record from Database
  const handleDeleteRecord = async (id: string) => {
    // Delete from Supabase first
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) {
      console.error('Error deleting record:', error);
      alert('Failed to delete from database: ' + error.message);
    } else {
      // Optimistic update (remove from UI after successful deletion)
      setBookings(prev => prev.filter(b => b.id !== id));
    }
  };
  // ---------------------------

  if (isAdminOpen) {
    return <AdminPanel onBack={() => setIsAdminOpen(false)} bookings={bookings} onUpdateStatus={handleUpdateStatus} onDeleteRecord={handleDeleteRecord} />;
  }

  const categories = [
    { 
      id: 'ambience', 
      title: 'Farm Ambience', 
      subtitle: 'Experience the vibe',
      icon: Camera, 
      cover: amb1, 
      images: [amb1, amb2, amb3, amb4, amb5, amb6, amb7, amb8] 
    },
    { 
      id: 'cafeteria', 
      title: 'Farm Cafeteria', 
      subtitle: 'Taste of nature',
      icon: Utensils, 
      cover: caf0, 
      images: [caf1, caf2, caf3, caf4, caf5, caf6, caf7] 
    },
    { 
      id: 'pool', 
      title: 'Farm Swimming Pool', 
      subtitle: 'Dive into relaxation',
      icon: Waves, 
      cover: pool0, 
      images: [pool1, pool2, pool3, pool4, pool5, pool6, pool7, pool8] 
    },
    { 
      id: 'cottage', 
      title: '2BHK Cottage', 
      subtitle: 'Luxury & Comfort',
      icon: Home, 
      cover: cot0, 
      images: [cot1, cot2, cot3, cot4, cot5, cot6, cot7, cot8] 
    },
    { 
      id: 'rooms', 
      title: 'Standard AC Rooms', 
      subtitle: 'Cozy Stays',
      icon: BedDouble, 
      cover: acr0, 
      images: [acr1, acr2, acr3, acr4, acr5, acr6, acr7, acr8] 
    },
    { 
      id: 'ac', 
      title: 'Deluxe AC Rooms', 
      subtitle: 'Cozy Stays', 
      icon: Waves, 
      cover: ac1, 
      images: [ac2, ac3, ac4, ac5, ac6, ac7, ac8, ac9] 
    },
  ];

  return (
    <div className="bg-stone-50 min-h-screen selection:bg-orange-200">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Nature Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-stone-50/90"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg mb-4 inline-block">
              Welcome to Nature
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg leading-tight">
              DSK <span className="text-orange-400">Agritourism</span>
            </h1>
            <p className="text-xl md:text-2xl text-black mb-8 font-light drop-shadow-md bg-yellow-300 px-6 py-2 rounded-xl inline-block">
              A perfect retreat! Lush green lawns, beautiful cottages, and a picturesque atmosphere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#stay" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-transform hover:-translate-y-1"
              >
                View Rooms
              </a>
              <button 
                onClick={() => setIsBookingOpen(true)}
                className="bg-white hover:bg-gray-100 text-green-800 px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-transform hover:-translate-y-1 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone size={20} />
                Book Now
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <img 
                src={aboutImg} 
                alt="Farm Stay Atmosphere" 
                className="rounded-3xl shadow-2xl relative z-10 w-full h-auto object-cover transform rotate-2 hover:rotate-0 transition-all duration-500"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                About <span className="text-green-600">Us</span>
              </h2>
              <h3 className="text-xl font-semibold text-orange-500 mb-4">
                Welcome to Hempushpa Farm
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed text-lg">
                The heart behind DSK Farm Stay, where nature meets comfort. Nestled in a serene countryside setting, our farm stay offers an immersive experience in sustainable living and rural tranquility.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                We provide a peaceful retreat for nature lovers, wellness seekers, and adventure enthusiasts. Beyond hospitality, we are committed to eco-friendly farming and biodiversity conservation.
              </p>
              <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                <p className="font-bold text-green-800 italic">
                  "Escape the hustle of city life, and embrace the simplicity and beauty of farm living."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AMENITIES SECTION */}
      <section id="amenities" className="py-20 bg-green-900 text-white rounded-t-[3rem] -mt-10 relative z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-orange-400 font-bold tracking-wider uppercase text-sm">Everything you need</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2">Farm Amenities</h2>
          </div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {AMENITIES.map((item, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-white/20 transition-colors cursor-pointer group"
              >
                <div className="bg-green-800 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <item.icon size={32} className="text-orange-400" />
                </div>
                <span className="font-semibold text-sm md:text-base">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-16 text-center">
             <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-full font-bold text-sm">
                <Star className="fill-current" size={16}/>
                <span>Max Accommodation: 45 People</span>
             </div>
          </div>
        </div>
      </section>

      {/* ACCOMMODATION SECTION */}
      <section id="stay" className="py-20 px-4 bg-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">Experience <span className="text-orange-500">Our Farm</span></h2>
            <p className="text-gray-600 mt-2">Explore our ambience, stays, and facilities.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                onClick={() => setActiveCategory(cat.id)}
                className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all border border-orange-100 flex flex-col cursor-pointer group hover:-translate-y-2"
              >
                <div className="h-64 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors z-10"></div>
                  {cat.cover ? (
                    <img 
                      src={cat.cover} 
                      alt={cat.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-green-100 flex items-center justify-center">
                      <cat.icon size={64} className="text-orange-300/50" />
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="bg-white/90 px-3 py-1 rounded-lg text-xs font-bold text-orange-600 uppercase mb-2 inline-block shadow-sm">
                      View Gallery
                    </span>
                    <h3 className="text-2xl font-bold text-white drop-shadow-md">{cat.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {activeCategory && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-10 overflow-y-auto"
            >
              <button 
                onClick={() => setActiveCategory(null)}
                className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-50"
              >
                <X size={32} />
              </button>

              <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.find(c => c.id === activeCategory)?.images.map((img, idx, arr) => {
                  // Dynamic split: half from left, half from right. For 7 images: 3 left, 4 right.
                  const splitIndex = Math.floor(arr.length / 2);
                  return (
                    <motion.div
                      key={idx}
                      initial={{ x: idx < splitIndex ? -1000 : 1000, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: idx < splitIndex ? -1000 : 1000, opacity: 0 }}
                      transition={{ type: "spring", damping: 25, stiffness: 120, delay: idx * 0.05 }}
                      className="aspect-[4/3] rounded-xl overflow-hidden relative"
                    >
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                    </motion.div>
                  );
                })}
                {categories.find(c => c.id === activeCategory)?.images.length === 0 && (
                  <div className="col-span-full text-center text-white py-20">
                    <p className="text-2xl font-light">Photos coming soon...</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* GUEST GUIDE (TIMINGS & RULES) */}
      <section id="info" className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-center text-4xl font-bold text-gray-800 mb-16">
          Guest <span className="text-green-600">Guide</span>
        </h2>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Timings Card */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 bg-orange-100 rounded-bl-3xl">
              <Clock className="text-orange-500" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Resort Timings</h3>
            <div className="space-y-4">
              {TIMINGS.map((t, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0">
                  <span className="font-semibold text-gray-600">{t.title}</span>
                  <span className="text-green-600 font-bold text-right text-sm sm:text-base">{t.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Policies Card */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 bg-red-50 rounded-bl-3xl">
              <Info className="text-red-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Important Policies</h3>
            <ul className="space-y-4">
              {RULES.slice(0, 4).map((rule, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-gray-600">
                  <div className="min-w-[6px] h-[6px] rounded-full bg-orange-400 mt-2"></div>
                  {rule}
                </li>
              ))}
              <li className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100 text-sm text-red-700 flex gap-3">
                <AlertCircle className="shrink-0" size={20} />
                <div>
                  <span className="font-bold block mb-1">Cancellation Policy</span>
                  100% cancellation charges if cancelled within 7 days of check-in date. Non-refundable during long weekends & festivals.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FOOTER / CONTACT */}
      <footer id="contact" className="bg-gray-900 text-white pt-20 pb-10 rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-2">
              <h3 className="text-3xl font-bold text-white mb-2">DSK <span className="text-orange-500">Farm</span></h3>
              <p className="text-gray-400 mb-6">Managed by Hempushpa Farm</p>
              <p className="text-gray-300 leading-relaxed max-w-md">
                Whether you're looking for a peaceful getaway, a fun-filled family gathering, or a corporate retreat, we’re here to make your experience unforgettable.
              </p>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6">Contact Us</h4>
              <div className="space-y-4">
                <a href={`tel:${CONTACT_INFO.phone1}`} className="flex items-center gap-3 text-gray-300 hover:text-orange-400 transition-colors">
                  <Phone size={18} /> {CONTACT_INFO.phone1}
                </a>
                <a href={`tel:${CONTACT_INFO.phone2}`} className="flex items-center gap-3 text-gray-300 hover:text-orange-400 transition-colors">
                  <Phone size={18} /> {CONTACT_INFO.phone2}
                </a>
                <a href={`tel:${CONTACT_INFO.phone3}`} className="flex items-center gap-3 text-gray-300 hover:text-orange-400 transition-colors">
                  <Phone size={18} /> {CONTACT_INFO.phone3}
                </a>
                <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-orange-400 transition-colors">
                  <Instagram size={18} /> {CONTACT_INFO.socialHandle}
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-6">Location</h4>
              <p className="text-gray-300 mb-4 text-sm">
                DSK Farm by Hempushpa Farms<br />
                Tal-Maval, Dist-Pune
              </p>
              <a 
                href={CONTACT_INFO.locationLink} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
              >
                <MapPin size={16} /> Get Directions
              </a>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} DSK Agritourism. All rights reserved. 
              <span className="hidden sm:inline"> | </span> 
              <br className="sm:hidden" />
              Designed to be Jollyful & Exciting!
            </p>
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="mt-4 text-xs text-gray-500 hover:text-orange-500 flex items-center justify-center gap-1 mx-auto transition-colors"
            >
              <Shield size={12} />
              Owner Login
            </button>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {isBookingOpen && (
          <BookingModal 
            onClose={() => setIsBookingOpen(false)} 
            categories={categories} 
            bookings={bookings}
            onSubmit={async (newBooking) => {
              // 1. Update Local State (Optimistic)
              setBookings(prev => [newBooking, ...prev]);

              // 2. Insert into Supabase
              const { data, error } = await supabase.from('bookings').insert([{
                // id: newBooking.id, // Let Supabase generate the ID
                user_name: newBooking.userName,
                user_phone: newBooking.userPhone,
                check_in: newBooking.checkIn,
                check_out: newBooking.checkOut,
                check_in_time: newBooking.checkInTime,
                check_out_time: newBooking.checkOutTime,
                room_type: newBooking.roomType,
                status: newBooking.status,
                price: newBooking.price,
                number_of_rooms: newBooking.numberOfRooms
              }]).select();

              if (error) {
                console.error('Error saving booking:', error);
                alert("Error saving to database: " + error.message);
              } else if (data && data[0]) {
                // 3. Update local state with the REAL ID from database (so you can confirm/decline immediately)
                setBookings(prev => prev.map(b => b.id === newBooking.id ? { ...b, id: data[0].id.toString() } : b));
              }
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
