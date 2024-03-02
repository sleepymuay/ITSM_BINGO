import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // Import CSS file for custom styles

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen relative">
      <div className="absolute inset-0 z-0 bg-gradient-blue-pink animate-gradient-spin"></div>
      <div className="relative z-10">
        <h1 className="text-8xl font-bold text-white mb-10 ">
          ITIL BUZZWORD BINGO
        </h1>
        <div className="flex flex-col items-center space-y-4">
          <Link to="/player">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-10 px-10 rounded-lg text-4xl">
              START!
            </button>
          </Link>
          <Link to="/moderator" className="text-blue-500 hover:underline">
            Go to Moderator Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
