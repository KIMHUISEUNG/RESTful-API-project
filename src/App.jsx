import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);

  const lat = 35.1576;
  const lon = 126.8389;

  const GM_API_KEY = "AIzaSyBjSJ7TOwo3g55ei6A4NyT6nVLE7ZllgSs";
  const W_API_KEY = "607803af4be43b317ba2e0a72d0a81e4";

  useEffect(() => {
    // Google Maps API 예제
    const fetchLocation = async () => {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/js?key=${GM_API_KEY}&loading=async&libraries=maps&v=beta`
      );
      setLocation(response.data);
    };

    // Weather API 예제
    const fetchWeather = async () => {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${W_API_KEY}`
      );
      setWeather(response.data);
    };

    fetchLocation();
    fetchWeather();
  }, []);


  return (
    <>
      <h1>Google Maps & Weather Info</h1>
      <pre>Location: {JSON.stringify(location, null, 2)}</pre>
      <pre>Weather: {JSON.stringify(weather, null, 2)}</pre>
    </>
  )
}

export default App
