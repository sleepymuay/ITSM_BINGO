import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import Swal from "sweetalert2";
import ReactDOMServer from "react-dom/server";
import "./Home.css";
import AboutMePage from "./aboutme"; // Import the AboutMePage component

const Home = () => {
  const [teamName, setTeamName] = useState("");
  const navigate = useNavigate();

  const handleStartClick = () => {
    Swal.fire({
      title: "Enter Your Team Name",
      input: "text",
      inputPlaceholder: "Enter Team Name",
      showCancelButton: true,
      confirmButtonText: "Start",
      cancelButtonText: "Cancel",
      preConfirm: (name) => {
        if (!name) {
          Swal.showValidationMessage("Team name cannot be empty");
        }
        return name;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const teamName = result.value;
        saveTeamName(teamName);
      }
    });
  };

  const saveTeamName = async (name) => {
    try {
      const firestore = firebase.firestore();
      const teamRef = await firestore.collection("teams").add({
        name: name,
        attempts: 3,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        status: "playing",
      });
      navigate(`/player?teamId=${teamRef.id}`); // Pass team ID as URL parameter
    } catch (error) {
      console.error("Error saving team name:", error);
    }
  };

  const handleAboutMeClick = () => {
    const aboutMeHtml = ReactDOMServer.renderToString(<AboutMePage />);
    Swal.fire({
      html: aboutMeHtml,
      showCloseButton: true,
      showConfirmButton: false,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative bg-gradient-to-r from-blue-500 to-pink-500">
      <div className="absolute inset-0 z-0 bg-gradient-blue-pink animate-gradient-spin"></div>
      <div className="relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-6 md:mb-10">
          ITIL BUZZWORD BINGO
        </h1>
        <div className="flex flex-col items-center space-y-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-6 md:py-10 px-6 md:px-10 lg:text-4xl lg:py-10 lg:px-10 rounded-lg"
            onClick={handleStartClick}
          >
            START!
          </button>
          <Link to="/moderator" className="text-blue-500 hover:underline">
            Go to Moderator Page
          </Link>
        </div>
      </div>
      <footer className="absolute bottom-0 left-0 w-full  text-white text-center py-4">
        <button onClick={handleAboutMeClick}>About KPMC</button>
      </footer>
    </div>
  );
};

export default Home;
