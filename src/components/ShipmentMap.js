import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from 'axios';

// Default coordinates if a location is invalid
const DEFAULT_COORDINATES = [20, 0];

// Function to create custom icons
const createCustomIcon = (iconUrl, size) =>
  new L.Icon({ iconUrl, iconSize: [size, size], iconAnchor: [size / 2, size], popupAnchor: [0, -size] });

const startIcon = createCustomIcon("https://cdn-icons-png.flaticon.com/512/684/684908.png", 30);
const destinationIcon = createCustomIcon("https://cdn-icons-png.flaticon.com/512/684/684908.png", 30);
const currentLocationIcon = createCustomIcon("https://cdn-icons-png.flaticon.com/512/684/684912.png", 35);

const ShipmentMap = ({ route, location }) => {
  const [coordinates, setCoordinates] = useState({});
  const [path, setPath] = useState([]);

  // Function to fetch coordinates from OpenStreetMap API
  const fetchCoordinates = async (place) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: { q: place, format: "json", limit: 1 },
      });
      if (response.data.length > 0) {
        return [parseFloat(response.data[0].lat), parseFloat(response.data[0].lon)];
      }
    } catch (error) {
      console.error(`Error fetching coordinates for ${place}:`, error);
    }
    return DEFAULT_COORDINATES; // Return default if not found
  };

  useEffect(() => {
    const loadCoordinates = async () => {
      if (!route || route.length < 2 || !location) return;
      const newCoords = {};
      const locations = [route[0], route[1], location];

      for (const place of locations) {
        if (!newCoords[place]) {
          newCoords[place] = await fetchCoordinates(place);
        }
      }

      setCoordinates(newCoords);
      setPath(Object.values(newCoords)); // Set path for polyline
    };

    loadCoordinates();
  }, [route, location]);

  if (!route || route.length < 2 || !location || !coordinates[route[0]] || !coordinates[route[1]] || !coordinates[location]) {
    return <p>Loading map...</p>;
  }

  const startLocation = coordinates[route[0]] || DEFAULT_COORDINATES;
  const destinationLocation = coordinates[route[1]] || DEFAULT_COORDINATES;
  const currentLocation = coordinates[location] || DEFAULT_COORDINATES;

  return (
    <MapContainer center={currentLocation} zoom={5} style={{ height: "400px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Start Location Marker */}
      <Marker position={startLocation} icon={startIcon}>
        <Popup>Start Location: {route[0]}</Popup>
      </Marker>

      {/* Destination Location Marker */}
      <Marker position={destinationLocation} icon={destinationIcon}>
        <Popup>Destination: {route[1]}</Popup>
      </Marker>

      {/* Current Location Marker */}
      <Marker position={currentLocation} icon={currentLocationIcon}>
        <Popup>Current Location: {location}</Popup>
      </Marker>

      {/* Polyline to show the shipment path */}
      {path.length > 1 && <Polyline positions={path} color="blue" />}
    </MapContainer>
  );
};

export default ShipmentMap;
