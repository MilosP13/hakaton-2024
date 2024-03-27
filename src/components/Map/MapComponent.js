import React, { useEffect, useRef, useState } from 'react';
import RealEstateABI from '../../contracts/RealEstate.json';
import RealEstateFactoryABI from '../../contracts/RealEstateFactory.json';
import customMarkerIcon from '../../icons&pictures/custom-marker-icon.png'; 
import customHouseMarker from '../../icons&pictures/realestate-pin.png';
import OneEstateModal from '../OneEstateModal/OneEstateModal';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import './MapPage.css'; // Import custom CSS for the map page

const MapComponent = ({ web3, account, factoryAddress }) => {
  const mapRef = useRef(null);
  const [realEstates, setRealEstates] = useState([]);
  const [oneRealEstate, setOneRealEstate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); 
  const [selectedEstate, setSelectedEstate] = useState(null); 

  useEffect(() => {
    const mapContainer = mapRef.current;
    if (!mapContainer) {
      return;
    }

    if (!mapContainer._leaflet_id) {
      const map = L.map(mapContainer).setView([44.787197, 20.457273], 13); // Default view for Belgrade

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      // Custom marker icon
      const customIcon = L.icon({
        iconUrl: customMarkerIcon,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      // Add user's location marker
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const latbg = 44.7737259;
            const lonbg = 20.4752945;
            L.marker([latbg, lonbg], { icon: customIcon }).addTo(map).bindPopup('Your Location').openPopup();
            map.setView([latbg, lonbg], 13);
          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }

      // Fetch data from WAQI API for each location and add circles to the map
      fetchPollutionData(map);
      getAllRealEstates(map);
    }
  }, []);

  const fetchPollutionData = async (map) => {
    // Example locations to fetch pollution data for (replace with actual locations)
    const locations = ['@8093', '@8574', '@9261', '@8575', 'A470566', '@14565', '@14572', 'A470563', 'A402694', 'A231379', 'A470557', '@12893', '@14570'];

    for (const location of locations) {
      try {
        const response = await fetch(`https://api.waqi.info/feed/${location}/?token=c6513139364f09061c9e511a542f026eae1346af`);
        const data = await response.json();

        // Extract name, coordinates, and pollution data from the API response
        const { name } = data.data.city;
        const [latitude, longitude] = data.data.city.geo; // Extract latitude and longitude
        const aqi = data.data.aqi; // Example: AQI value

        // Add circle to the map based on pollution data
        addCircleToMap(map, latitude, longitude, aqi, name);
      } catch (error) {
        console.error('Error fetching pollution data:', error);
      }
    }
  };

  const addCircleToMap = (map, latitude, longitude, aqi, name) => {
    // Define circle options based on AQI value (adjust as needed)
    let color = 'green'; // Default color for good air quality
    let radius = 500; // Default radius for the circle

    // Adjust circle color and radius based on AQI value
    if (aqi > 50) {
      color = 'yellow'; // Moderate air quality
      radius = 1000;
    }
    if (aqi > 100) {
      color = 'orange'; // Unhealthy for sensitive groups
      radius = 1500;
    }
    if (aqi > 150) {
      color = 'red'; // Unhealthy
      radius = 2000;
    }

    // Create circle and add it to the map
    L.circle([latitude, longitude], { color, fillColor: color, fillOpacity: 0.5, radius }).addTo(map)
      .bindPopup(`${name}: AQI ${aqi}`).openPopup();
  };
 
  const getAllRealEstates = async (map) => {
    try {
      const factoryContract = new web3.eth.Contract(RealEstateFactoryABI.abi, factoryAddress);
      const estates = await factoryContract.methods.getAllRealEstates().call();

      console.log(estates);
      // Set the real estates stat
      setRealEstates(estates);

      if (estates.length > 0) {
        estates.forEach((address=>{
          getRealEstateInfo(address,map);
        }));
      }
    } catch (error) {
      console.error('Error fetching real estates:', error);
    }
  };

  const getRealEstateInfo = async (oneEstate,map) => {
    try {
      const estateContract = new web3.eth.Contract(RealEstateABI.abi, oneEstate);
      const locationName = await estateContract.methods.getLocationName().call();
      const lat = await estateContract.methods.getLat().call();
      const lon = await estateContract.methods.getLon().call();

      // Convert lat and lon to decimal format
      const decimalLat = parseInt(lat) / 10 ** 6;
      const decimalLon = parseInt(lon) / 10 ** 6;

      // Add marker to the map
      addHouseToMap(decimalLat, decimalLon, locationName, map, oneEstate);
    } catch (error) {
      console.error('Error getting real estate info:', error);
    }
  };

  const addHouseToMap = (lat, lon, locationName, map, oneEstate) => {
    if (!map) return;
  
    const customIcon = L.icon({
      iconUrl: customHouseMarker,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
  
    const marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
  
    // Attach a click event to the marker to open the modal
    marker.on('click', () => {
      showHouseModal(oneEstate);
    });
  };
  const showHouseModal = (oneEstate) => {
    setSelectedEstate(oneEstate); // Set the selected estate
    setModalVisible(true); // Open the modal
  };

  return (
    <div id="map" ref={mapRef}>
      {/* OneEstateModal component */}
      {modalVisible && (
        <OneEstateModal
          web3={web3}
          account={account}
          factoryAddress={factoryAddress}
          oneEstate={selectedEstate}
          onClose={() => setModalVisible(false)} // Close modal function
        />
      )}
    </div>
  );
};

export default MapComponent;
