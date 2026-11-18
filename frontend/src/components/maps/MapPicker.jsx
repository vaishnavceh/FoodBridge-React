import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Navigation, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

// Fix for default Leaflet icon paths in Vite / React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

export const MapPicker = ({ value, onChange }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default coordinates: Kerala (from original project: 9.2644, 76.5133)
      const initialLat = 9.2644;
      const initialLng = 76.5133;

      const map = L.map(mapContainerRef.current, {
        zoomControl: false
      }).setView([initialLat, initialLng], 13);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CartoDB',
        maxZoom: 19
      }).addTo(map);

      // Handle map clicks
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setMarker(lat, lng, map);
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const setMarker = (lat, lng, mapInstance = mapInstanceRef.current) => {
    if (!mapInstance) return;

    if (markerRef.current) {
      mapInstance.removeLayer(markerRef.current);
    }

    markerRef.current = L.marker([lat, lng]).addTo(mapInstance);
    const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    onChange(mapUrl);
  };

  const handleSyncGps = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 16);
          setMarker(latitude, longitude);
          toast.success('GPS coordinates locked successfully!');
        }
        setGpsLoading(false);
      },
      (error) => {
        toast.error(`GPS Error: ${error.message}`);
        setGpsLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="relative w-full h-[340px] rounded-2xl overflow-hidden border border-white/10 shadow-inner group">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* GPS Sync Overlay Button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          type="button"
          onClick={handleSyncGps}
          disabled={gpsLoading}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-black px-4 py-2.5 rounded-xl font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-sky-500/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
        >
          <Navigation className={`w-4 h-4 ${gpsLoading ? 'animate-spin' : ''}`} />
          {gpsLoading ? 'LOCATING...' : 'SYNC GPS'}
        </button>
      </div>

      {/* Helper text overlay */}
      <div className="absolute bottom-3 left-4 z-20 pointer-events-none">
        <span className="text-[11px] font-semibold text-slate-400 bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-sky-400" />
          Click anywhere on the map or sync GPS
        </span>
      </div>
    </div>
  );
};

export default MapPicker;
