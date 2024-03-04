// components/Map.js
import { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWJkZWFsaTcyIiwiYSI6ImNsN2J6ZWh4eDE3OXgzcW84d2VxbWRpM24ifQ.RnphYbegeMvk3I1fjTqY5g';

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: zoom,
      });
    } else {
      map.current.flyTo({ center: [lng, lat], zoom: zoom });
    }
  }, [lng, lat, zoom]);

  return (
    <div>
      <div
        ref={mapContainer}
        style={{ width: '100%', height: '400px' }}
      />
    </div>
  );
};

export default Map;
