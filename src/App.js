import {useState} from "react";

const Square = ({ value, squareIndex, onSquareClick, winningLines }) => {
    return (
        <button className={
            winningLines && winningLines.includes(squareIndex)
                ? "square-winning"
                : "square"
        } onClick={onSquareClick}>
            {value}
        </button>
    )
}

function Board({ xIsNext, squares, onPlay }) {
    const handleClick = (i) => {
        const locations = [
            // col, row
            [1, 1],
            [2, 1],
            [3, 1],
            [1, 2],
            [2, 2],
            [3, 2],
            [3, 1],
            [3, 2],
            [3, 3]
        ]

        if (squares[i] || calculateWinner(squares)) { // check if square already has value or if game has ended(someone won), if yes, then return(leave function)
            return
        }

        const nextSquares = squares.slice() // copy of squares

        if (xIsNext) { // check if it is X or O
            nextSquares[i] = "X" // update array
        } else {
            nextSquares[i] = "O" // update array
        }
        onPlay(nextSquares, locations[i]) // So Game component update Board component
    }

    const winner = calculateWinner(squares) && calculateWinner(squares).winner;
    const lines = calculateWinner(squares) && calculateWinner(squares).lines;
    let status
    if (winner) {
        status = "Winner: " + winner
    } else {
        status = "Next player: " + ( xIsNext ? "X" : "O" )
    }

    const initializeBoard = () => {
        return Array(3).fill(null).map((_, rowIndex) => (
            <div className="board-row">
                {Array(3).fill(null).map((_, colIndex) => {
                    const squaresIndex = rowIndex * 3 + colIndex
                    return (
                        <Square
                            key = {squaresIndex}
                            value = {squares[squaresIndex]}
                            squareIndex = {squaresIndex}
                            onSquareClick = {() => handleClick(squaresIndex)}
                            winningLines={lines}
                        />
                    )
                })}
            </div>
        ))
    }

    return (
        <>
            <div className="status">{status}</div>
            {initializeBoard()}
        </>
    )
}

export default function Game() { // new top-level component
    const [history, setHistory] = useState([Array(9).fill(null)]) // array of arrays
    const [currentMove, setCurrentMove] = useState(0);
    const [ascending, setAscending] = useState(false);
    const [movesCoordinates, setMovesCoordinates] = useState([]);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove] // currently selected move

    const handlePlay = (nextSquare, coordinateSquare) => {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquare]; // history to begin from moment we time traveled
        setHistory(nextHistory) // spread operator + newly passed argument
        setMovesCoordinates([...movesCoordinates.slice(0, currentMove), coordinateSquare]); // copy of previous coordonates (works like history)
        setCurrentMove(nextHistory.length - 1) // currently selected move
    }

    const jumpTo = (nextMove) => { // back tracking
        setCurrentMove(nextMove)
    }

    const moves = history.map((squares, move) => {
        let description
        if (move > 0) {
            description = 'Go to move #' + move + " Col: " + movesCoordinates[move - 1][0] + " Row: " + movesCoordinates[move - 1][1]
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
                <Board key={"1"} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
                <span className = "info-span">You're at move # {currentMove}</span>
            </div>
            <div className="game-info">
                <button className="sortBtn" onClick={() => setAscending(!ascending)}>Reverse</button>
                <ol>
                    {!ascending ? moves : moves.reverse()}
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
            return {
                winner: squares[a],
                lines: [a, b, c]
            }
        }
    }
    return null
}
