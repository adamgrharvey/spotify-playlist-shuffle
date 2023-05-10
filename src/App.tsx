import { useState, createContext, useContext } from "react";
import Authentication from "./components/Authentication";
import './App.css';



function App() {

  const [accessToken, setAccessToken] = useState(null);

  Authentication(accessToken, setAccessToken);

  return (
    <div className="App">
    </div>
  );
}

export default App;
