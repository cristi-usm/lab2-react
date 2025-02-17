import {useState} from "react";

const Square = ({ value, onSquareClick }) => {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    )
}

function Board({ xIsNext, squares, onPlay }) {
    const handleClick = (i) => {
        if (squares[i] || calculateWinner(squares)) { // check if square already has value or if game has ended(someone won), if yes, then return(leave function)
            return
        }

        const nextSquares = squares.slice() // copy of squares

        if (xIsNext) { // check if it is X or O
            nextSquares[i] = "X" // update array
        } else {
            nextSquares[i] = "O" // update array
        }
        onPlay(nextSquares) // So Game component update Board component
    }

    const winner = calculateWinner(squares)
    let status
    if (winner) {
        status = "Winner: " + winner
    } else {
        status = "Next player: " + ( xIsNext ? "X" : "O" )
    }

    return (
        <>
            <div className="status">{status}</div>
            <div className="board-row">
                <Square value = {squares[0]} onSquareClick = {() => handleClick(0)} />
                <Square value = {squares[1]} onSquareClick = {() => handleClick(1)} />
                <Square value = {squares[2]} onSquareClick = {() => handleClick(2)} />
            </div>

            <div className="board-row">
                <Square value = {squares[3]} onSquareClick = {() => handleClick(3)} />
                <Square value = {squares[4]} onSquareClick = {() => handleClick(4)} />
                <Square value = {squares[5]} onSquareClick = {() => handleClick(5)} />
            </div>

            <div className="board-row">
                <Square value = {squares[6]} onSquareClick = {() => handleClick(6)} />
                <Square value = {squares[7]} onSquareClick = {() => handleClick(7)} />
                <Square value = {squares[8]} onSquareClick = {() => handleClick(8)} />
            </div>
        </>
    )
}

export default function Game() { // new top-level component
    const [history, setHistory] = useState([Array(9).fill(null)]) // array of arrays
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove] // currently selected move

    const handlePlay = (nextSquare) => {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquare]; // history to begin from moment we time traveled
        setHistory(nextHistory) // spread operator + newly passed argument
        setCurrentMove(nextHistory.length - 1) // currently selected move
    }

    const jumpTo = (nextMove) => { // back tracking
        setCurrentMove(nextMove)
    }

    const moves = history.map((squares, move) => {
        let description
        if (move > 0) {
            description = 'Go to move #' + move
        } else {
            description = 'Go to game start'
        }

        return (
            <li key = {move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        )
    })

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <ol>
                    {moves}
                </ol>
            </div>
        </div>
    )
}

const calculateWinner = (squares) => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    for (let i = 1; i < lines.length; i++) {
        const [a, b, c] = lines[i]; // check lines and its fields
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {  // If same the element will be present on all three fields (from one of the lines[] variant), it will return player that won
            return squares[a];
        }
    }
    return null
}
