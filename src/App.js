import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Random from "./random";
import AnswersPage from "./AnswersPage";
import AddWordPage from "./AddWordPage";
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
        <Route
          path="/answers"
          element={
            authenticated ? (
              <AnswersPage />
            ) : (
              <Navigate to="/moderator" replace />
            )
          }
        />
        <Route
          path="/add-word"
          element={
            authenticated ? (
              <AddWordPage />
            ) : (
              <Navigate to="/moderator" replace />
            )
          }
        />
        <Route
          path="/random"
          element={
            authenticated ? <Random /> : <Navigate to="/moderator" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default MainApp;
