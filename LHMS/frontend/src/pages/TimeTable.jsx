import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from "../components/Nav";
import Footer from "../sections/Footer";
import Calendar from "../components/Calendar";
import { lectureHalls, timeSlots } from "../constants";

const Timetable = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  // Mock data for bookings
  const [bookings, setBookings] = useState([
    { hall: "LT1 (300)", timeSlot: "8:00 - 8:55", date: new Date(2025, 8, 3), bookedBy: "Dr. Smith", course: "EES204" },
    { hall: "NLH1 (130)", timeSlot: "9:50 - 10:45", date: new Date(2025, 8, 3), bookedBy: "Prof. Johnson", course: "CS301" },
    { hall: "DO1 (140)", timeSlot: "14:25 - 15:20", date: new Date(2025, 8, 3), bookedBy: "Dr. Brown", course: "MATH202" },
  ]);
  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };
  
  const handleSlotClick = (hall, timeSlot) => {
    const isLoggedIn = false;
    if (!isLoggedIn) {
      navigate('/signin');
      return;
    }
    
    const isBooked = bookings.some(booking => 
      booking.hall === hall && 
      booking.timeSlot === timeSlot && 
      booking.date.toDateString() === selectedDate.toDateString()
    );
    
    if (!isBooked) {
      setSelectedSlot({ hall, timeSlot });
    }
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
    
    return booking ? `${booking.course} - ${booking.bookedBy}` : '';
  };

  return (
    <main className="relative min-h-screen">
      <Nav />
      
      <div className="pt-28 padding-x padding-b">
        <div className="max-container pt-20">
          {/* Header Section with Calendar and Selected Date */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">

            {/* Calendar - Top Right Side */}
            <div className="lg:w-2/3 flex justify-end">
              <div className="w-full max-w-sm">
                <Calendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
              </div>
            </div>
          </div>

          {/* Full Width Timetable */}
          <div className="w-full">
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
                          const bookingDetails = getBookingDetails(hall, timeSlot);
                          
                          return (
                            <td 
                              key={`${hall}-${timeSlot}`}
                              className={`p-3 border border-neutral text-center cursor-pointer text-xs
                                ${isBooked 
                                  ? 'bg-coral-red text-white' 
                                  : 'hover:bg-neutral'}`}
                              onClick={() => handleSlotClick(hall, timeSlot)}
                              title={isBooked ? bookingDetails : `Click to book ${hall} for ${timeSlot}`}
                            >
                              {isBooked ? (
                                <div className="flex flex-col">
                                  <span className="font-bold">Booked</span>
                                  <span className="text-[10px] mt-1">
                                    {getBookingDetails(hall, timeSlot).split(' - ')[0]}
                                  </span>
                                </div>
                              ) : (
                                'Available'
                              )}
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