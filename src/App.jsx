import { useEffect, useState } from "react";
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import styled from "styled-components";
import axios from "axios";

function App() {
  const [weather, setWeather] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [tipCondistion, setTipCondistion] = useState(false);

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const MAP_ID = import.meta.env.VITE_MAP_ID;

  const mapLocation = [
    { name: "광주FC", lat: 35.1312, lon: 126.8750 },
    { name: "서울FC", lat: 37.5683, lon: 126.8972 },
    { name: "울산HD", lat: 35.5360, lon: 129.2595 },
    { name: "대구FC", lat: 35.8816, lon: 128.5882 },
    { name: "강원FC", lat: 37.7742, lon: 128.8972 },
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

  const handleMarkerClick = (city) => {
    setSelectedCity(city);
  };
  const tipCondistionHandler = () => {
    setTipCondistion(!tipCondistion);
    console.log("tipCondistion",tipCondistion);
  }

  return (
    <MapContainer>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map defaultCenter={{ lat: 36.5, lng: 127.5 }} defaultZoom={8} mapId={MAP_ID}>
          {weather.map((item, index) => (
            <AdvancedMarker key={index} position={{ lat: item.lat, lng: item.lon }} onClick={() => handleMarkerClick(item)}>
              <WeatherInfo>
                <h4>{item.name}</h4>
                {selectedCity ? <p>{Math.round(item.main.temp)}°C</p> : <p></p>}
                <IconImg src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} alt="weather-icon" />
                {selectedCity ? <p>{item.weather[0].description}</p> : <p></p>}
              </WeatherInfo>
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
      <TipButton onClick={tipCondistionHandler}>Tip</TipButton>
      {tipCondistion && (
        <TipContainer>
        <p>Icon을 클릭하면 자세한 정보를 얻을 수 있어요 ^^</p>
      </TipContainer>
      )}
      {selectedCity && (
        <DetailContainer>
          <h2>{selectedCity.name} - 자세한 날씨 정보</h2>
          <p>온도: {Math.round(selectedCity.main.temp)}°C</p>
          <p>체감 온도: {Math.round(selectedCity.main.feels_like)}°C</p>
          <p>습도: {selectedCity.main.humidity}%</p>
          <p>풍속: {selectedCity.wind.speed}m/s</p>
          <p>날씨: {selectedCity.weather[0].description}</p>
          <button onClick={() => setSelectedCity(null)}>닫기</button>
        </DetailContainer>
      )}
    </MapContainer>
  );
}

export default App;

const TipButton = styled.button`
  position: absolute;
  top: 100px;
  left: 10px;
  background: white;
  color: #000;
  font-weight: normal;
  padding: 12px;
  border-radius: 0px 8px 0px 0px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`
const TipContainer = styled.div`
  position: absolute;
  top: 150px;
  left: 10px;
  background: white;
  color: #000;
  font-weight: normal;
  padding: 0px 12px;
  border-radius: 0px 8px 0px 0px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`

const DetailContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  color: #000;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  h2 {
    margin: 0 0 10px;
    font-size: 20px;
  }

  p {
    margin: 5px 0;
  }

  button {
    margin-top: 10px;
    padding: 8px 12px;
    width: 100%;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background: #0056b3;
  }
`;

const MapContainer = styled.div`
  width: 100wh;
  height: 100vh;
`;

const WeatherInfo = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 6px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-size: 14px;
  color: #333;

  h4 {
    margin: 0;
    font-size: 16px;
    font-weight: normal;
  }

  p {
    margin: 4px 0;
  }
`;

const IconImg = styled.img`
  width: 75px;
  background-color: cornflowerblue;
`