import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import Swal from "sweetalert2";

const PlayerPage = () => {
  const [grid, setGrid] = useState([]);
  const [clickedCells, setClickedCells] = useState([]);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const fetchWords = async () => {
      const firestore = firebase.firestore();
      const wordsSnapshot = await firestore.collection("words").get();
      const wordsData = wordsSnapshot.docs.map((doc) => doc.data().answer);
      const randomWords = getRandomWords(wordsData, 25); // Get 25 random words
      const gridData = [];
      for (let i = 0; i < 5; i++) {
        const row = [];
        for (let j = 0; j < 5; j++) {
          row.push(randomWords.shift()); // Fill cells with random words
        }
        gridData.push(row);
      }
      setGrid(gridData);
    };

    fetchWords();
  }, []);

  const getRandomWords = (wordsArray, count) => {
    const shuffled = wordsArray.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const handleClick = async (rowIndex, colIndex) => {
    if (gameOver) {
      return; // If game is over, do nothing
    }

    const clickedCell = clickedCells.find(
      (cell) => cell.row === rowIndex && cell.col === colIndex
    );

    // Check if the cell is already marked
    if (clickedCell && (clickedCell.correct || !clickedCell.correct)) {
      return;
    }

    const clickedWord = grid[rowIndex][colIndex];
    const firestore = firebase.firestore();
    try {
      const querySnapshot = await firestore
        .collection("Answers")
        .where("answer", "==", clickedWord)
        .get();

      const newClickedCells = [
        ...clickedCells,
        {
          row: rowIndex,
          col: colIndex,
          correct: querySnapshot.size > 0,
        },
      ];

      setClickedCells(newClickedCells);

      if (querySnapshot.size > 0) {
        const hasBingo = checkBingo(newClickedCells); // Check for win condition
        if (hasBingo) {
          setGameOver(true);
          // Display SweetAlert when the game is won
          Swal.fire({
            title: "Congratulations!",
            text: "You have won the game!",
            icon: "success",
            confirmButtonText: "OK",
          });
        }
      } else {
        setWrongAttempts(wrongAttempts + 1);
        if (wrongAttempts + 1 >= 3) {
          setGameOver(true);
          // Display SweetAlert when the game is over
          Swal.fire({
            title: "Game Over",
            text: "You lost the game!",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  const checkBingo = (clickedCells) => {
    // Check horizontal lines
    for (let i = 0; i < 5; i++) {
      const isBingo =
        clickedCells.filter((cell) => cell.row === i && cell.correct).length ===
        5;
      if (isBingo) {
        return true;
      }
    }

    // Check vertical lines
    for (let i = 0; i < 5; i++) {
      const isBingo =
        clickedCells.filter((cell) => cell.col === i && cell.correct).length ===
        5;
      if (isBingo) {
        return true;
      }
    }

    // Check diagonal (top-left to bottom-right)
    const diagonal1 =
      clickedCells.filter((cell) => cell.row === cell.col && cell.correct)
        .length === 5;
    if (diagonal1) {
      return true;
    }

    // Check diagonal (top-right to bottom-left)
    const diagonal2 =
      clickedCells.filter((cell) => cell.row + cell.col === 4 && cell.correct)
        .length === 5;
    if (diagonal2) {
      return true;
    }

    return false;
  };

  return (
    <div className="max-w-4xl mx-auto p-10 mb-4">
      <h1 className="text-3xl font-bold text-center mb-4">
        Welcome to ITIL BUZZWORD Bingo!
      </h1>
      <div className="flex justify-center mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => window.location.reload()}
        >
          Randomize Card
        </button>
      </div>
      <div className="text-center mb-4">
        <span className="font-bold">Attempts Left:</span>{" "}
        {[...Array(3 - wrongAttempts)].map((_, index) => (
          <span key={index}>❤️</span>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="border-collapse border border-gray-400 mx-auto mb-4">
          <tbody>
            {grid.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((word, colIndex) => {
                  const clickedCell = clickedCells.find(
                    (cell) => cell.row === rowIndex && cell.col === colIndex
                  );
                  const cellColor = clickedCell
                    ? clickedCell.correct
                      ? "bg-green-300"
                      : "bg-red-300"
                    : "bg-white";
                  return (
                    <td
                      key={colIndex}
                      onClick={() => handleClick(rowIndex, colIndex)}
                      className={`border border-gray-400 p-4 text-center ${cellColor}  ${
                        gameOver ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                    >
                      {word}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerPage;
