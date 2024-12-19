import { useEffect, useState } from "react";
import {AdvancedMarker, APIProvider, Map} from '@vis.gl/react-google-maps';
import styled from 'styled-components'
import axios from "axios";

function App() {
  const [weather, setWeather] = useState([]);

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const position = {lat: 35.1312, lng: 126.8749};

  const mapLocation = [
    { name:"gwangju", lat:35.1312, lon:126.8749,},
    { name:"seoul", lat:37.5683, lon:126.8972,},
    { name:"Ulsan", lat:35.5360, lon:129.2595,},
    { name:"Daegu", lat:35.8816, lon:128.5882,},
    { name:"Gangwon", lat:37.7742, lon:128.8972,},
  ]

  useEffect(() => {
    // Weather API 예제
    const fetchWeather = async () => {
      try {
        const weatherResponses = await Promise.all(
          mapLocation.map(async (loc) => {
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lon}&units=metric&lang=kr&appid=${WEATHER_API_KEY}`
            );
            return { name: loc.name, ...response.data };
          })
        );
        setWeather(weatherResponses);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, []);

  useEffect(() => {
    console.log("Updated weather data: ", weather);
  }, [weather]);


  return (
    <>
    <MapContainer>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map defaultCenter={position} defaultZoom={10}>
          <AdvancedMarker position={position} />
        </Map>
      </APIProvider>
    </MapContainer>
    <WeatherContainer>
    {weather.map((item, index) => (
        <WeatherCard key={index}>
          <h3>{item.name}</h3>
          <p>온도: {item.main.temp}°C</p>
          <p>날씨: {item.weather[0].description}</p>
        </WeatherCard>
      ))}
    </WeatherContainer>
      
    </>
    
  )
}

export default App

const MapContainer = styled.div`
width: 100vw;
height: 65vh;
`;

const WeatherCard = styled.div`
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const WeatherContainer = styled.div`
  display: flex;
  justify-content: space-between;
`