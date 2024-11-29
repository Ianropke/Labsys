import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

const App = () => {
  const achievements = [
    { id: 1, title: "AI Roadmap", emoji: "🧠", details: "I 2024 samarbejdede sektionen med DTU-studerende for at udarbejde en roadmap for AI.", theme: "Innovation", color: "#ffcccb" },
    { id: 2, title: "Sektionsdag", emoji: "🌧️", details: "Sektionen blev fanget i regn og hagl i GoBoats men stadig med (rimelig) højt humør.", theme: "Team Spirit", color: "#add8e6" },
    { id: 3, title: "Kritiske systemer", emoji: "🛡️", details: "Sektionen har sikret, at 6 af regionens kritiske systemer kører stabilt.", theme: "Driftsstabilitet", color: "#90ee90" },
    { id: 4, title: "Udvikling af diagnostikken", emoji: "🏥", details: "Forberedt digitalisering af patologi i Region Hovedstaden og fællesregionalt blodbanksystem.", theme: "Digitalisering", color: "#f4a460" },
    { id: 5, title: "Opgraderinger", emoji: "⚡", details: "21 succesfulde opgraderinger af systemer gennemført.", theme: "Drift", color: "#9370db" },
    { id: 6, title: "Nye kollegaer", emoji: "👥", details: "4 nye medarbejdere er blevet en vigtig del af sektionen.", theme: "Vækst", color: "#ff69b4" },
    { id: 7, title: "IT-systemer", emoji: "📈", details: "Optimering af alle IT-systemer og lukning af forældede systemer.", theme: "Optimering", color: "#4682b4" },
    { id: 8, title: "Kurser", emoji: "📚", details: "16 kurser gennemført i emner fra ITIL til cybersikkerhed.", theme: "Læring", color: "#00ced1" }
  ];

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [score, setScore] = useState(0);
  const [matchDetails, setMatchDetails] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  useEffect(() => {
    const gameCards = [
      ...achievements.map(a => ({ ...a, type: 'achievement' })),
      ...achievements.map(a => ({ ...a, type: 'theme' }))
    ].sort(() => Math.random() - 0.5);
    setCards(gameCards);
  }, []);

  useEffect(() => {
    if (matched.size === cards.length) {
      setShowConfetti(true);
    }
  }, [matched, cards]);

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
      .filter(card => !matched.has(card.index));

    if (unmatchedCards.length < 2) return;

    const cardGroups = unmatchedCards.reduce((groups, card) => {
      groups[card.id] = groups[card.id] || [];
      groups[card.id].push(card.index);
      return groups;
    }, {});

    const pair = Object.values(cardGroups).find(group => group.length === 2);

    if (pair) {
      setFlipped(pair);
      setTimeout(() => {
        setFlipped([]);
      }, 1000);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
      minHeight: '100vh',
      padding: '20px'
    }}>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <h1
        style={{
          textAlign: 'center',
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

      <div style={{ marginBottom: '20px' }}>
        <div style={{
          background: '#e0e0e0',
          borderRadius: '10px',
          overflow: 'hidden',
          width: '100%',
          height: '20px',
          marginBottom: '10px',
          position: 'relative',
        }}>
          <div style={{
            background: 'linear-gradient(90deg, #4a90e2, #00ced1)',
            width: `${(matched.size / cards.length) * 100}%`,
            height: '100%',
            transition: 'width 0.5s ease',
          }}></div>
          <p style={{
            position: 'absolute',
            top: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '12px',
            fontWeight: 'bold',
            color: 'black',
          }}>
            {Math.round((matched.size / cards.length) * 100)}%
          </p>
        </div>
        <p style={{ textAlign: 'center', marginBottom: '10px' }}>
          Matches: {matched.size / 2} / {achievements.length}
        </p>
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
            display: 'block',
            margin: '0 auto',
          }}
        >
          {hintUsed ? 'Hint Used' : 'Show Hint'}
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '10px'
      }}>
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            style={{
              height: '120px',
              backgroundColor: flipped.includes(index) || matched.has(index)
                ? achievements.find(a => a.id === card.id)?.color || '#4a90e2'
                : '#e0e0e0',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: flipped.includes(index) || matched.has(index) ? 'white' : 'black',
              padding: '10px',
              textAlign: 'center',
              transition: 'transform 0.4s ease, background-color 0.4s ease, box-shadow 0.3s ease',
              transform: flipped.includes(index) || matched.has(index) ? 'rotateY(0)' : 'rotateY(180deg)',
              boxShadow: flipped.includes(index) || matched.has(index) ? '0 5px 15px rgba(0, 0, 0, 0.2)' : 'none'
            }}
          >
            {flipped.includes(index) || matched.has(index) ? (
              <div>
                {card.type === 'achievement' ? (
                  <>
                    <div style={{ fontSize: '30px', fontWeight: 'bold' }}>{card.emoji}</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '5px' }}>{card.title}</div>
                  </>
                ) : (
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{card.theme}</div>
                )}
              </div>
            ) : (
              '✨'
            )}
          </div>
        ))}
      </div>

      {matchDetails && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
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
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
