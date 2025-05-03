import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./App.css";

const WORD_LIST = [
  "apple",
  "brave",
  "crane",
  "drape",
  "eagle",
  "flame",
  "grape",
  "hover",
  "input",
  "jolly",
  "kneel",
  "latch",
  "mango",
  "nerdy",
  "ocean",
  "pride",
  "quart",
  "raise",
  "shiny",
  "trace",
  "union",
  "vigor",
  "waltz",
  "xenon",
  "yacht",
  "zesty",
];

const WORD_CATEGORIES = {
  General: [
    "apple",
    "brave",
    "crane",
    "drape",
    "eagle",
    "flame",
    "grape",
    "hover",
    "input",
    "jolly",
    "kneel",
    "latch",
    "mango",
    "nerdy",
    "ocean",
    "pride",
    "quart",
    "raise",
    "shiny",
    "trace",
    "union",
    "vigor",
    "waltz",
    "xenon",
    "yacht",
    "zesty",
  ],
  Animals: ["tiger", "zebra", "panda", "camel", "horse", "sheep", "lemur"],
  Birds: ["eagle", "swan", "finch", "crane", "robin", "stork", "raven"],
  Fruits: ["apple", "mango", "grape", "lemon", "peach", "plum", "melon"],
};

const keyboardKeys = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

const Wordle = () => {
  const [showRules, setShowRules] = useState(false);

  const [currentGuess, setCurrentGuess] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(20);
  const [streak, setStreak] = useState(0);
  const [usedClue, setUsedClue] = useState(false);
  const [revealedLetters, setRevealedLetters] = useState([]);
  const [hardMode, setHardMode] = useState(false);
  const [requiredLetters, setRequiredLetters] = useState([]);
  const [category, setCategory] = useState("General");
  const getRandomWord = (cat = category) => {
    const list = WORD_CATEGORIES[cat];
    return list[Math.floor(Math.random() * list.length)].toUpperCase();
  };
  const [targetWord, setTargetWord] = useState(getRandomWord());
  const handleKeyPress = (key) => {
    if (key === "Enter") {
      if (currentGuess.length !== 5) return;

      // Hard mode enforcement
      if (hardMode) {
        for (let { letter, position } of requiredLetters) {
          if (
            (position !== -1 && currentGuess[position] !== letter) ||
            (position === -1 && !currentGuess.includes(letter))
          ) {
            setMessage(
              `Hard Mode: Must reuse '${letter}' ${
                position !== -1 ? `at position ${position + 1}` : ""
              }`
            );
            return;
          }
        }
      }

      setGuesses([...guesses, currentGuess]);

      if (currentGuess === targetWord) {
        setMessage("You guessed it!");
        setScore(score + 10);
        setStreak(streak + 1);
        setTimeout(() => resetGame(), 1500);
      } else if (guesses.length >= 5) {
        setMessage(`You lost! Word was ${targetWord}`);
        setStreak(0);
        setTimeout(() => resetGame(), 2000);
      } else {
        setMessage("");
      }

      // Update required letters if hard mode is on
      if (hardMode) {
        const newRequired = [];
        currentGuess.split("").forEach((letter, idx) => {
          if (targetWord[idx] === letter) {
            newRequired.push({ letter, position: idx }); // green
          } else if (targetWord.includes(letter)) {
            newRequired.push({ letter, position: -1 }); // yellow
          }
        });
        setRequiredLetters((prev) => [...prev, ...newRequired]);
      }

      setCurrentGuess("");
    } else if (key === "Backspace") {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess(currentGuess + key.toUpperCase());
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => handleKeyPress(e.key);
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentGuess, guesses]);

  const getLetterStatus = (letter, index) => {
    if (targetWord[index] === letter) return "bg-green-500";
    else if (targetWord.includes(letter)) return "bg-yellow-400";
    else return "bg-gray-400";
  };

  const resetGame = () => {
    setTargetWord(getRandomWord());
    setGuesses([]);
    setCurrentGuess("");
    setMessage("");
    setUsedClue(false);
    setRevealedLetters([]);
    setRequiredLetters([]);
  };

  const getClue = () => {
    if (score < 5 || revealedLetters.length === targetWord.length) return;

    const unrevealedLetters = targetWord
      .split("")
      .filter((letter, i) => !revealedLetters.includes(i));
    if (unrevealedLetters.length === 0) return; // No more letters to reveal

    const randomIndex = Math.floor(Math.random() * unrevealedLetters.length);
    const clueLetter = unrevealedLetters[randomIndex];

    // Get index of the revealed clue letter
    const clueIndex = targetWord.indexOf(clueLetter);
    setRevealedLetters([...revealedLetters, clueIndex]);
    setMessage(`Clue: contains letter '${clueLetter}'`);
    setScore(score - 5);
  };

  return (
    <div className="min-h-screen p-1 bg-gray-900 text-white flex flex-col lg:flex-row">
      {/* Left Panel - Rules */}
      {/* Rules Panel (Visible on large screens, collapsible on mobile) */}
      {/* Mobile Rules Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowRules(!showRules)}
          className="bg-gray-700 px-4 py-2 rounded"
        >
          {showRules ? "Hide Rules" : "Show Rules"}
        </button>
      </div>

      <div
        className={`lg:w-1/3 lg:pr-4 lg:border-r border-gray-700 ${
          showRules ? "block" : "hidden"
        } lg:block`}
      >
        <h2 className="text-xl font-bold mb-3">Game Rules</h2>
        <ul className="text-sm list-disc pl-5 space-y-2">
          <li>Guess the 5-letter word in 6 tries.</li>
          <li>Green: correct letter and position.</li>
          <li>Yellow: correct letter, wrong position.</li>
          <li>Gray: letter not in the word.</li>
          <li>Each clue costs 5 points.</li>
          <li>Physical Keyboard Works too</li>
          <li>+10 points for a correct guess.</li>
          <li>-0 if you lose the round.</li>
        </ul>
        <h3 className="text-lg font-semibold mt-4">Hard Mode</h3>
        <ul className="text-sm list-disc pl-5 space-y-2">
          <li>Green letters must be reused in the same spot.</li>
          <li>Yellow letters must be reused somewhere in the guess.</li>
          <li>Hard mode resets the word when toggled.</li>
        </ul>
      </div>

      {/* Right Panel - Game */}
      <div className="lg:w-2/3 w-full flex flex-col items-center">
        <div className="w-full flex justify-center mb-2">
          <label className="mr-2 font-medium">Category:</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setTargetWord(getRandomWord(e.target.value));
              resetGame();
            }}
            className="bg-gray-800 text-white px-2 py-1 rounded"
          >
            {Object.keys(WORD_CATEGORIES).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <h1 className="text-3xl lg:text-5xl font-bold mb-4">Wordle Game</h1>
        <label className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={hardMode}
            onChange={() => {
              setHardMode((prev) => {
                const newMode = !prev;
                resetGame(); // Reset when mode is toggled
                return newMode;
              });
            }}
          />
          <span>Hard Mode</span>
        </label>

        <p className="mb-2">
          Score: {score} | Streak: {streak}
        </p>
        <button
          onClick={getClue}
          disabled={score < 5 || revealedLetters.length === targetWord.length}
          className="mb-2"
        >
          Use 5 Points for Clue
        </button>

        <div className="grid grid-rows-6 gap-2 mb-4">
          {[...guesses, currentGuess.padEnd(5)]
            .slice(0, 6)
            .map((guess, rowIdx) => (
              <div key={rowIdx} className="flex gap-2 justify-center">
                {guess.split("").map((letter, i) => (
                  <motion.div
                    key={i}
                    className={`w-12 h-12 flex items-center justify-center rounded text-xl font-bold border border-gray-500 ${
                      rowIdx < guesses.length
                        ? getLetterStatus(letter, i)
                        : "bg-gray-800"
                    }`}
                  >
                    {letter}
                  </motion.div>
                ))}
              </div>
            ))}
        </div>

        {message && <p className="mb-2 text-yellow-300">{message}</p>}

        {/* Keyboard */}
        <div className="space-y-2 mt-4">
          {keyboardKeys.map((row, i) => (
            <div key={i} className="flex justify-center gap-1">
              {i === 2 && (
                <button
                  onClick={() => handleKeyPress("Backspace")}
                  className="px-2 py-1"
                >
                  ⌫
                </button>
              )}
              {row.map((key) => (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className="px-3 py-2 text-sm"
                >
                  {key}
                </button>
              ))}
              {i === 2 && (
                <button
                  onClick={() => handleKeyPress("Enter")}
                  className="px-2 py-1"
                >
                  ⏎
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wordle;
