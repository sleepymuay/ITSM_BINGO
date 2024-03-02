import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore"; // Import Firestore

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDj9BI01uYbScLVI2WK4VFI_pV6-4OJdc8",
  authDomain: "itsm-f8633.firebaseapp.com",
  databaseURL:
    "https://itsm-f8633-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "itsm-f8633",
  storageBucket: "itsm-f8633.appspot.com",
  messagingSenderId: "723020141477",
  appId: "1:723020141477:web:b534b89aad4f7983af4e4c",
  measurementId: "G-J5C2WXNSPT",
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

const Random = () => {
  const [words, setWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);

  useEffect(() => {
    const unsubscribe = firestore.collection("words").onSnapshot((snapshot) => {
      const wordsData = [];
      snapshot.forEach((doc) => {
        wordsData.push({
          id: doc.id,
          description: doc.data().description,
          answer: doc.data().answer,
        });
      });
      setWords(wordsData);
    });

    return () => unsubscribe();
  }, []);

  const handleClick = () => {
    if (words.length > 0) {
      const randomIndex = Math.floor(Math.random() * words.length);
      const selectedAnswer = words[randomIndex];
      setSelectedWord(selectedAnswer.description);
      // Check if the selected answer has the answer field defined
      if (selectedAnswer.answer) {
        // Generate a unique ID for the new document
        const newAnswerRef = firestore.collection("Answers").doc();
        // Store the selected answer into a new document in the Answers collection
        newAnswerRef
          .set({
            answer: selectedAnswer.answer,
          })
          .then(() => {
            console.log("Answer added successfully:", newAnswerRef.id);
          })
          .catch((error) => {
            console.error("Error adding answer:", error);
          });
      } else {
        console.error(
          'Selected answer does not have the "answer" field defined.'
        );
      }
      // Remove the selected item from the items list
      const updatedWords = words.filter((_, index) => index !== randomIndex);
      setWords(updatedWords);
    }
  };

  return (
    <div>
      <h1>Random Word Picker</h1>
      <button onClick={handleClick}>Pick Random Word</button>
      {selectedWord && (
        <div>
          <h2>Selected Description:</h2>
          <p>{selectedWord}</p>
        </div>
      )}
    </div>
  );
};

export default Random;
