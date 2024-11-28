import React, { useState, useEffect } from 'react';

const App = () => {
  const achievements = [
    { id: 1, title: "AI Roadmap", emoji: "🧠", details: "I 2024 samarbejdede sektionen med DTU studerende for at udarbejde en roadmap for AI.", theme: "Innovation", color: "#ffcccb" },
    { id: 2, title: "Sektionsdag", emoji: "🌧️", details: "Sektionen blev fanget i regn og hagl i GoBoats men stadig med (rimelig) højt humør.", theme: "Team Spirit", color: "#add8e6" },
    { id: 3, title: "Kritiske systemer", emoji: "🛡️", details: "Sektionen har sikret at 6 af regionens kritiske systemer kører stabilt.", theme: "Driftsstabilitet", color: "#90ee90" },
    { id: 4, title: "Udvikling af diagnostikken", emoji: "🏥", details: "Forberedt digitalisering af patologi i Region Hovedstaden og fællesregionalt blodbanksystem.", theme: "Digitalisering", color: "#f4a460" },
    { id: 5, title: "Opgraderinger", emoji: "⚡", details: "21 succesfulde opgraderinger af systemer gennemført.", theme: "Drift", color: "#9370db" },
    { id: 6, title: "Nye Kollegaer", emoji: "👥", details: "4 nye medarbejdere er blevet en vigtig del af sektionen.", theme: "Vækst", color: "#ff69b4" },
    { id: 7, title: "IT Systemer", emoji: "📈", details: "Optimering af alle IT-systemer og lukning af forældede systemer.", theme: "Optimering", color: "#4682b4" },
    { id: 8, title: "Kurser", emoji: "📚", details: "16 kurser gennemført i emner fra ITIL til cybersikkerhed gennemført.", theme: "Læring", color: "#00ced1" },
  ];

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [score, setScore] = useState(0);
  const [matchDetails, setMatchDetails] = useState(null);

  useEffect(() => {
    const gameCards = [
      ...achievements.map(a => ({ ...a, type: 'achievement' })),
      ...achievements.map(a => ({ ...a, type: 'theme' }))
    ]
      .slice(0, 16)
      .sort(() => Math.random() - 0.5);
    setCards(gameCards);
  }, []);

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

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Laboratoriesystemer 2024</h1>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'inline-block', margin: '0 10px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
          Score: {score}
        </div>
        <div style={{ display: 'inline-block', margin: '0 10px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
          Matches: {matched.size / 2} / {achievements.length}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
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
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: flipped.includes(index) || matched.has(index) ? 'white' : 'black',
              padding: '10px',
              textAlign: 'center',
              transition: 'transform 0.4s ease, background-color 0.4s ease',
              transform: flipped.includes(index) || matched.has(index) ? 'rotateY(0)' : 'rotateY(180deg)'
            }}
          >
            {flipped.includes(index) || matched.has(index) ? (
              <div>
                {card.type === 'achievement' ? (
                  <>
                    <div style={{ fontSize: '24px' }}>{card.emoji}</div>
                    <div style={{ fontSize: '12px' }}>{card.title}</div>
                  </>
                ) : (
                  <div style={{ fontWeight: 'bold' }}>{card.theme}</div>
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
