import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, RefreshCw, Keyboard, Play, Pause } from 'lucide-react';
import { GoogleMap, LoadScript, Marker, Polyline, InfoWindow } from '@react-google-maps/api';

interface Location {
  lat: number;
  lng: number;
  label: string;
  status: string;
  timestamp: string;
}

const TrackingMap = () => {
  const { orderNumber } = useParams<{ orderNumber?: string }>();
  const navigate = useNavigate();
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [libraries] = useState<("places" | "geometry")[]>(["places", "geometry"]);
  const [selectedMarker, setSelectedMarker] = useState<Location | null>(null);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const packageMarkerRef = useRef<google.maps.Marker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const replayStartTimeRef = useRef<number | null>(null);
  const replayDurationRef = useRef(0);
  const lastFrameTimeRef = useRef<number | null>(null);

  const shipmentRoute: Location[] = [
    {
      lat: 40.7128,
      lng: -74.0060,
      label: 'New York Distribution Center',
      status: 'Package received',
      timestamp: 'Feb 27, 2025 9:15 AM EST'
    },
    {
      lat: 41.8781,
      lng: -87.6298,
      label: 'Chicago Sorting Facility',
      status: 'In transit',
      timestamp: 'Feb 28, 2025 3:45 PM CST'
    },
    {
      lat: 36.1699,
      lng: -115.1398,
      label: 'Las Vegas Delivery Center',
      status: 'Out for delivery',
      timestamp: 'Mar 1, 2025 10:30 AM PST'
    }
  ];

  const mapContainerStyle = {
    width: '100%',
    height: '600px',
    borderRadius: '0.5rem'
  };

  const mapOptions = {
    styles: [
      {
        elementType: "geometry",
        stylers: [{ color: "#242f3e" }]
      },
      {
        elementType: "labels.text.stroke",
        stylers: [{ color: "#242f3e" }]
      },
      {
        elementType: "labels.text.fill",
        stylers: [{ color: "#746855" }]
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }]
      }
    ],
    disableDefaultUI: true,
    zoomControl: true
  };

  const interpolatePosition = (startPos: Location, endPos: Location, fraction: number) => {
    return {
      lat: startPos.lat + (endPos.lat - startPos.lat) * fraction,
      lng: startPos.lng + (endPos.lng - startPos.lng) * fraction
    };
  };

  useEffect(() => {
    const calculateTotalDuration = () => {
      let totalDuration = 0;
      for (let i = 0; i < shipmentRoute.length - 1; i++) {
        const start = shipmentRoute[i];
        const end = shipmentRoute[i + 1];
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(start.lat, start.lng),
          new google.maps.LatLng(end.lat, end.lng)
        );
        const segmentDuration = 1000 + (distance / 5000);
        totalDuration += segmentDuration;
      }
      replayDurationRef.current = totalDuration;
    };

    if (scriptLoaded) {
      calculateTotalDuration();
    }
  }, [scriptLoaded, shipmentRoute]);

  const startReplayFromTime = (startTime: number) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const animate = (currentTime: number) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = currentTime;
        replayStartTimeRef.current = currentTime;
      }

      const elapsed = currentTime - replayStartTimeRef.current;
      const progress = Math.min(elapsed / replayDurationRef.current, 1);

      if (progress < 1) {
        const segmentCount = shipmentRoute.length - 1;
        const segmentIndex = Math.min(Math.floor(progress * segmentCount), segmentCount - 1);
        const segmentProgress = (progress * segmentCount) % 1;

        const start = shipmentRoute[segmentIndex];
        const end = shipmentRoute[segmentIndex + 1];
        
        if (start && end && packageMarkerRef.current) {
          const position = interpolatePosition(start, end, segmentProgress);
          packageMarkerRef.current.setPosition(position);
          setCurrentLocationIndex(segmentIndex);

          if (mapRef.current) {
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(position);
            bounds.extend(end);
            mapRef.current.panToBounds(bounds, {
              top: 50,
              right: 50,
              bottom: 50,
              left: 50
            });
          }
        }

        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentLocationIndex(shipmentRoute.length - 1);
        
        if (packageMarkerRef.current) {
          const finalPosition = shipmentRoute[shipmentRoute.length - 1];
          packageMarkerRef.current.setPosition(finalPosition);
        }

        lastFrameTimeRef.current = null;
        replayStartTimeRef.current = null;
        setIsReplaying(false);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const startReplay = () => {
    setIsReplaying(true);
    setCurrentLocationIndex(0);
    lastFrameTimeRef.current = null;
    replayStartTimeRef.current = null;

    if (mapRef.current) {
      const bounds = new google.maps.LatLngBounds();
      shipmentRoute.forEach(location => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });
      mapRef.current.fitBounds(bounds, {
        padding: { top: 50, right: 50, bottom: 50, left: 50 }
      });
    }

    startReplayFromTime(performance.now());
  };

  const stopReplay = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    lastFrameTimeRef.current = null;
    setIsReplaying(false);
  };

  const handleLocationClick = (index: number) => {
    const location = shipmentRoute[index];
    setSelectedMarker({
      ...location,
      lat: location.lat,
      lng: location.lng
    });
    setCurrentLocationIndex(index);
    
    if (mapRef.current) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: location.lat, lng: location.lng });
      
      if (index < shipmentRoute.length - 1) {
        const nextLocation = shipmentRoute[index + 1];
        bounds.extend({ lat: nextLocation.lat, lng: nextLocation.lng });
      }
      
      mapRef.current.fitBounds(bounds, {
        padding: { top: 50, right: 50, bottom: 50, left: 50 }
      });
    }
  };

  const onMapLoad = useCallback((map: google.maps.Map) => {
    try {
      mapRef.current = map;
      setMap(map);
      const bounds = new google.maps.LatLngBounds();
      
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      
      if (packageMarkerRef.current) {
        packageMarkerRef.current.setMap(null);
      }
      
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }

      shipmentRoute.forEach((location, index) => {
        bounds.extend({ lat: location.lat, lng: location.lng });

        const marker = new google.maps.Marker({
          position: location,
          map,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                <text x="10" y="30" font-size="24">📍</text>
              </svg>
            `),
            anchor: new google.maps.Point(20, 20),
            scaledSize: new google.maps.Size(40, 40)
          },
          title: location.label
        });

        marker.addListener('click', () => handleLocationClick(index));
        markersRef.current.push(marker);
      });

      packageMarkerRef.current = new google.maps.Marker({
        position: shipmentRoute[currentLocationIndex],
        map,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
              <text x="10" y="30" font-size="24">📦</text>
            </svg>
          `),
          anchor: new google.maps.Point(20, 20),
          scaledSize: new google.maps.Size(40, 40)
        },
        zIndex: 1000
      });

      polylineRef.current = new google.maps.Polyline({
        path: shipmentRoute,
        geodesic: true,
        strokeColor: '#8B5CF6',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map
      });

      map.fitBounds(bounds, {
        padding: { top: 50, right: 50, bottom: 50, left: 50 }
      });

      setScriptLoaded(true);
    } catch (err) {
      console.error('Map load error:', err);
      setError('Failed to initialize map');
    }
  }, [currentLocationIndex]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      markersRef.current.forEach(marker => marker.setMap(null));
      if (packageMarkerRef.current) packageMarkerRef.current.setMap(null);
      if (polylineRef.current) polylineRef.current.setMap(null);
    };
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1c20] text-white p-8 flex items-center justify-center">
        <div className="bg-red-500 bg-opacity-10 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1c20] text-white">
      <div className="p-4 bg-gray-900 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-burbank text-2xl">
            Tracking Order #{orderNumber || 'N/A'}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => setShowKeyboardHelp(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
          >
            <Keyboard className="w-4 h-4" />
            <span className="hidden sm:inline">Keyboard Shortcuts</span>
          </button>
        </div>
      </div>

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h2 className="font-burbank text-xl text-white">Live Tracking</h2>
                    <p className="text-gray-400">Current package location</p>
                  </div>
                </div>
                <button
                  onClick={isReplaying ? stopReplay : startReplay}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 transition-colors text-white"
                >
                  {isReplaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Replay Journey</span>
                    </>
                  )}
                </button>
              </div>

              <LoadScript 
                googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}
                libraries={libraries}
              >
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  zoom={4}
                  options={mapOptions}
                  onLoad={onMapLoad}
                >
                  {selectedMarker && (
                    <InfoWindow
                      position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                      onCloseClick={() => setSelectedMarker(null)}
                    >
                      <div className="bg-white p-3 rounded-lg">
                        <h3 className="font-medium text-gray-900">{selectedMarker.label}</h3>
                        <p className="text-sm text-gray-600">{selectedMarker.status}</p>
                        <p className="text-xs text-gray-500">{selectedMarker.timestamp}</p>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </LoadScript>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h2 className="font-burbank text-xl text-white">Package Status</h2>
                  <p className="text-gray-400">Estimated delivery: Today</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 bg-purple-500 bg-opacity-20 p-4 rounded-lg">
                  <Truck className="w-6 h-6 text-purple-500" />
                  <div>
                    <h3 className="font-medium text-white">Out for Delivery</h3>
                    <p className="text-gray-400">Your package will arrive today!</p>
                  </div>
                </div>

                <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-3 before:top-2 before:w-[2px] before:h-[calc(100%-16px)] before:bg-gray-700">
                  {shipmentRoute.map((location, index) => (
                    <div
                      key={index}
                      className={`relative cursor-pointer transition-all ${
                        index === currentLocationIndex ? 'scale-105' : ''
                      }`}
                      onClick={() => handleLocationClick(index)}
                    >
                      <div className={`absolute -left-8 w-4 h-4 rounded-full ${
                        index === currentLocationIndex ? 'bg-purple-500' : 
                        index < currentLocationIndex ? 'bg-green-500' : 'bg-gray-600'
                      }`} />
                      <div className={`bg-gray-700 bg-opacity-50 p-4 rounded-lg ${
                        index === currentLocationIndex ? 'ring-2 ring-purple-500' : ''
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-white">{location.label}</h4>
                        </div>
                        <p className="text-gray-300">{location.status}</p>
                        <p className="text-sm text-gray-400 mt-1">{location.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingMap;