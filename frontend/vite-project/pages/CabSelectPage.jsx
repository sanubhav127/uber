import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

const CabSelectPage = () => {
  const { state } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const navigate = useNavigate();

  // ✅ Dynamic values from HomePage (fallback if user lands directly)
  const pickup = state?.pickup?.point
    ? { name: state.pickup.query, address: state.pickup.point.label }
    : { name: "Not selected", address: "" };

  const dropoff = state?.dropoff?.point
    ? { name: state.dropoff.query, address: state.dropoff.point.label }
    : { name: "Not selected", address: "" };

  const route = state?.route?.data || { distance: 0, time: 0 };

  // ✅ Ride options (fare depends on distance)
  const baseRates = {
    UberGo: 12, // ₹12 per km
    UberMoto: 7, // ₹7 per km
    UberAuto: 9, // ₹9 per km
    UberSUV: 18, // ₹18 per km
    UberRentals: 500, // hourly flat
  };

  const rides = [
    {
      id: 1,
      name: "UberGo",
      capacity: 4,
      time: "5 mins away",
      desc: "Affordable, compact rides",
      fare: (route.distance * baseRates.UberGo).toFixed(2),
      img: "/uberCar.png",
    },
    {
      id: 2,
      name: "UberMoto",
      capacity: 1,
      time: "3 mins away",
      desc: "Affordable, easy rides",
      fare: (route.distance * baseRates.UberMoto).toFixed(2),
      img: "/moto.png",
    },
    {
      id: 3,
      name: "UberAuto",
      capacity: 3,
      time: "2 mins away",
      desc: "Affordable, compact rides",
      fare: (route.distance * baseRates.UberAuto).toFixed(2),
      img: "/rickshaw.png",
    },
    {
      id: 4,
      name: "UberSUV",
      capacity: 6,
      time: "7 mins away",
      desc: "Best for long trips",
      fare: (route.distance * baseRates.UberSUV).toFixed(2),
      img: "/suv.png",
    },
    {
      id: 5,
      name: "UberRentals",
      capacity: 5,
      time: "10 mins away",
      desc: "Make your trip special",
      fare: `${baseRates.UberRentals}/hr`,
      img: "/rental.png",
    },
  ];

  const handleRideClick = (ride) => {
    setSelectedRide(ride);
    setIsOpen(true);
  };

  const handleConfirm = () => {
  navigate("/rideConfirm", {
    state: {
      ride: selectedRide,
      pickup,
      dropoff,
    },
  });
};

  const handleClose = () => setIsOpen(false);

  return (
    <div className="p-3 z-1 relative h-full">
      <div className="flex flex-col justify-between h-full max-w-screen space-y-3">
        <h1 className="font-medium text-2xl">Choose Your Ride</h1>

        {/* Ride List (dynamic) */}
        {rides.map((ride) => (
          <div
            key={ride.id}
            onClick={() => handleRideClick(ride)}
            className="h-20 border-2 flex items-center justify-start rounded mt-3 active:border-blue-700"
          >
            <img src={ride.img} className="h-13 object-cover" alt={ride.name} />
            <div className="w-1/2 flex flex-col justify-between ml-4">
              <div className="flex items-center justify-start gap-1">
                <h3 className="font-medium">{ride.name}</h3>
                <i className="ri-user-fill"></i>
                <h3>{ride.capacity}</h3>
              </div>
              <h3 className="font-medium">{ride.time}</h3>
              <p className="text-sm">{ride.desc}</p>
            </div>
            <h1 className="text-lg mr-2">₹{ride.fare}</h1>
          </div>
        ))}
      </div>

      {/* Bottom Sheet */}
      <div
        className={`fixed left-0 w-full bg-gray-100 h-120 z-10 transition-transform duration-500 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } bottom-0`}
      >
        {selectedRide && (
          <div className="flex flex-col justify-between">
            <div className="flex items-center justify-start pl-5 pt-4">
              <h1 className="font-medium text-xl">Confirm Your Ride</h1>
            </div>

            <div className="w-full flex items-center justify-center mt-6">
              <img
                src="/final.png"
                className="h-17 object-cover rounded-xl"
                alt="final"
              />
            </div>

            {/* Pickup */}
            <div className="flex items-center justify-start gap-3 mt-7">
              <h1 className="p-1 ml-2">
                <i className="ri-map-pin-4-fill"></i>
              </h1>
              <div className="p-2">
                <h2 className="font-medium">{pickup.name}</h2>
                <p className="text-sm">{pickup.address}</p>
              </div>
            </div>

            {/* Dropoff */}
            <div className="flex items-center justify-start gap-3">
              <h1 className="p-1 ml-2">
                <i className="ri-square-fill"></i>
              </h1>
              <div className="p-2">
                <h2 className="font-medium">{dropoff.name}</h2>
                <p className="text-sm">{dropoff.address}</p>
              </div>
            </div>

            {/* Fare */}
            <div className="flex items-center justify-start gap-3">
              <h1 className="p-1 ml-2">
                <i className="ri-cash-fill"></i>
              </h1>
              <div className="p-2">
                <h2 className="font-medium">₹{selectedRide.fare}</h2>
                <p className="text-sm">Cash</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-5 p-5">
              <button className="w-1/2 h-9 rounded-xl font-medium bg-green-400 p-4 flex items-center justify-center active:scale-90" onClick={handleConfirm}>
                Confirm
              </button>
              <button
                onClick={handleClose}
                className="w-1/2 h-9 rounded-xl font-medium bg-red-500 p-4 flex items-center justify-center active:scale-90"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CabSelectPage;