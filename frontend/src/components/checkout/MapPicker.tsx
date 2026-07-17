import { useEffect, useRef, useState } from 'react'; 

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

// Free Google Maps via the Maps JavaScript API (key in .env)
// VITE_GOOGLE_MAPS_API_KEY=your_key
// Free tier: $200/mo credit — enough for ~28,000 map loads
export default function MapPicker({ onLocationSelect }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) return;
    if (window.google?.maps) { initMap(); return; }

    const existing = document.getElementById('gmaps-script');
    if (existing) { existing.addEventListener('load', initMap); return; }

    const script = document.createElement('script');
    script.id = 'gmaps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);
  }, [apiKey]);

  const initMap = () => {
    if (!mapRef.current || mapInstance.current) return;
    const defaultCenter = { lat: 19.076, lng: 72.877 }; // Mumbai

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 14,
      disableDefaultUI: true,
      zoomControl: true,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#0b1220' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#050816' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
        { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#050816' }] },
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
      ],
    });

    markerRef.current = new window.google.maps.Marker({
      map: mapInstance.current,
      position: defaultCenter,
      draggable: true,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#ff4d6d',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 2,
      },
    });

    geocoderRef.current = new window.google.maps.Geocoder();

    markerRef.current.addListener('dragend', () => {
      const pos = markerRef.current.getPosition();
      reverseGeocode(pos.lat(), pos.lng());
    });

    mapInstance.current.addListener('click', (e: any) => {
      markerRef.current.setPosition(e.latLng);
      reverseGeocode(e.latLng.lat(), e.latLng.lng());
    });

    setLoaded(true);
    reverseGeocode(defaultCenter.lat, defaultCenter.lng);
  };

  const reverseGeocode = (lat: number, lng: number) => {
    if (!geocoderRef.current) return;
    setLoading(true);
    geocoderRef.current.geocode(
      { location: { lat, lng } },
      (results: any[], status: string) => {
        setLoading(false);
        if (status === 'OK' && results[0]) {
          const addr = results[0].formatted_address;
          setAddress(addr);
          onLocationSelect(lat, lng, addr);
        }
      }
    );
    console.log(loaded)
  };

  const locateMe = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = { lat: coords.latitude, lng: coords.longitude };
        mapInstance.current?.setCenter(pos);
        mapInstance.current?.setZoom(16);
        markerRef.current?.setPosition(pos);
        reverseGeocode(pos.lat, pos.lng);
      },
      () => setLoading(false)
    );
  };

  if (!apiKey) {
    return (
      <div className="rounded-2xl border border-white/8 bg-white/3 p-6 text-center">
        <div className="text-3xl mb-3">🗺️</div>
        <p className="text-gray-400 text-sm">Add <code className="text-[#ff4d6d]">VITE_GOOGLE_MAPS_API_KEY</code> to <code className="text-white">.env</code> to enable map picker.</p>
        <p className="text-gray-600 text-xs mt-2">Free tier: $200/month credit from Google</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-white/8">
      {/* Map */}
      <div ref={mapRef} className="w-full h-[220px] bg-[#0b1220]" />

      {/* Controls */}
      <div className="bg-[rgba(11,18,32,0.95)] border-t border-white/6 p-3 flex items-center gap-3">
        <div className="flex-1 text-xs text-gray-400 truncate">
          {loading ? (
            <span className="flex items-center gap-2 text-gray-500">
              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Locating...
            </span>
          ) : address ? (
            <span className="text-gray-300">{address}</span>
          ) : (
            <span className="text-gray-600">Click map or drag pin to set location</span>
          )}
        </div>
        <button
          onClick={locateMe}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ff4d6d]/15 border border-[#ff4d6d]/25 text-[#ff4d6d] text-xs font-semibold transition-all hover:bg-[#ff4d6d]/25 shrink-0"
          style={{ fontFamily: 'Sora,sans-serif' }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3m10-10h-3M5 12H2"/>
          </svg>
          Locate Me
        </button>
      </div>
    </div>
  );
}
