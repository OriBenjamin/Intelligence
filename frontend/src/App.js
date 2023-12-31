import React from "react";
import Panorama from "./pages/Panorama";
import KeyMap from "./pages/KeyMap";
import { Clues } from "./pages/Clues";
import IntelligenceMode from "./pages/IntelligenceMode";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ManagersPage from "./pages/ManagersPage";
import Homepage from "./pages/HomePage";
import YellowCarMode from "./pages/YellowCarMode";
import YellowCarLobby from "./pages/YellowCarLobby";
import CluesGame from "./pages/CluesGame";
import MultiplayerLobby from "./pages/MultiplayerLobby";

function App() {
  return (
    <Router>
      {/*<Link to="/intelligenceMode">intelligence mode</Link>*/}

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Panorama" element={<Panorama />} />
        <Route path="/keymap" element={<KeyMap />} />
        <Route path="/intelligenceMode" element={<IntelligenceMode />} />
        <Route path="/clues" element={<Clues />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/managers" element={<ManagersPage />} />
        <Route path="/yellowCarMode" element={<YellowCarMode />} />
        <Route path="/yellowCarMode/:id" element={<YellowCarLobby />} />
        <Route path="/cluesGame" element={<CluesGame />} />
        <Route path="/MultiplayerLobby" element={<MultiplayerLobby />} />
      </Routes>
    </Router>
  );
}

export default App;
