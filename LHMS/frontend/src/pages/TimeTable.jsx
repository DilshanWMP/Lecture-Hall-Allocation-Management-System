import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from "../components/Nav";
import Footer from "../sections/Footer";
import Calendar from "../components/Calendar";
import Input from "../components/Input";
import Button from "../components/Button";
import { timeSlots } from "../constants";
import axios from 'axios';

const Timetable = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedModule, setSelectedModule] = useState("");
  const [modules, setModules] = useState([]);
  const [lectureHalls, setLectureHalls] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
    
    if (!token) {
      setError('Please sign in to view timetable');
    }
  }, []);

  const api = axios.create({
    baseURL: 'http://localhost:8088/api'
  });

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 403) {
        setError('Access denied. Please check your permissions.');
      } else if (error.response?.status === 401) {
        setError('Session expired. Please sign in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        navigate('/signin');
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const [modulesResponse, lectureHallsResponse] = await Promise.all([
          axios.get('http://localhost:8088/api/modules'),
          axios.get('http://localhost:8088/api/lecturehalls')
        ]);
        
        setModules(modulesResponse.data);
        setLectureHalls(lectureHallsResponse.data);
        
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            const bookingsResponse = await api.get(`/bookings/date/${formattedDate}`);
            setBookings(bookingsResponse.data);
          } catch (bookingsError) {
            console.warn('Could not fetch bookings, continuing without them:', bookingsError);
            setBookings([]);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 403) {
          setError('You do not have permission to view this data.');
        } else {
          setError('Failed to load data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setSelectedModule("");
  };
  
  const handleSlotClick = (hallId, hallName, timeSlot) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please sign in to book a time slot');
      navigate('/signin');
      return;
    }
    
    const isBooked = isSlotBooked(hallId, timeSlot);
    if (isBooked) {
      setError('This time slot is already booked. Please select another.');
      return;
    }
    
    setSelectedSlot({ hallId, hallName, timeSlot });
    setError('');
    
  };
  
  const handleBook = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }
    
    if (!selectedModule) {
      setError("Please select a module");
      return;
    }
    
    if (!selectedSlot) {
      setError("Please select a time slot");
      return;
    }
    
    try {
      setLoading(true);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      const module = modules.find(m => m.moduleCode === selectedModule);
      if (!module) {
        setError("Selected module not found");
        return;
      }
      
      const bookingData = {
        moduleId: module.moduleId,
        hallId: selectedSlot.hallId,
        bookingDate: formattedDate,
        timeSlot: selectedSlot.timeSlot
      };
      
      const response = await api.post('/bookings', bookingData);
      
      setBookings([...bookings, response.data]);
      setSuccess(`Successfully booked ${selectedSlot.hallName} for ${selectedSlot.timeSlot} with module ${selectedModule}`);
      
      setSelectedSlot(null);
      setSelectedModule("");
      setError('');
      
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Error creating booking:', error);
      if (error.response?.status === 409) {
        setError('This time slot is already booked. Please select another.');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to create bookings.');
      } else {
        setError('Failed to create booking. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteBooking = async (bookingId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }
    
    if (!isAdmin) {
      setError('Only administrators can delete bookings.');
      return;
    }
    
    if (!window.confirm("Are you sure you want to delete this booking?")) {
      return;
    }
    
    try {
      await api.delete(`/bookings/${bookingId}`);
      
      setBookings(bookings.filter(booking => booking.bookingId !== bookingId));
      setSuccess('Booking deleted successfully');
      
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Error deleting booking:', error);
      if (error.response?.status === 403) {
        setError('You do not have permission to delete bookings.');
      } else {
        setError('Failed to delete booking. Please try again.');
      }
    }
  };
  
  const isSlotBooked = (hallId, timeSlot) => {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    return bookings.some(booking => 
      booking.lectureHall.hallId === hallId && 
      booking.timeSlot === timeSlot && 
      booking.bookingDate === formattedDate
    );
  };
  
  const getBookingDetails = (hallId, timeSlot) => {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    const booking = bookings.find(b => 
      b.lectureHall.hallId === hallId && 
      b.timeSlot === timeSlot && 
      b.bookingDate === formattedDate
    );
    
    return booking || null;
  };

  return (
    <main className="relative min-h-screen">
      <Nav />
      
      <div className="pt-28 padding-x padding-b">
        <div className="max-container pt-20 mt-5">
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}
          
          {!localStorage.getItem('token') && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg text-center">
              Please sign in to view and manage bookings
            </div>
          )}
          
          <div className="flex flex-col lg:flex-row gap-8 mb-8 items-start">
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
                      Hall: {selectedSlot.hallName}<br />
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
                    disabled={!localStorage.getItem('token')}
                  >
                    <option value="">Select a module</option>
                    {modules.map(module => (
                      <option key={module.moduleId} value={module.moduleCode}>
                        {module.moduleName} ({module.moduleCode})
                      </option>
                    ))}
                  </select>
                </div>
                
                <Button
                  label={loading ? "Booking..." : "Book"}
                  className="w-full rounded-lg py-3 px-4 hover:bg-opacity-90 transition-all duration-300 border-none font-medium disabled:opacity-50"
                  onClick={handleBook}
                  disabled={loading || !selectedSlot || !selectedModule || !localStorage.getItem('token')}
                />
                
                {!localStorage.getItem('token') && (
                  <p className="text-center text-slate-gray">
                    Please <button className="text-coral-red underline" onClick={() => navigate('/signin')}>sign in</button> to make bookings
                  </p>
                )}
              </div>
            </div>

            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <Calendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-3xl shadow-3xl p-6">
              <h3 className="font-palanquin text-2xl font-bold mb-6 text-center text-primary">
                Lecture Hall Timetable - {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              
              {loading ? (
                <div className="text-center py-8">
                  <p className="font-montserrat text-slate-gray">Loading timetable data...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-max">
                    <thead>
                      <tr>
                        <th className="p-3 border border-neutral font-palanquin font-bold bg-primary text-neutral text-sm min-w-[120px]">
                          Time
                        </th>
                        {lectureHalls.map(hall => (
                          <th key={hall.hallId} className="p-3 border border-neutral font-palanquin font-bold bg-primary text-neutral text-xs min-w-[100px]">
                            {hall.hallName}
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
                            const booking = getBookingDetails(hall.hallId, timeSlot);
                            const isBooked = !!booking;
                            
                            return (
                              <td 
                                key={`${hall.hallId}-${timeSlot}`}
                                className={`p-3 border border-neutral text-center text-xs
                                  ${isBooked 
                                    ? 'bg-coral-red text-white' 
                                    : 'hover:bg-neutral cursor-pointer'}`}
                                onClick={() => !isBooked && handleSlotClick(hall.hallId, hall.hallName, timeSlot)}
                                title={isBooked ? 
                                  `Booked: ${booking.module.moduleCode}` : 
                                  `Click to book ${hall.hallName} for ${timeSlot}`}
                              >
                                {isBooked ? (
                                  <div>
                                    <div>{booking.module.moduleCode}</div>
                                    {isAdmin && (
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteBooking(booking.bookingId);
                                        }}
                                        className="text-xs mt-1 bg-white text-coral-red px-1 rounded hover:bg-red-50"
                                        title="Delete booking"
                                      >
                                        ×
                                      </button>
                                    )}
                                  </div>
                                ) : 'Available'}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
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
              
              {!localStorage.getItem('token') && (
                <div className="mt-4 text-center text-slate-gray">
                  <p>Sign in to see existing bookings and make new ones</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
};

export default Timetable;