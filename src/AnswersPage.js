import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore"; // Import Firestore

const firestore = firebase.firestore();

const AnswersPage = () => {
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore
      .collection("Answers")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        const answersData = [];
        snapshot.forEach((doc) => {
          answersData.push({ id: doc.id, ...doc.data() });
        });
        setAnswers(answersData);
      });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-[65em] flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center mb-12">
        <h1 className="text-4xl">Answers</h1>
      </div>
      <div className="flex flex-grow justify-center">
        {answers.length === 0 ? (
          <div className="text-center">
            <p className="mb-7">No answers available</p>
          </div>
        ) : (
          <ul className="w">
            {answers.map((answer, index) => (
              <li
                key={answer.id}
                className="bg-white border border-gray-200 p-4 mb-2 rounded-md shadow-md"
              >
                <p>
                  <strong>Question {index + 1}</strong>
                </p>
                <p>{answer.answer}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AnswersPage;
