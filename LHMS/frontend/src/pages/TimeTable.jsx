import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from "../components/Nav";
import Footer from "../sections/Footer";
import Calendar from "../components/Calendar";
import Input from "../components/Input";
import Button from "../components/Button";
import { lectureHalls, timeSlots, initialModules } from "../constants";

const Timetable = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedModule, setSelectedModule] = useState("");
  
  // Empty bookings array
  const [bookings, setBookings] = useState([]);
  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setSelectedModule("");
  };
  
  const handleSlotClick = (hall, timeSlot) => {
    setSelectedSlot({ hall, timeSlot });
  };
  
  const handleBook = () => {
    const isLoggedIn = false; // This would come from your auth context
    
    if (!isLoggedIn) {
      navigate('/signin');
      return;
    }
    
    if (!selectedModule) {
      alert("Please select a module");
      return;
    }
    
    if (!selectedSlot) {
      alert("Please select a time slot");
      return;
    }
    
    // Add the booking
    const newBooking = {
      hall: selectedSlot.hall,
      timeSlot: selectedSlot.timeSlot,
      date: selectedDate,
      moduleCode: selectedModule
    };
    
    setBookings([...bookings, newBooking]);
    alert(`Booked ${selectedSlot.hall} for ${selectedSlot.timeSlot} with module ${selectedModule}`);
    
    // Reset form
    setSelectedSlot(null);
    setSelectedModule("");
  };
  
  const isSlotBooked = (hall, timeSlot) => {
    return bookings.some(booking => 
      booking.hall === hall && 
      booking.timeSlot === timeSlot && 
      booking.date.toDateString() === selectedDate.toDateString()
    );
  };
  
  const getBookingDetails = (hall, timeSlot) => {
    const booking = bookings.find(b => 
      b.hall === hall && 
      b.timeSlot === timeSlot && 
      b.date.toDateString() === selectedDate.toDateString()
    );
    
    return booking ? booking.moduleCode : '';
  };

  return (
    <main className="relative min-h-screen">
      <Nav />
      
      <div className="pt-28 padding-x padding-b">
        <div className="max-container pt-20 mt-5">
          {/* Header Section with Calendar and Booking Form */}
          <div className="flex flex-col lg:flex-row gap-8 mb-8 items-start">
            {/* Booking Form - Fixed width */}
            <div className="w-full lg:w-96 bg-white rounded-3xl shadow-3xl p-6">
              <h2 className="font-palanquin text-2xl font-bold text-primary mb-6">Book Lecture Hall</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block font-montserrat text-lg text-slate-gray mb-2">Selected Date</label>
                  <p className="font-montserrat text-md bg-neutral p-3 rounded-lg">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      day: 'numeric',
                      month: 'long', 
                      year: 'numeric'
                    })}
                  </p>
                </div>
                
                {selectedSlot && (
                  <div>
                    <label className="block font-montserrat text-lg text-slate-gray mb-2">Selected Slot</label>
                    <p className="font-montserrat text-md bg-neutral p-3 rounded-lg">
                      Hall: {selectedSlot.hall}<br />
                      Time: {selectedSlot.timeSlot}
                    </p>
                  </div>
                )}
                
                <div>
                  <label htmlFor="module" className="block font-montserrat text-lg text-slate-gray mb-2">Select Module</label>
                  <select
                    id="module"
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-red font-montserrat"
                  >
                    <option value="">Select a module</option>
                    {initialModules.map(module => (
                      <option key={module.id} value={module.code}>
                        {module.name} ({module.code})
                      </option>
                    ))}
                  </select>
                </div>
                
                <Button
                  label="Book"
                  className="w-full rounded-lg py-3 px-4 hover:bg-opacity-90 transition-all duration-300 border-none font-medium"
                  onClick={handleBook}
                />
              </div>
            </div>

            {/* Calendar - Takes remaining space */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <Calendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
              </div>
            </div>
          </div>

          {/* Timetable - Full Width */}
          <div>
            <div className="bg-white rounded-3xl shadow-3xl p-6">
              <h3 className="font-palanquin text-2xl font-bold mb-6 text-center text-primary">
                Lecture Hall Timetable - {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-max">
                  <thead>
                    <tr>
                      <th className="p-3 border border-neutral font-palanquin font-bold bg-primary text-neutral text-sm min-w-[120px]">
                        Time
                      </th>
                      {lectureHalls.map(hall => (
                        <th key={hall} className="p-3 border border-neutral font-palanquin font-bold bg-primary text-neutral text-xs min-w-[100px]">
                          {hall}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map(timeSlot => (
                      <tr key={timeSlot}>
                        <td className="p-3 border border-neutral font-montserrat font-bold bg-neutral text-sm min-w-[120px]">
                          {timeSlot}
                        </td>
                        {lectureHalls.map(hall => {
                          const isBooked = isSlotBooked(hall, timeSlot);
                          const moduleCode = getBookingDetails(hall, timeSlot);
                          
                          return (
                            <td 
                              key={`${hall}-${timeSlot}`}
                              className={`p-3 border border-neutral text-center cursor-pointer text-xs
                                ${isBooked 
                                  ? 'bg-coral-red text-white' 
                                  : 'hover:bg-neutral'}`}
                              onClick={() => handleSlotClick(hall, timeSlot)}
                              title={isBooked ? `Booked: ${moduleCode}` : `Click to book ${hall} for ${timeSlot}`}
                            >
                              {isBooked ? moduleCode : 'Available'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex items-center justify-center space-x-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-coral-red mr-2 rounded-sm"></div>
                  <span className="font-montserrat text-sm">Booked</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-white border border-neutral mr-2"></div>
                  <span className="font-montserrat text-sm">Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
};

export default Timetable;