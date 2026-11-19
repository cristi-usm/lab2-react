import { useState } from "react";

function Square({ value, onSquareClick, index }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      aria-label={`Câmpul ${index + 1}${value ? `, ${value}` : ""}`}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(index) {
    if (squares[index] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[index] = xIsNext ? "X" : "0";
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = `Câștigător: ${winner}`;
  } else if (squares.every(Boolean)) {
    status = "Remiză!";
  } else {
    status = `Următorul jucător: ${xIsNext ? "X" : "0"}`;
  }

  return (
    <>
      <div className="status" aria-live="polite">
        {status}
      </div>
      <div className="board" role="grid" aria-label="Tabla de X și 0">
        {Array.from({ length: 3 }, (_, row) => (
          <div className="board-row" role="row" key={row}>
            {Array.from({ length: 3 }, (_, column) => {
              const index = row * 3 + column;

              return (
                <Square
                  key={index}
                  value={squares[index]}
                  onSquareClick={() => handleClick(index)}
                  index={index}
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

export default function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((_, move) => {
    const description = move > 0 ? `Mutarea #${move}` : "Începutul jocului";

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)} disabled={move === currentMove}>
          {description}
        </button>
      </li>
    );
  });

  return (
    <main className="game-page">
      <h1>Joc de X și 0</h1>
      <div className="game">
        <section className="game-board" aria-label="Joc de X și 0">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
          />
        </section>
        <aside className="game-info">
          <h2>Istoric</h2>
          <ol>{moves}</ol>
        </aside>
      </div>
    </main>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}
