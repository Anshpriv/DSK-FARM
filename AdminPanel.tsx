import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Lock, 
  Phone, 
  Calendar, 
  Home, 
  LogOut,
  AlertCircle 
} from 'lucide-react';
import qrCode from './farm/qr.jpg';


export type RoomType = string;

export interface BookingRequest {
  id: string;
  userName: string;
  userPhone: string;
  checkIn: string;
  checkOut: string;
  checkInTime?: string;
  checkOutTime?: string;
  roomType: RoomType;
  status: 'pending' | 'confirmed' | 'declined';
  numberOfRooms?: number;
  price?: number;
  discount?: number;
}


interface AdminPanelProps {
  onBack?: () => void;
  bookings: BookingRequest[];
  onUpdateStatus: (id: string, status: 'confirmed' | 'declined', discount?: number) => void;
}

export default function AdminPanel({ onBack, bookings, onUpdateStatus }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [discountInputs, setDiscountInputs] = useState<{[key:string]: string}>({});

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    return `${d.toString().padStart(2, '0')}-${m.toString().padStart(2, '0')}-${y}`;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, verify this securely on the server
    if (password === '1') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid Password');
    }
  };

  const sendWhatsAppMessage = (phone: string, message: string) => {
    // Open WhatsApp Web/App with the pre-filled message
    const cleanPhone = phone.replace(/[^\d]/g, ''); // Remove spaces, +, -, etc.
    const encodedText = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, '_blank');
  };

  const handleConfirm = (id: string, discount: number) => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return;
    
    onUpdateStatus(id, 'confirmed', discount);

    const price = booking.price || 0;
    const finalPrice = price - discount;
    const advanceAmount = finalPrice / 2;
    const qrLink = `${window.location.origin}${qrCode}`;

    const message = `*Booking Confirmed!* ✅\n\nHello ${booking.userName},\nYour booking at DSK Farm is confirmed.\n\n*Details:*\nRoom: ${booking.roomType}\nDates: ${booking.checkIn} to ${booking.checkOut}\n\n*Payment Breakdown:*\nTotal Amount: ₹${price.toLocaleString('en-IN')}\nDiscount: ₹${discount.toLocaleString('en-IN')}\n*Final Payable: ₹${finalPrice.toLocaleString('en-IN')}*\n\n*Please pay 50% advance (₹${advanceAmount.toLocaleString('en-IN')}) to confirm.*\n\n*Payment Options:*\nUPI ID: manojwani130974-2@okaxis\n\n*Scan QR Code via Link:*\n${qrLink}`;
    sendWhatsAppMessage(booking.userPhone, message);
  };

  const handleDecline = (id: string) => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return;

    onUpdateStatus(id, 'declined');

    // Send Rejection WhatsApp
    const message = `Hello ${booking.userName}, Sorry to say, but bookings are unavailable right now.`;
    sendWhatsAppMessage(booking.userPhone, message);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="flex justify-center mb-6 text-green-600">
            <Lock size={48} />
          </div>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Login
            </button>
          </form>
          {onBack && (
            <button
              onClick={onBack}
              className="w-full mt-4 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              ← Back to Website
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Home className="text-green-600" /> Farmhouse Admin
        </h1>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Booking Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                <tr>
                  <th className="px-6 py-4">Guest</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{booking.userName}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone size={14} /> {booking.userPhone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">{booking.roomType}</span>
                        <div className="text-gray-500 flex items-center gap-1 mt-1">
                          <Calendar size={14} /> {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                        </div>
                        {booking.price && (
                          <div className="text-green-600 font-bold mt-1">₹{booking.price.toLocaleString('en-IN')}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'declined' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {booking.status === 'pending' ? (
                        <div className="flex justify-end gap-2">
                          <input 
                            type="number" 
                            placeholder="Discount ₹"
                            className="w-24 px-2 py-1 text-sm border border-gray-300 rounded outline-none focus:border-green-500"
                            value={discountInputs[booking.id] || ''}
                            onChange={(e) => setDiscountInputs({...discountInputs, [booking.id]: e.target.value})}
                          />
                          <button
                            onClick={() => handleConfirm(booking.id, Number(discountInputs[booking.id] || 0))}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            <Check size={16} /> Confirm
                          </button>
                          <button
                            onClick={() => handleDecline(booking.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 text-sm rounded hover:bg-red-200"
                          >
                            <X size={16} /> Decline
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle size={24} /> No requests found
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
