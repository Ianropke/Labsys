// App.jsx
import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import PropTypes from 'prop-types';
import './App.css'; // Ensure the import path matches the file location

const shuffleArray = (array) => {
  let shuffled = array.slice(); // Create a copy
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Updated Card component
const Card = ({ card, index, isFlipped, isMatched, handleClick }) => {
  const { title, emoji, theme, color, type } = card;

  return (
    <div className="card-container">
      <div
        className={`card ${isFlipped || isMatched ? 'flipped' : ''}`}
        onClick={() => handleClick(index)}
        onKeyPress={(e) => e.key === 'Enter' && handleClick(index)}
        role="button"
        tabIndex="0"
        aria-label={`Card ${index}`}
        style={{ cursor: isMatched ? 'default' : 'pointer' }}
      >
        <div className="card-face card-front">✨</div>
        <div
          className="card-face card-back"
          style={{
            backgroundColor: color || '#4a90e2', // Set background color directly
            display: 'flex',
            flexDirection: 'column',
            padding: '10px',
            color: 'white',
            transform: 'rotateY(180deg)',
            borderRadius: '12px',
            backfaceVisibility: 'hidden',
          }}
        >
          {type === 'achievement' ? (
            <>
              <div style={{ fontSize: '30px', fontWeight: 'bold' }}>{emoji}</div>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginTop: '5px',
                  textAlign: 'center',
                }}
              >
                {title}
              </div>
            </>
          ) : (
            <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>
              {theme}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Card.propTypes = {
  card: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isFlipped: PropTypes.bool.isRequired,
  isMatched: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
};

// ProgressBar component remains the same
const ProgressBar = ({ matchedCount, totalCards, hintUsed, showHint, score }) => {
  const progressPercentage = (matchedCount / totalCards) * 100;
  return (
    <div className="progress-bar-container">
      <h2 className="progress-title">Progress</h2>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercentage}%` }}
        ></div>
        <p className="progress-bar-text">{Math.round(progressPercentage)}%</p>
      </div>
      <div style={{ marginTop: '10px' }}>
        <h2>Score: {score}</h2>
      </div>
      <button
        onClick={showHint}
        disabled={hintUsed}
        className="hint-button"
        aria-label={hintUsed ? 'Hint already used' : 'Show hint'}
      >
        {hintUsed ? 'Hint Used' : 'Show Hint'}
      </button>
    </div>
  );
};

ProgressBar.propTypes = {
  matchedCount: PropTypes.number.isRequired,
  totalCards: PropTypes.number.isRequired,
  hintUsed: PropTypes.bool.isRequired,
  showHint: PropTypes.func.isRequired,
  score: PropTypes.number.isRequired,
};

// Modal component remains the same
const Modal = ({ matchDetails, closeDetails }) => {
  return (
    <div className="modal">
      <h2>Matched! 🎉</h2>
      <p>{matchDetails}</p>
      <button
        onClick={closeDetails}
        className="close-button"
        aria-label="Close details"
      >
        Close
      </button>
    </div>
  );
};

Modal.propTypes = {
  matchDetails: PropTypes.string.isRequired,
  closeDetails: PropTypes.func.isRequired,
};

// Main App component
const App = () => {
  const achievements = [
    { id: 1, title: 'AI Roadmap', emoji: '🧠', details: 'I 2024 samarbejdede sektionen med DTU-studerende for at udarbejde en roadmap for AI.', theme: 'Innovation', color: '#ffcccb' },
    { id: 2, title: 'Sektionsdag', emoji: '🌧️', details: 'Sektionen blev fanget i regn og hagl i GoBoats men stadig med (rimelig) højt humør.', theme: 'Team Spirit', color: '#add8e6' },
    { id: 3, title: 'Kritiske systemer', emoji: '🛡️', details: 'Sektionen har sikret, at 6 af regionens kritiske systemer kører stabilt.', theme: 'Driftsstabilitet', color: '#90ee90' },
    { id: 4, title: 'Udvikling af diagnostikken', emoji: '🏥', details: 'Forberedt digitalisering af patologi i Region Hovedstaden og fællesregionalt blodbanksystem.', theme: 'Digitalisering', color: '#f4a460' },
    { id: 5, title: 'Opgraderinger', emoji: '⚡', details: '21 succesfulde opgraderinger af systemer gennemført.', theme: 'Drift', color: '#9370db' },
    { id: 6, title: 'Nye kollegaer', emoji: '👥', details: '4 nye medarbejdere er blevet en vigtig del af sektionen.', theme: 'Vækst', color: '#ff69b4' },
    { id: 7, title: 'IT-systemer', emoji: '📈', details: 'Optimering af alle IT-systemer og lukning af forældede systemer.', theme: 'Optimering', color: '#4682b4' },
    { id: 8, title: 'Kurser', emoji: '📚', details: '16 kurser gennemført i emner fra ITIL til cybersikkerhed.', theme: 'Læring', color: '#00ced1' },
  ];

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [score, setScore] = useState(0);
  const [matchDetails, setMatchDetails] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Initialize the cards
  useEffect(() => {
    const gameCards = shuffleArray([
      ...achievements.map((a) => ({ ...a, type: 'achievement' })),
      ...achievements.map((a) => ({ ...a, type: 'theme' })),
    ]);
    setCards(gameCards);
    console.log('Cards array:', gameCards); // Add this line to verify cards are populated
  }, []);

  // Handle window resize for Confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show Confetti when all matches are found
  useEffect(() => {
    if (matched.size === cards.length && cards.length > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [matched, cards.length]);

  const handleClick = (index) => {
    if (flipped.length === 2 || matched.has(index) || flipped.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;

      if (cards[first].id === cards[second].id && cards[first].type !== cards[second].type) {
        setTimeout(() => {
          setMatched((prevMatched) => new Set([...prevMatched, first, second]));
          setScore((prevScore) => prevScore + 100);
          setFlipped([]);
          setMatchDetails(cards[first].details);
        }, 1000);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setScore((prevScore) => Math.max(0, prevScore - 10));
        }, 1000);
      }
    }
  };

  const closeDetails = () => setMatchDetails(null);

  const showHint = () => {
    if (hintUsed) return;
    setHintUsed(true);

    const unmatchedCards = cards
      .map((card, index) => ({ ...card, index }))
      .filter((card) => !matched.has(card.index));

    if (unmatchedCards.length < 2) return;

    const cardGroups = unmatchedCards.reduce((groups, card) => {
      const key = card.id;
      groups[key] = groups[key] || [];
      groups[key].push(card);
      return groups;
    }, {});

    const pair = Object.values(cardGroups).find(
      (group) => group.length === 2 && group[0].type !== group[1].type
    );

    if (!pair) {
      return;
    }

    setFlipped([pair[0].index, pair[1].index]);
    setTimeout(() => {
      setFlipped([]);
    }, 1000);
  };

  return (
    <div className="app-container">
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} />}

      <h1 className="app-title">🧪 Laboratoriesystemer 2024 🧪</h1>

      <ProgressBar
        matchedCount={matched.size}
        totalCards={cards.length}
        hintUsed={hintUsed}
        showHint={showHint}
        score={score}
      />

      <div className="cards-grid">
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index);
          const isMatched = matched.has(index);
          return (
            <Card
              key={index}
              card={card}
              index={index}
              isFlipped={isFlipped || isMatched}
              isMatched={isMatched}
              handleClick={handleClick}
            />
          );
        })}
      </div>

      {matchDetails && <Modal matchDetails={matchDetails} closeDetails={closeDetails} />}
    </div>
  );
};

export default App;
