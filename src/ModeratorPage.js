import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firestore = firebase.firestore();

const ModeratorPage = ({ setAuthenticated, authenticated }) => {
  const [passkey, setPasskey] = useState("");
  const navigate = useNavigate();

  const handlePasskeySubmit = (e) => {
    e.preventDefault();
    // Check if passkey is valid
    if (passkey === "123456") {
      // Replace "yourpasskey" with your actual passkey
      setAuthenticated(true);
    } else {
      alert("Invalid passkey. Please try again.");
    }
  };

  const handleDeleteAllAnswers = () => {
    // Delete all documents in the 'Answers' collection
    firestore
      .collection("Answers")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
        console.log("All answers deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting answers:", error);
      });
  };

  return (
    <div>
      <h1>Moderator Page</h1>
      {authenticated ? (
        <ul>
          <li>
            <Link to="/add-word">Add Word Page</Link>
          </li>
          <li>
            <Link to="/answers">Answer Page</Link>
          </li>
          <li>
            <Link to="/random">random Page</Link>
          </li>
        </ul>
      ) : (
        <div>
          <h2>Enter Passkey</h2>
          <form onSubmit={handlePasskeySubmit}>
            <input
              type="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              placeholder="Enter passkey"
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
      {/* Button to delete all data in 'Answers' collection */}
      {authenticated && (
        <button onClick={handleDeleteAllAnswers}>Delete All Answers</button>
      )}
    </div>
  );
};

export default ModeratorPage;
