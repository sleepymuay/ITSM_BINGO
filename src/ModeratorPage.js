import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import Swal from "sweetalert2";
import AddWordPage from "./AddWordPage";
import AnswerPage from "./AnswersPage";
import RandomPage from "./random";

const firestore = firebase.firestore();

const ModeratorPage = ({ setAuthenticated, authenticated }) => {
  const [passkey, setPasskey] = useState("");
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [randomKey, setRandomKey] = useState(0); // state to trigger re-render of RandomPage
  const [refreshKey, setRefreshKey] = useState(0); // state to trigger re-render of ModeratorPage

  useEffect(() => {
    // Reset selectedComponent when authenticated state changes
    if (!authenticated) {
      setSelectedComponent(null);
    }
  }, [authenticated]);

  const handlePasskeySubmit = async (e) => {
    e.preventDefault();
    try {
      const passkeyDoc = await firestore
        .collection("Passkeys")
        .doc(passkey)
        .get();
      if (passkeyDoc.exists) {
        setAuthenticated(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid passkey",
          text: "Please try again with a valid passkey.",
        });
      }
    } catch (error) {
      console.error("Error validating passkey:", error);
    }
  };

  const handleDeleteAllAnswers = () => {
    // Display a confirmation dialog using SweetAlert
    Swal.fire({
      title: "Are you sure?",
      text: "This action will RESET current game. Are you sure you want to proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Reset",
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, proceed with deleting all answers
        firestore
          .collection("Answers")
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              doc.ref.delete();
            });
          })
          .then(
            firestore
              .collection("teams")
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  doc.ref.delete();
                });
                Swal.fire("Done!", "Bingo have been reset!", "success");
                // Trigger re-render of RandomPage by updating randomKey
                setRandomKey((prevKey) => prevKey + 1);
                // Trigger re-render of ModeratorPage by updating refreshKey
                setRefreshKey((prevKey) => prevKey + 1);
              })
          )
          .catch((error) => {
            Swal.fire(
              "Error!",
              "An error occurred while deleting answers.",
              "error"
            );
          });
      }
    });
  };

  return (
    <div key={refreshKey} className="min-h-screen flex flex-col bg-gray-100">
      {authenticated && (
        <nav className="bg-gray-800 p-4 flex justify-between items-center">
          <div>
            <button
              className={`text-white mr-4 ${
                selectedComponent === "Home" ? "font-bold" : ""
              }`}
              onClick={() => (window.location = "/")}
            >
              Home
            </button>
            <button
              className={`text-white mr-4 ${
                selectedComponent === "RandomPage" ? "font-bold" : ""
              }`}
              onClick={() => setSelectedComponent("RandomPage")}
            >
              Random
            </button>
            <button
              className={`text-white mr-4 ${
                selectedComponent === "AnswerPage" ? "font-bold" : ""
              }`}
              onClick={() => setSelectedComponent("AnswerPage")}
            >
              Answer
            </button>
            <button
              className={`text-white mr-4 ${
                selectedComponent === "AddWordPage" ? "font-bold" : ""
              }`}
              onClick={() => setSelectedComponent("AddWordPage")}
            >
              Manage-Word
            </button>
          </div>
          <button
            onClick={handleDeleteAllAnswers}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Reset BINGO
          </button>
        </nav>
      )}
      <div className="flex-grow flex justify-center items-center">
        {authenticated && !selectedComponent && (
          <h1 className="text-4xl font-bold mb-40 text-center">
            Welcome 👋🏻 , Moderator!
          </h1>
        )}
        {authenticated ? (
          <div className="mt-4 mb-10">
            {selectedComponent === "AddWordPage" && <AddWordPage />}
            {selectedComponent === "AnswerPage" && <AnswerPage />}
            {selectedComponent === "RandomPage" && (
              <RandomPage key={randomKey} />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4">Enter Passkey</h2>
            <form
              onSubmit={handlePasskeySubmit}
              className="flex flex-col items-center"
            >
              <input
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Enter passkey"
                className="border border-gray-300 rounded-md px-4 py-2 mb-4"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeratorPage;
