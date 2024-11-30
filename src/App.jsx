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

  const cardContainerStyles = {
    perspective: '1000px',
  };

  const cardStyles = {
    width: '100%',
    height: '120px',
    position: 'relative',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.6s',
    transform: isFlipped || isMatched ? 'rotateY(0deg)' : 'rotateY(180deg)',
    cursor: isMatched ? 'default' : 'pointer',
  };

  const cardFaceStyles = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const frontStyles = {
    ...cardFaceStyles,
    backgroundColor: color || '#4a90e2',
    color: 'white',
    transform: 'rotateY(0deg)',
    flexDirection: 'column',
    padding: '10px',
  };

  const backStyles = {
    ...cardFaceStyles,
    backgroundColor: '#e0e0e0',
    color: 'black',
    transform: 'rotateY(180deg)',
  };

  return (
    <div style={cardContainerStyles}>
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
      (group) =>
        group.length === 2 &&
        group[0].type !== group[1].type
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
          gridTemplateColumns: 'repeat(4, 1fr)', // Fixed 4 columns for symmetry
          gap: '10px',
          justifyItems: 'center',
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
