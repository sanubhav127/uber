import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

const RideConfirmPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const ride = state?.ride || {};
  const pickup = state?.pickup || {};
  const dropoff = state?.dropoff || {};

  return (
    <div className="p-5 h-full flex flex-col justify-between">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold mb-3">Your Ride is Confirmed ✅</h1>
        <p className="text-gray-600">Driver is on the way to pick you up.</p>
      </div>

      {/* Ride Info */}
      <div className="border rounded-xl p-4 mt-5 shadow">
        <div className="flex items-center gap-4">
          <img src={ride.img} alt={ride.name} className="h-16 object-cover" />
          <div>
            <h2 className="text-lg font-medium">{ride.name}</h2>
            <p className="text-sm text-gray-500">
              {ride.capacity} seats • ETA {ride.time}
            </p>
            <p className="text-lg font-semibold text-green-600">₹{ride.fare}</p>
          </div>
        </div>
      </div>

      {/* Driver Info */}
      <div className="border rounded-xl p-4 mt-5 shadow">
        <div className="flex items-center gap-4">
          <img
            src="/driver.jpg"
            alt="Driver"
            className="h-14 w-14 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-medium">Amit Sharma</h2>
            <p className="text-sm text-gray-500">Maruti Suzuki Swift • UP 32 DH 0961</p>
            <p className="text-sm font-semibold text-blue-600">⭐ 4.8 (256 rides)</p>
          </div>
        </div>
      </div>

      {/* Pickup & Dropoff */}
      <div className="mt-5">
        <div className="flex items-center gap-3 mb-3">
          <i className="ri-map-pin-4-fill text-red-500"></i>
          <div>
            <h3 className="font-medium">{pickup.name}</h3>
            <p className="text-sm text-gray-600">{pickup.address}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <i className="ri-square-fill text-green-500"></i>
          <div>
            <h3 className="font-medium">{dropoff.name}</h3>
            <p className="text-sm text-gray-600">{dropoff.address}</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => navigate("/home")}
          className="w-1/2 bg-gray-300 p-3 rounded-xl font-medium active:scale-95"
        >
          Cancel Ride
        </button>
        <button
          onClick={() => alert("Driver Contacted")}
          className="w-1/2 bg-green-500 text-white p-3 rounded-xl font-medium active:scale-95"
        >
          Call Driver
        </button>
      </div>
    </div>
  );
};

export default RideConfirmPage;