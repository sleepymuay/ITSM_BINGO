import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import Swal from "sweetalert2";
import PulseLoader from "react-spinners/PulseLoader";
import "./realtime.css";

const RealtimeTeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const firestore = firebase.firestore();
    const unsubscribe = firestore.collection("teams").onSnapshot((snapshot) => {
      const teamsData = [];
      snapshot.forEach((doc) => {
        teamsData.push({ id: doc.id, ...doc.data() });
      });
      setTeams(teamsData);
      setLoading(false); // Set loading to false once data is fetched

      // Check for teams with status "win"
      const winningTeams = teamsData.filter((team) => team.status === "win");
      if (winningTeams.length > 0) {
        winningTeams.forEach((winningTeam) => {
          Swal.fire({
            title: "Congratulations!",
            text: `Team ${winningTeam.name} has won the game!`,
            icon: "success",
            confirmButtonText: "OK",
          });
        });
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <PulseLoader color="#4a90e2" size={15} margin={5} />
        <p className="ml-2">Loading...</p>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="flex mt-4 justify-center ">
        <p>Waiting for team to join </p>
        <PulseLoader color="#4a90e2" size={10} margin={6} />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {teams.map((team) => (
        <div
          key={team.id}
          className={`bg-white shadow-md rounded-md p-4 ${
            team.status === "lost"
              ? "card-lost"
              : team.status === "win"
              ? "card-win" // Add class for winning team
              : ""
          }`}
        >
          <h2 className="text-xl font-semibold mb-2">{team.name}</h2>
          <p>
            <span className="font-semibold">Attempts left:</span>{" "}
            {team.attempts === 0 ? (
              <span role="img" aria-label="skull">
                💀
              </span>
            ) : (
              Array.from({ length: team.attempts }, (_, index) => (
                <span key={index} role="img" aria-label="heart">
                  ❤️
                </span>
              ))
            )}
          </p>
          {/* Add more fields as needed */}
        </div>
      ))}
    </div>
  );
};

export default RealtimeTeamsPage;
