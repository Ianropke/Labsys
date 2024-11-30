// index.js
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './App.css'; // Import the updated CSS file

function App() {
  // Your card data
  const cardData = [
    // ... (Same card data as before)
    {
      id: 1,
      title: 'AI Roadmap',
      emoji: '🧠',
      details:
        'I 2024 samarbejdede sektionen med DTU-studerende for at udarbejde en roadmap for AI.',
      theme: 'Innovation',
      color: '#ffcccb',
    },
    // ... (Other cards)
    {
      id: 8,
      title: 'Kurser',
      emoji: '📚',
      details:
        '16 kurser gennemført i emner fra ITIL til cybersikkerhed.',
      theme: 'Læring',
      color: '#00ced1',
    },
  ];

  // State variables
  const [cards, setCards] = useState([]);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [matchedCards, setMatchedCards] = useState([]);
  const [showDetails, setShowDetails] = useState(null); // For displaying match details

  const [moves, setMoves] = useState(0); // For counting moves
  const [time, setTime] = useState(0); // For tracking time in seconds
  const [gameActive, setGameActive] = useState(true); // To control the timer

  // Function to shuffle and prepare the cards
  const initializeGame = () => {
    const cardsArray = [
      ...cardData.map((card) => ({ ...card, type: 'achievement' })),
      ...cardData.map((card) => ({ ...card, type: 'theme' })),
    ];

    const shuffledCards = cardsArray
      .map((card) => ({ ...card, uniqueId: Math.random() }))
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, flipped: false }));

    setCards(shuffledCards);
    setFirstCard(null);
    setSecondCard(null);
    setDisabled(false);
    setMatchedCards([]);
    setShowDetails(null);
    setMoves(0); // Reset moves
    setTime(0); // Reset timer
    setGameActive(true); // Start the timer
  };

  useEffect(() => {
    initializeGame();
  }, []);

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameActive) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [gameActive]);

  // Handle card click
  const handleCardClick = (clickedCard) => {
    if (disabled) return;
    if (clickedCard.flipped) return;

    const updatedCards = cards.map((card) =>
      card.uniqueId === clickedCard.uniqueId ? { ...card, flipped: true } : card
    );
    setCards(updatedCards);

    if (!firstCard) {
      setFirstCard(clickedCard);
    } else {
      setSecondCard(clickedCard);
      setDisabled(true);
      setMoves((prevMoves) => prevMoves + 1); // Increment moves
    }
  };

  useEffect(() => {
    if (firstCard && secondCard) {
      if (
        firstCard.id === secondCard.id &&
        firstCard.type !== secondCard.type
      ) {
        // It's a match!
        setMatchedCards((prev) => [...prev, firstCard.id]);
        setShowDetails(firstCard.details); // Show details of the matched achievement
        resetTurn();
      } else {
        // Not a match
        setTimeout(() => {
          const updatedCards = cards.map((card) =>
            card.uniqueId === firstCard.uniqueId ||
            card.uniqueId === secondCard.uniqueId
              ? { ...card, flipped: false }
              : card
          );
          setCards(updatedCards);
          resetTurn();
        }, 1000);
      }
    }
  }, [firstCard, secondCard]);

  const resetTurn = () => {
    setFirstCard(null);
    setSecondCard(null);
    setDisabled(false);

    // Check if the game is over
    if (matchedCards.length + 1 === cardData.length) {
      setGameActive(false); // Stop the timer
    }
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Året der gik i Laboratoriesystemer 2024</h1>
        <div className="stats">
          <p>⏱️ Tid: {time} sekunder</p>
          <p>🔄 Træk: {moves}</p>
        </div>
        <button onClick={initializeGame}>Prøv igen</button>
      </div>

      {/* Wrap the game area in a container */}
      <div className="game-container">
        <div className="card-grid">
          {cards.map((card) => (
            <div
              key={card.uniqueId}
              className={`card ${card.flipped ? 'flipped' : ''}`}
              onClick={() => handleCardClick(card)}
            >
              <div className="card-inner">
                {card.flipped || matchedCards.includes(card.id) ? (
                  <div
                    className="card-front"
                    style={{ backgroundColor: card.color }}
                  >
                    {card.type === 'achievement' ? (
                      <>
                        <div className="emoji">{card.emoji}</div>
                        <div className="title">{card.title}</div>
                      </>
                    ) : (
                      <div className="theme">{card.theme}</div>
                    )}
                  </div>
                ) : (
                  <div className="card-back">?</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Display match details in a modal */}
      {showDetails && (
        <div className="modal">
          <div className="modal-content">
            <h2>Match fundet!</h2>
            <p>{showDetails}</p>
            <button onClick={() => setShowDetails(null)}>Luk</button>
          </div>
        </div>
      )}

      {/* Display a message when the game is completed */}
      {!gameActive && matchedCards.length === cardData.length && (
        <div className="modal">
          <div className="modal-content">
            <h2>🎉 Tillykke!</h2>
            <p>
              Du fandt alle parrene på {time} sekunder med {moves} træk.
            </p>
            <button onClick={() => initializeGame()}>Spil igen</button>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
