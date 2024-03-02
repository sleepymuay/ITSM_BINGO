import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ModeratorPage from "./ModeratorPage";
import Home from "./home";
import PlayerPage from "./PlayerPage";

const MainApp = () => {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player" element={<PlayerPage />} />

        <Route
          path="/moderator"
          element={
            <ModeratorPage
              setAuthenticated={setAuthenticated}
              authenticated={authenticated}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default MainApp;
