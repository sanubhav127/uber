import React, { useEffect, useState } from 'react'
import { LoaderCircle } from "lucide-react";
import axios from "axios";
import { logout } from './functions/logout';
import { FiMapPin, FiNavigation, FiPhone, FiUser, FiX } from 'react-icons/fi';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const mockRideRequest = {
  id: 'req123',
  passenger: {
    name: 'Aarav Sharma',
    rating: 4.8,
    pickup: 'Hazratganj, Lucknow',
    destination: 'Gomti Nagar, Lucknow',
  },
  fare: 250,
  duration: 15, // in minutes
};

const mockCurrentTrip = {
  id: 'trip456',
  passenger: {
    name: 'Priya Singh',
    avatar: 'https://i.pravatar.cc/150?u=priya',
  },
  destination: 'Lucknow Amausi Airport',
  pickup: 'Indira Nagar, Lucknow',
};

const center = [26.8467, 80.9462];

const CapHome = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [rideRequest, setRideRequest] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [requestTimer, setRequestTimer] = useState(30);
  const [driverLocation, setDriverLocation] = useState(center);

    useEffect(() => {
    if (isOnline) {
      const timer = setTimeout(() => {
        setRideRequest(mockRideRequest);
        setRequestTimer(30); // Reset timer
      }, 5000); // New request after 5 seconds of going online
      return () => clearTimeout(timer);
    } else {
      setRideRequest(null);
    }
  }, [isOnline]);

  // Countdown timer for ride request
  useEffect(() => {
    if (rideRequest && requestTimer > 0) {
      const timer = setInterval(() => {
        setRequestTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (rideRequest && requestTimer === 0) {
      handleRejectRide(); // Auto-reject when timer runs out
    }
  }, [rideRequest, requestTimer]);

   useEffect(() => {
    if (isOnline) {
      // In a real app, use navigator.geolocation.watchPosition
      const interval = setInterval(() => {
        setDriverLocation(prev => ([
          prev[0] + 0.0001, // latitude
          prev[1] + 0.0001, // longitude
        ]));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isOnline]);


  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
    setRideRequest(null);
    setCurrentTrip(null);
  };

  const handleAcceptRide = () => {
    setCurrentTrip({
      id: rideRequest.id,
      passenger: { name: rideRequest.passenger.name, avatar: `https://i.pravatar.cc/150?u=${rideRequest.passenger.name}` },
      destination: rideRequest.passenger.destination,
      pickup: rideRequest.passenger.pickup,
    });
    setRideRequest(null);
  };

  const handleRejectRide = () => {
    setRideRequest(null);
  };

  const handleEndTrip = () => {
    // In a real app, you'd show a summary screen here
    alert('Trip Ended! You earned ₹' + mockRideRequest.fare);
    setCurrentTrip(null);
  };


  return (
    <>
 <div className="relative h-screen w-screen bg-gray-200 text-black flex flex-col overflow-hidden">
      
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-gray-700 via-gray-300 to-transparent">
        <h1 className="text-xl font-bold">Driver Mode</h1>
        <div className="flex items-center gap-4">
          <span className={`font-semibold ${isOnline ? 'text-green-400' : 'text-gray-400'}`}>
            {isOnline ? 'You are Online' : 'You are Offline'}
          </span>
          <label htmlFor="online-toggle" className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id="online-toggle" className="sr-only peer" checked={isOnline} onChange={handleToggleOnline} />
            <div className="w-14 h-8 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
      </header>

      {/* Map Placeholder */}
     <div className="flex-grow z-0">
        <MapContainer 
          center={driverLocation} 
          zoom={15} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true} // Enable scroll wheel zoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={driverLocation}>
            <Popup>
              You are here.
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Panels - Conditional Rendering */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
        {!isOnline && (
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg">
            <h2 className="text-2xl font-bold mb-2">Go Online to Start Receiving Trips</h2>
            <p className="text-gray-400">Toggle the switch in the top right corner to start your day.</p>
          </div>
        )}
        
        {isOnline && !rideRequest && !currentTrip && (
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg animate-pulse">
            <h2 className="text-2xl font-bold">Searching for riders...</h2>
            <p className="text-gray-400">You will be notified when a new trip is available.</p>
          </div>
        )}

        {/* Ride Request Panel */}
        {rideRequest && (
          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-blue-500 animate-fade-in-up">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-blue-400">New Ride Request</h2>
                <p className="text-white">Accept within {requestTimer}s</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-extrabold text-white">₹{rideRequest.fare}</p>
                <p className="text-white">{rideRequest.duration} min trip</p>
              </div>
            </div>
            <div className="my-4 border-t border-gray-700"></div>
            <div className="space-y-3 text-lg font-medium text-white">
              <div className="flex items-center gap-3">
                <FiUser className="text-green-400" />
                <span>{rideRequest.passenger.name} ({rideRequest.passenger.rating} ★)</span>
              </div>
              <div className="flex items-center gap-3">
                <FiMapPin className="text-blue-400" />
                <strong>Pickup:</strong> {rideRequest.passenger.pickup}
              </div>
               <div className="flex items-center gap-3">
                <FiNavigation className="text-purple-400" />
                <strong>Drop:</strong> {rideRequest.passenger.destination}
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button onClick={handleRejectRide} className="bg-red-500/80 hover:bg-red-500 transition-colors w-full p-4 rounded-lg text-lg font-bold flex items-center justify-center gap-2">
                <FiX /> Reject
              </button>
              <button onClick={handleAcceptRide} className="bg-green-500/80 hover:bg-green-500 transition-colors w-full p-4 rounded-lg text-lg font-bold flex items-center justify-center gap-2">
                Accept Ride
              </button>
            </div>
          </div>
        )}

        {/* Current Trip Panel */}
        {currentTrip && (
           <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-green-500 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-green-400">On Trip</h2>
                    <p className="text-gray-400">Heading to {currentTrip.destination}</p>
                </div>
                <img src={currentTrip.passenger.avatar} alt="Passenger" className="w-16 h-16 rounded-full border-2 border-gray-600"/>
            </div>
            <div className="my-4 border-t border-gray-700"></div>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-lg font-semibold">{currentTrip.passenger.name}</p>
                    <p className="text-sm text-gray-400">Pickup: {currentTrip.pickup}</p>
                </div>
                <button className="bg-blue-500 p-4 rounded-full hover:bg-blue-600 transition-colors">
                    <FiPhone size={20} />
                </button>
            </div>
            <div className="mt-6">
                <button onClick={handleEndTrip} className="bg-red-600 hover:bg-red-700 transition-colors w-full p-4 rounded-lg text-lg font-bold">
                    End Trip
                </button>
            </div>
           </div>
        )}
      </div>
    </div>
    </>
  );
}

export default CapHome
