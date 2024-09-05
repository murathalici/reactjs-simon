import React, { useState, useEffect } from "react";
import "./App.css"; // Import the custom CSS

// Define colors and their associated frequencies (in Hz)
const colors = ["green", "red", "yellow", "blue"];
const frequencies = {
  green: 261.6, // C4
  red: 329.6, // E4
  yellow: 392.0, // G4
  blue: 523.3, // C5
};

function App() {
  const [sequence, setSequence] = useState([]); // Game sequence
  const [currentStep, setCurrentStep] = useState(0); // Current step of the game
  const [isPlayerTurn, setIsPlayerTurn] = useState(false); // Player's turn flag
  const [isGameOver, setIsGameOver] = useState(false); // Game over flag
  const [message, setMessage] = useState("Click 'Start' to play!"); // Game message
  const [level, setLevel] = useState(1); // Current level
  const [audioContext, setAudioContext] = useState(null); // AudioContext for Web Audio API

  // Initialize AudioContext on component mount
  useEffect(() => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    setAudioContext(context);
  }, []);

  // Function to start the game
  const startGame = () => {
    const newSequence = [colors[Math.floor(Math.random() * colors.length)]];
    setSequence(newSequence);
    setCurrentStep(0);
    setIsGameOver(false);
    setLevel(1);
    setMessage("Watch the sequence...");
    playSequence(newSequence);
  };

  // Function to play the current sequence
  const playSequence = (sequence) => {
    setIsPlayerTurn(false);
    let i = 0;

    const interval = setInterval(() => {
      const color = sequence[i];
      playSound(color); // Play the tone for the current tile
      highlightTile(color);
      i++;
      if (i >= sequence.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsPlayerTurn(true);
          setMessage("Your turn!");
        }, 250);
      }
    }, 500);
  };

  // Function to play a tone associated with a tile color
  const playSound = (color) => {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator(); // Create an oscillator node
    const gainNode = audioContext.createGain(); // Create a gain node for volume control

    oscillator.connect(gainNode); // Connect oscillator to gain
    gainNode.connect(audioContext.destination); // Connect gain to output

    oscillator.type = "sine"; // Set waveform type
    oscillator.frequency.value = frequencies[color]; // Set frequency based on color

    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // Set volume

    oscillator.start(audioContext.currentTime); // Start the oscillator
    oscillator.stop(audioContext.currentTime + 0.5); // Stop after 0.5 seconds
  };

  // Function to highlight a tile
  const highlightTile = (color) => {
    const tile = document.getElementById(color);
    tile.classList.add("highlight");
    setTimeout(() => tile.classList.remove("highlight"), 250);
  };

  // Function to handle player's tile click
  const handleTileClick = (color) => {
    if (!isPlayerTurn || isGameOver) return;

    playSound(color); // Play the tone when the player clicks a tile
    highlightTile(color);

    if (color === sequence[currentStep]) {
      if (currentStep + 1 === sequence.length) {
        setMessage("Good job! Moving to the next level...");
        setLevel(level + 1);
        setTimeout(() => nextRound(), 500);
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else {
      setMessage(`Game Over! You reached Level ${level}`);
      setIsGameOver(true);
    }
  };

  // Function to start the next round
  const nextRound = () => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    const newSequence = [...sequence, newColor];
    setSequence(newSequence);
    setCurrentStep(0);
    playSequence(newSequence);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <h1 className="text-4xl text-white font-bold mb-6">Simon Memory Game</h1>
      <p className="text-xl text-white mb-4">{message}</p>
      <p className="text-lg text-white mb-4">Level: {level}</p>

      {/* Circular Simon Game Board */}
      <div className="simon-container relative">
        <div
          id="green"
          className="simon-tile green"
          onClick={() => handleTileClick("green")}
        ></div>
        <div
          id="red"
          className="simon-tile red"
          onClick={() => handleTileClick("red")}
        ></div>
        <div
          id="yellow"
          className="simon-tile yellow"
          onClick={() => handleTileClick("yellow")}
        ></div>
        <div
          id="blue"
          className="simon-tile blue"
          onClick={() => handleTileClick("blue")}
        ></div>
        <div className="center-circle"></div>
      </div>

      {/* Start/Restart Button */}
      <div className="mt-6">
        {isGameOver ? (
          <button
            onClick={startGame}
            className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-all"
          >
            Restart Game
          </button>
        ) : (
          <button
            onClick={startGame}
            className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-all"
          >
            Start Game
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
