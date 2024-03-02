import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
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
      Swal.fire({
        title: "Confirm Update",
        text: "Are you sure you want to update this word?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!",
      }).then((result) => {
        if (result.isConfirmed) {
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
              Swal.fire("Updated!", "Your word has been updated.", "success");
            })
            .catch((error) => {
              console.error("Error updating word:", error);
              Swal.fire(
                "Error!",
                "An error occurred while updating your word.",
                "error"
              );
            });
        }
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
          Swal.fire("Added!", "Your word has been added.", "success");
        })
        .catch((error) => {
          console.error("Error adding word:", error);
          Swal.fire(
            "Error!",
            "An error occurred while adding your word.",
            "error"
          );
        });
    }
    // Clear the input fields after submission
    setDescription("");
    setAnswer("");
  };

  const handleEdit = (id, description, answer) => {
    // Show alert
    Swal.fire({
      title: "Edit Word",
      html: `
        <div class="swal2-content">
          <label for="editAnswer">Answer:</label><br>
          <input type="text" id="editAnswer" class="swal2-input swal2-textarea" value="${answer}" style="height: 5em;width: 20em"><br><br>
          <label for="editDescription">Description:</label><br>
          <textarea id="editDescription" class="swal2-input swal2-textarea" style="height: 20em; width: 20em">${description}</textarea>
        </div>
      `,
      width: "50%",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      focusConfirm: true,
      customClass: {
        content: "custom-swal-content",
      },
      preConfirm: () => {
        const editedAnswer = Swal.getPopup().querySelector("#editAnswer").value;
        const editedDescription =
          Swal.getPopup().querySelector("#editDescription").value;
        if (!editedAnswer || !editedDescription) {
          Swal.showValidationMessage("Please fill out all fields");
        }
        return { editedAnswer, editedDescription };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { editedAnswer, editedDescription } = result.value;
        // Proceed with update
        firestore
          .collection("words")
          .doc(id)
          .update({
            description: editedDescription,
            answer: editedAnswer,
          })
          .then(() => {
            console.log("Word updated successfully!");
            setEditingWordId(null);
            Swal.fire("Updated!", "Your word has been updated.", "success");
          })
          .catch((error) => {
            console.error("Error updating word:", error);
            Swal.fire(
              "Error!",
              "An error occurred while updating your word.",
              "error"
            );
          });
      }
    });
  };

  const handleDelete = (id) => {
    // Delete the word from Firestore
    Swal.fire({
      title: "Confirm Delete",
      text: "Are you sure you want to delete this word?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        firestore
          .collection("words")
          .doc(id)
          .delete()
          .then(() => {
            console.log("Word deleted successfully!");
            Swal.fire("Deleted!", "Your word has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting word:", error);
            Swal.fire(
              "Error!",
              "An error occurred while deleting your word.",
              "error"
            );
          });
      }
    });
  };

  return (
    <div className="min-h-[65em] flex justify-center  bg-gray-100 w-[60em]">
      <div className="">
        <div className="text-center mb-12">
          <h1 className="text-4xl">Add Word Page</h1>
        </div>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label htmlFor="answer" className="block text-gray-700">
              Answer:
            </label>
            <input
              type="text"
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700">
              Description:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 whitespace-pre-wrap"
              rows={4}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            {editingWordId ? "Update Word" : "Add Word"}
          </button>
        </form>
        <h2 className="mt-8 text-2xl">All Words</h2>
        <div className="w-full mt-4">
          <table className="w-full border-collapse border border-gray-200 table-fixed">
            <thead>
              <tr>
                <th className="border border-gray-200 px-4 py-2 w-1/4">
                  Answer
                </th>
                <th className="border border-gray-200 px-4 py-2 w-1/2">
                  Description
                </th>
                <th className="border border-gray-200 px-4 py-2 w-1/9">Edit</th>
                <th className="border border-gray-200 px-4 py-2 w-1/9">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {words.map((word) => (
                <tr key={word.id}>
                  <td className="border border-gray-200 px-4 py-2 break-all">
                    {word.answer}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 break-all">
                    {word.description}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 ">
                    <button
                      onClick={() =>
                        handleEdit(word.id, word.description, word.answer)
                      }
                      className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 flex justify-center items-center"
                    >
                      ✏️
                    </button>
                  </td>
                  <td className="border border-gray-200 px-4 py-2 ">
                    <button
                      onClick={() => handleDelete(word.id)}
                      className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600 flex justify-center items-center"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddWordPage;
