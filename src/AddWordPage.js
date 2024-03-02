import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firestore = firebase.firestore();

const AddWordPage = () => {
  const [description, setDescription] = useState("");
  const [answer, setAnswer] = useState("");
  const [words, setWords] = useState([]);
  const [editingWordId, setEditingWordId] = useState(null);

  useEffect(() => {
    // Fetch words from Firestore when component mounts
    const unsubscribe = firestore
      .collection("words")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        const wordsData = [];
        snapshot.forEach((doc) => {
          wordsData.push({ id: doc.id, ...doc.data() });
        });
        setWords(wordsData);
      });

    // Unsubscribe from Firestore listener when component unmounts
    return () => unsubscribe();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingWordId) {
      // Update the existing word in Firestore
      firestore
        .collection("words")
        .doc(editingWordId)
        .update({
          description,
          answer,
        })
        .then(() => {
          console.log("Word updated successfully!");
          setEditingWordId(null);
        })
        .catch((error) => {
          console.error("Error updating word:", error);
        });
    } else {
      // Add a new word to Firestore
      firestore
        .collection("words")
        .add({
          description,
          answer,
          timestamp: new Date(Date.now()),
        })
        .then(() => {
          console.log("Word added successfully!");
        })
        .catch((error) => {
          console.error("Error adding word:", error);
        });
    }
    // Clear the input fields after submission
    setDescription("");
    setAnswer("");
  };

  const handleEdit = (id, description, answer) => {
    // Set the editingWordId and populate the input fields with the word's data
    setEditingWordId(id);
    setDescription(description);
    setAnswer(answer);
  };

  const handleDelete = (id) => {
    // Delete the word from Firestore
    firestore
      .collection("words")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Word deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting word:", error);
      });
  };

  return (
    <div>
      <h1>Add Word Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="answer">Answer:</label>
          <input
            type="text"
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>
        <button type="submit">
          {editingWordId ? "Update Word" : "Add Word"}
        </button>
      </form>
      <h2>All Words</h2>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Answer</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {words.map((word) => (
            <tr key={word.id}>
              <td>{word.description}</td>
              <td>{word.answer}</td>
              <td>
                <button
                  onClick={() =>
                    handleEdit(word.id, word.description, word.answer)
                  }
                >
                  Edit
                </button>
              </td>
              <td>
                <button onClick={() => handleDelete(word.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddWordPage;
