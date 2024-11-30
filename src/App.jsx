import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import PropTypes from 'prop-types';

const shuffleArray = (array) => {
  let shuffled = array.slice(); // Create a copy
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Card = ({ card, index, isFlipped, isMatched, handleClick }) => {
  const { title, emoji, theme, color, type } = card;

  const cardStyles = {
    height: '120px',
    backgroundColor: isFlipped || isMatched ? color || '#4a90e2' : '#e0e0e0',
    borderRadius: '12px',
    cursor: isMatched ? 'default' : 'pointer',
    padding: '10px',
    textAlign: 'center',
    transition: 'transform 0.4s ease, background-color 0.4s ease, box-shadow 0.3s ease',
    transformStyle: 'preserve-3d',
    position: 'relative',
    transform: isFlipped ? 'rotateY(0)' : 'rotateY(180deg)',
    boxShadow: isFlipped ? '0 5px 15px rgba(0, 0, 0, 0.2)' : 'none',
  };

  const frontStyles = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    transform: 'rotateY(0deg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  };

  const backStyles = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    transform: 'rotateY(180deg)',
    backgroundColor: '#e0e0e0',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
  };

  return (
    <div
      role="button"
      tabIndex="0"
      aria-label={`Card ${index}`}
      onClick={() => handleClick(index)}
      onKeyPress={(e) => e.key === 'Enter' && handleClick(index)}
      style={cardStyles}
    >
      <div style={frontStyles}>
        {type === 'achievement' ? (
          <>
            <div style={{ fontSize: '30px', fontWeight: 'bold' }}>{emoji}</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '5px' }}>{title}</div>
          </>
        ) : (
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{theme}</div>
        )}
      </div>
      <div style={backStyles}>✨</div>
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

const ProgressBar = ({ matchedCount, totalCards, hintUsed, showHint, score }) => {
  const progressPercentage = (matchedCount / totalCards) * 100;
  return (
    <div
      style={{
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        display: 'inline-block',
        textAlign: 'center',
        width: 'fit-content',
      }}
    >
      <h2 style={{ margin: '0 0 15px', fontSize: '18px', fontWeight: 'bold' }}>Progress</h2>
      <div
        style={{
          background: '#e0e0e0',
          borderRadius: '10px',
          overflow: 'hidden',
          width: '300px',
          height: '24px',
          position: 'relative',
          margin: '0 auto 15px',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(90deg, #4a90e2, #00ced1)',
            width: `${progressPercentage}%`,
            height: '100%',
            transition: 'width 0.5s ease',
          }}
        ></div>
        <p
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'black',
            margin: 0,
          }}
        >
          {Math.round(progressPercentage)}%
        </p>
      </div>
      <div style={{ marginTop: '10px' }}>
        <h2>Score: {score}</h2>
      </div>
      <button
        onClick={showHint}
        disabled={hintUsed}
        style={{
          backgroundColor: hintUsed ? '#ccc' : '#4a90e2',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: hintUsed ? 'not-allowed' : 'pointer',
          marginTop: '10px',
        }}
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

const Modal = ({ matchDetails, closeDetails }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '80%',
        maxHeight: '80%',
        overflowY: 'auto',
      }}
    >
      <h2>Matched! 🎉</h2>
      <p>{matchDetails}</p>
      <button
        onClick={closeDetails}
        style={{
          backgroundColor: '#4a90e2',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          marginTop: '10px',
          cursor: 'pointer',
        }}
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

const App = () => {
  const achievements = [
    // ... (same as before)
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

  useEffect(() => {
    const gameCards = shuffleArray([
      ...achievements.map((a) => ({ ...a, type: 'achievement' })),
      ...achievements.map((a) => ({ ...a, type: 'theme' })),
    ]);
    setCards(gameCards);
  }, []);

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

  useEffect(() => {
    if (matched.size === cards.length && cards.length > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [matched]);

  const handleClick = (index) => {
    if (flipped.length === 2 || matched.has(index) || flipped.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;

      if (cards[first].id === cards[second].id) {
        setTimeout(() => {
          setMatched(new Set([...matched, first, second]));
          setScore(score + 100);
          setFlipped([]);
          setMatchDetails(cards[first].details);
        }, 1000);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setScore(Math.max(0, score - 10));
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
      groups[card.id] = groups[card.id] || [];
      groups[card.id].push(card.index);
      return groups;
    }, {});

    const pair = Object.values(cardGroups).find((group) => group.length === 2);

    if (!pair) {
      return;
    }

    setFlipped(pair);
    setTimeout(() => {
      setFlipped([]);
    }, 1000);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
        minHeight: '100vh',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} />}

      <h1
        style={{
          marginBottom: '20px',
          background: 'linear-gradient(90deg, #4a90e2, #f9a602)',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          fontWeight: 'bold',
          fontSize: 'calc(2.5rem + 1vw)',
          lineHeight: '1.2',
          wordBreak: 'break-word',
        }}
      >
        🧪 Laboratoriesystemer 2024 🧪
      </h1>

      <ProgressBar
        matchedCount={matched.size}
        totalCards={cards.length}
        hintUsed={hintUsed}
        showHint={showHint}
        score={score}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: '10px',
          justifyContent: 'center',
          perspective: '1000px',
        }}
      >
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
