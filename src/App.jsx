import { useEffect, useState } from "react";
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import styled from "styled-components";
import axios from "axios";

function App() {
  const [weather, setWeather] = useState([]);

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const MAP_ID = import.meta.env.VITE_MAP_ID;

  const mapLocation = [
    { name: "gwangju", lat: 35.1312, lon: 126.8750 },
    { name: "seoul", lat: 37.5683, lon: 126.8972 },
    { name: "ulsan", lat: 35.5360, lon: 129.2595 },
    { name: "daegu", lat: 35.8816, lon: 128.5882 },
    { name: "gangwon", lat: 37.7742, lon: 128.8972 },
  ];

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const weatherResponses = await Promise.all(
          mapLocation.map(async (loc) => {
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lon}&units=metric&lang=kr&appid=${WEATHER_API_KEY}`
            );
            return { name: loc.name, lat: loc.lat, lon: loc.lon, ...response.data };
          })
        );
        setWeather(weatherResponses);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, []);

  return (
    <MapContainer>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map defaultCenter={{ lat: 36.5, lng: 127.5 }} defaultZoom={8} mapId={MAP_ID}>
          {weather.map((item, index) => (
            <AdvancedMarker key={index} position={{ lat: item.lat, lng: item.lon }}>
              <WeatherInfo>
                <h4>{item.name}</h4>
                <p>{Math.round(item.main.temp)}°C</p>
                <img src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} alt="weather-icon" />
                <p>{item.weather[0].description}</p>
              </WeatherInfo>
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </MapContainer>
  );
}

export default App;

const MapContainer = styled.div`
  width: 100wh;
  height: 100vh;
`;

const WeatherInfo = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-size: 14px;
  color: #333;

  h4 {
    margin: 0;
    font-size: 16px;
    font-weight: bold;
  }

  p {
    margin: 4px 0;
  }
`;
