import { useState } from "react";

function Square({ value, onSquareClick, style }) {
  return (
    <button style={style} className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winObj = calculateWinner(squares);

  let status;
  if (winObj && winObj.winner) {
    status = "Winner: " + (winObj.winner ?? "");
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  console.log(squares);

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        {squares.slice(0, 3).map((square, idx) => {
          return (
            <Square
              key={idx}
              value={squares[idx]} //square
              onSquareClick={() => handleClick(idx)}
              style={
                winObj && winObj.winLine.includes(idx)
                  ? { background: "green" }
                  : {}
              }
            />
          );
        })}
        {/* <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} /> */}
      </div>
      <div className="board-row">
        {squares.slice(3, 6).map((square, idx) => {
          const index = idx + 3;
          return (
            <Square
              key={index}
              value={squares[index]} //square
              onSquareClick={() => handleClick(index)}
              style={
                winObj && winObj.winLine.includes(index)
                  ? { background: "green" }
                  : {}
              }
            />
          );
        })}
        {/* <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} /> */}
      </div>
      <div className="board-row">
        {squares.slice(6).map((square, idx) => {
          const index = idx + 6;
          return (
            <Square
              key={index}
              value={squares[index]} //square
              onSquareClick={() => handleClick(index)}
              style={
                winObj && winObj.winLine.includes(index)
                  ? { background: "green" }
                  : {}
              }
            />
          );
        })}
        {/* <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} /> */}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]); // [[null, null ...]]
  const [currentMove, setCurrentMove] = useState(0); // 0
  const xIsNext = currentMove % 2 === 0; // true
  const currentSquares = history[currentMove]; // [null, ...]
  const [isReversed, setIsReversed] = useState(false);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move, array) => {
    let description;
    if (isReversed) {
      if (move > 0) {
        description = "Go to move #" + move;
      } else {
        description = "Go to game start";
      }
      if (currentMove === move) {
        return <p>You are at move #{move}</p>;
      }
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    } else {
      const reverseIndex = array.length - 1 - move;

      if (reverseIndex > 0) {
        description = "Go to move #" + reverseIndex;
      } else {
        description = "Go to game start";
      }

      if (currentMove === reverseIndex) {
        return <p>You are at move #{reverseIndex}</p>;
      }
      return (
        <li key={move}>
          <button onClick={() => jumpTo(reverseIndex)}>{description}</button>
        </li>
      );
    }
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => setIsReversed(!isReversed)}>
          {isReversed ? "Descendent" : "Ascendent"}
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winLine: lines[i] };
    }
  }
  return null;
}
