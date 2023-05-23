import { useState, createContext, useContext, useEffect } from "react";
import Authentication from "./components/Authentication";
import './App.css';



function App() {

  const [accessToken, setAccessToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(0);
  const [tokenRefresh, setTokenRefresh] = useState(true);

  useEffect(() => {
    if (tokenRefresh) {
      if (expiresIn === 0) {
        Authentication(setAccessToken, setExpiresIn, setTokenRefresh);
      } else {
        setTokenRefresh(false);
        setTimeout(() => {
          Authentication(setAccessToken, setExpiresIn, setTokenRefresh);
        }, expiresIn * 1000)
      }
    }
  })

  return (
    <div className="App">
    </div>
  );
}

export default App;
