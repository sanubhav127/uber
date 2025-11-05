import React, { useState, useEffect, useRef, useCallback} from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { FiArrowLeft, FiLoader } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// --- ICON FIX (Corrected and Robust) ---
// Import images directly for webpack to handle, preventing the 'require is not defined' error.
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
// --- END ICON FIX ---

// Helper to decode GraphHopper's encoded polyline
function decodePolyline(encoded) {
    let points = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;
    while (index < len) {
        let b, shift = 0, result = 0;
        do {
            b = encoded.charAt(index++).charCodeAt(0) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += dlat;
        shift = 0;
        result = 0;
        do {
            b = encoded.charAt(index++).charCodeAt(0) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += dlng;
        points.push([lat / 1E5, lng / 1E5]);
    }
    return points;
}

// Component to auto-fit map bounds to the route
function ChangeView({ bounds }) {
    const map = useMap();
    useEffect(() => {
        if (bounds && bounds.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [bounds, map]);
    return null;
}

// Refactored Address Input component for reusability
const AddressInput = ({ label, value, onChange, onFocus, suggestions, onSelectSuggestion, isLoading }) => (
    <div className="relative">
        <label className="font-semibold text-gray-800">{label}</label>
        <div className="relative">
            <input
                type="text"
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                placeholder={`Enter ${label.toLowerCase()}...`}
                className="w-full p-3 bg-gray-100 border-2 border-transparent focus:border-blue-500 rounded-lg mt-1 outline-none transition-colors"
            />
            {isLoading && <FiLoader className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400" />}
        </div>
        {suggestions.length > 0 && (
            <ul className="absolute w-full bg-white border mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto z-20">
                {suggestions.map(s => (
                    <li key={s.properties.id} onClick={() => onSelectSuggestion(s)} className="p-3 cursor-pointer hover:bg-gray-100 text-gray-700">{s.properties.label}</li>
                ))}
            </ul>
        )}
    </div>
);

const Home = () => {
    const navigate = useNavigate();
    const [pickup, setPickup] = useState({ query: '', suggestions: [], point: null, loading: false });
    const [dropoff, setDropoff] = useState({ query: '', suggestions: [], point: null, loading: false });
    const [route, setRoute] = useState({ data: null, loading: false });
    const [error, setError] = useState(null);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const debounceTimeout = useRef(null);

    const handleSearch = useCallback((query, type) => {
        clearTimeout(debounceTimeout.current);
        if (query.length < 3) {
            const updater = type === 'pickup' ? setPickup : setDropoff;
            updater(prev => ({ ...prev, suggestions: [] }));
            return;
        }

        const updater = type === 'pickup' ? setPickup : setDropoff;
        updater(prev => ({ ...prev, loading: true }));

        debounceTimeout.current = setTimeout(async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/geocode?text=${query}`);
                if (!response.ok) throw new Error('Geocoding search failed.');
                const data = await response.json();
                updater(prev => ({ ...prev, suggestions: data.features || [], loading: false }));
            } catch (err) {
                setError(err.message);
                updater(prev => ({ ...prev, loading: false }));
            }
        }, 500);
    }, []);

    const handleSelectSuggestion = (suggestion, type) => {
        const [lng, lat] = suggestion.geometry.coordinates;
        const point = { lat, lng, label: suggestion.properties.label };
        if (type === 'pickup') {
            setPickup({ query: point.label, suggestions: [], point, loading: false });
            document.querySelector('input[placeholder="Enter drop-off location..."]').focus();
        } else {
            setDropoff({ query: point.label, suggestions: [], point, loading: false });
            setIsSearchActive(false);
        }
    };

    const handleClear = (type) => {
        if (type === 'pickup') {
            setPickup({ query: '', suggestions: [], point: null, loading: false });
        } else {
            setDropoff({ query: '', suggestions: [], point: null, loading: false });
        }
        setRoute({ data: null, loading: false }); // Clear route if any point is cleared
    };

    useEffect(() => {
        if (pickup.point && dropoff.point) {
            const fetchRoute = async () => {
                setRoute({ data: null, loading: true });
                setError(null);
                const start = `${pickup.point.lat},${pickup.point.lng}`;
                const end = `${dropoff.point.lat},${dropoff.point.lng}`;
                try {
                    const response = await fetch(`http://localhost:3000/api/route?start=${start}&end=${end}`);
                    if (!response.ok) throw new Error('Failed to fetch the route.');
                    const data = await response.json();
                    if (data.paths && data.paths.length > 0) {
                        const path = data.paths[0];
                        setRoute({
                            data: {
                                polyline: decodePolyline(path.points),
                                distance: (path.distance / 1000).toFixed(2),
                                time: (path.time / 60000).toFixed(0)
                            },
                            loading: false
                        });
                    } else {
                        throw new Error(data.message || "No route found.");
                    }
                } catch (err) {
                    setError(err.message);
                    setRoute({ data: null, loading: false });
                }
            };
            fetchRoute();
        }
    }, [pickup.point, dropoff.point]);

    const mapBounds = route.data ? L.latLngBounds(route.data.polyline) : null;

    return (
        <div className="relative h-screen w-screen overflow-hidden font-sans">
            <div className="absolute inset-0 z-0">
                <MapContainer center={[26.8467, 80.9462]} zoom={12} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                    {pickup.point && <Marker position={[pickup.point.lat, pickup.point.lng]} />}
                    {dropoff.point && <Marker position={[dropoff.point.lat, dropoff.point.lng]} />}
                    {route.data && <Polyline positions={route.data.polyline} color="#2563eb" weight={6} />}
                    {mapBounds && <ChangeView bounds={mapBounds} />}
                </MapContainer>
            </div>

            <div className={`absolute inset-x-0 bottom-0 z-10 bg-white shadow-2xl rounded-t-2xl transition-transform duration-500 ease-in-out ${isSearchActive ? 'translate-y-0 h-full' : 'translate-y-[calc(100%-280px)] md:translate-y-[calc(100%-250px)]'}`}>
                <div className="p-4 flex flex-col h-full">
                    {isSearchActive && <button onClick={() => setIsSearchActive(false)} className="self-start mb-2 p-2"><FiArrowLeft size={24} className="text-gray-700" /></button>}
                    <h2 className="text-xl font-bold">Find a Ride</h2>

                    <div className="space-y-4 mt-3">
                        <AddressInput label="Pickup Location" value={pickup.query} 
                            onChange={(e) => { setPickup(p => ({ ...p, query: e.target.value })); handleSearch(e.target.value, 'pickup'); }}
                            onFocus={() => setIsSearchActive(true)} suggestions={pickup.suggestions}
                            onSelectSuggestion={(s) => handleSelectSuggestion(s, 'pickup')} isLoading={pickup.loading} />
                        
                        <AddressInput label="Drop-off Location" value={dropoff.query} 
                            onChange={(e) => { setDropoff(d => ({ ...d, query: e.target.value })); handleSearch(e.target.value, 'dropoff'); }}
                            onFocus={() => setIsSearchActive(true)} suggestions={dropoff.suggestions}
                            onSelectSuggestion={(s) => handleSelectSuggestion(s, 'dropoff')} isLoading={dropoff.loading} />
                    </div>
                    
                    {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>}

                    {isSearchActive && (
                        route.loading ? (
                            <div className="mt-6 flex justify-center items-center"><FiLoader className="animate-spin text-blue-600" size={32} /></div>
                        ) : route.data && (
                            <div className="p-4 mt-40 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in">
                                <h2 className="text-xl font-bold text-blue-800">Trip Details</h2>
                                <p className="text-lg mt-2"><strong>Distance:</strong> {route.data.distance} km</p>
                                <p className="text-lg"><strong>Estimated Time:</strong> {route.data.time} minutes</p>
                                <button className="w-full bg-black text-white font-medium py-3 rounded-lg mt-4 hover:bg-gray-800 transition-colors" onClick={()=>{navigate("/cabSelect", { state: { pickup, dropoff, route } })}}>Confirm Ride</button>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

// Simple fade-in animation for trip details
const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
}
`;
document.head.appendChild(style);

export default Home;