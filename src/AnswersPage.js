import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore'; // Import Firestore

const firestore = firebase.firestore();

const AnswersPage = () => {
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore.collection('Answers').onSnapshot((snapshot) => {
      const answersData = [];
      snapshot.forEach((doc) => {
        answersData.push({ id: doc.id, answer: doc.data().answer });
      });
      setAnswers(answersData);
    });
    
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Answers</h1>
      <ul>
        {answers.map((answer) => (
          <li key={answer.id}>{answer.answer}</li>
        ))}
      </ul>
    </div>
  );
};

export default AnswersPage;
