import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Zyd from "./zyd.png";
import swas from "./swas.png";
import scream from "./scream.mp3";
import gas from "./gas.mp3";

function App() {
  const [randomPositions, setRandomPositions] = useState([]);
  const [score, setScore] = useState(0);
  const [cps, setCps] = useState(0);
  const clickCountRef = useRef(0);
  const MAX_IMAGES = 10;

  const generateRandomPosition = () => {
    const randomX = Math.floor(Math.random() * (window.innerWidth - 50));
    const randomY = Math.floor(Math.random() * (window.innerHeight - 50));
    return { x: randomX, y: randomY };
  };

  const checkOverlap = (newPosition) => {
    return randomPositions.some(
      (position) =>
        Math.abs(position.x - newPosition.x) < 50 && Math.abs(position.y - newPosition.y) < 50
    );
  };

  const addImage = () => {
    const newPosition = generateRandomPosition();
    if (!checkOverlap(newPosition)) {
      setRandomPositions((prevPositions) => [...prevPositions, newPosition]);
    } else {
      addImage();
    }
  };

  useEffect(() => {
    addImage();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCps(clickCountRef.current);
      clickCountRef.current = 0;
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const playRandomSound = () => {
    const sounds = [scream, gas];
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
    const audio = new Audio(randomSound);
    audio.play();
  };

  const handleImageClick = (index) => {
    playRandomSound();

    setRandomPositions((prevPositions) => {
      const updatedPositions = prevPositions.filter((_, i) => i !== index);

      const newPositions = [];
      if (updatedPositions.length < MAX_IMAGES) {
        for (let i = 0; i < 2; i++) {
          if (updatedPositions.length < MAX_IMAGES) {
            const newPosition = generateRandomPosition();
            if (!checkOverlap(newPosition)) {
              newPositions.push(newPosition);
            } else {
              i--;
            }
          } else {
            break;
          }
        }
      }

      return [...updatedPositions, ...newPositions];
    });

    setScore((prevScore) => prevScore + 1);
    clickCountRef.current += 1;
  };

  const resetGame = () => {
    setScore(0);
    setRandomPositions([]);
    addImage();
  };

  return (
    <div className="App">
      <header className="header">
        <div className="Score">
          Score: {score}
        </div>
        <div className="hamburger">
          <img src={swas} alt="hamburger icon" onClick={resetGame} />
        </div>
      </header>

      <div className="main">
        {randomPositions.map((position, index) => (
          <img
            key={index}
            src={Zyd}
            alt="Zyd"
            className="random-image"
            style={{
              position: 'absolute',
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: '50px',
              height: '50px',
            }}
            onClick={() => handleImageClick(index)}
          />
        ))}
      </div>

      <div className="CPS">
        CPS: {cps}
      </div>
    </div>
  );
}

export default App;
