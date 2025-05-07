import React, { useState } from "react";

const Left = () => {
  const [showRules, setShowRules] = useState(false);

  return (
    <>
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
        <h2 className="text-xl lg:text-2xl font-bold mb-3 text-white-600">
          Game Rules
        </h2>
        <ul className="text-xl lg:text-base list-disc pl-5 space-y-2">
          <li className="lg:text-2xl text-blue-600 hover:text-blue-800">
            Guess the 5-letter word in 6 tries.
          </li>
          <li className="lg:text-2xl text-green-600 hover:text-green-800">
            Green: correct letter and position.
          </li>
          <li className="lg:text-2xl text-yellow-600 hover:text-yellow-800">
            Yellow: correct letter, wrong position.
          </li>
          <li className="lg:text-2xl text-shadow-gray-400 hover:text-gray-800">
            Gray: letter not in the word.
          </li>
          <li className="lg:text-2xl text-blue-600 hover:text-blue-800">
            Each clue costs 5 points.
          </li>
          <li className="lg:text-2xl text-purple-600 hover:text-purple-800">
            Physical Keyboard Works too
          </li>
          <li className="lg:text-2xl text-green-600 hover:text-green-800">
            +10 points for a correct guess.
          </li>
          <li className="lg:text-2xl text-white-600 hover:text-red-800">
            -0 if you lose the round.
          </li>
        </ul>

        <h3 className="text-xl lg:text-2xl font-bold mb-3 text-white-600">
          Hard Mode
        </h3>
        <ul className="text-sm lg:text-base list-disc pl-5 space-y-2">
          <li className="lg:text-2xl text-green-600 hover:text-green-800">
            Green letters must be reused in the same spot.
          </li>
          <li className="lg:text-2xl text-yellow-600 hover:text-yellow-800">
            Yellow letters must be reused somewhere in the guess.
          </li>
          <li className="lg:text-2xl text-white-600 hover:text-red-800">
            Hard mode resets the word when toggled.
          </li>
        </ul>
      </div>{" "}
    </>
  );
};

export default Left;
