import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import "./ExtendedBoard.css";

const verticalAxis = ["1", "2", "3", "4", "5"];
const horizontalAxis = ["a", "b", "c", "d", "e"];

interface Position {
    x: number;
    y: number;
}

interface Positions {
    [key: string]: Position;
}

const initialSetup = {
    A: ["A-P1", "A-H1", "A-H2", "A-P2", "A-P3", "A-H3"],
    B: ["B-P1", "B-H1", "B-H2", "B-P2", "B-P3", "B-H3"]
};

const ExtendedBoard: React.FC = () => {
    const [positions, setPositions] = useState<Positions>({});
    const [history, setHistory] = useState<string[]>([]);
    const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
    const [currentPlayer, setCurrentPlayer] = useState<string>("A");
    const [message, setMessage] = useState<string>("");
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [heroCount, setHeroCount] = useState<{ A: number, B: number }>({ A: 3, B: 3 });
    const [winner, setWinner] = useState<string | null>(null);
    const [validMoves, setValidMoves] = useState<Position[]>([]); // Updated type

    useEffect(() => {
        const deployCharacters = (player: string, characters: string[]) => {
            const newPositions: Positions = {};
            characters.forEach((char, index) => {
                const x = index;
                const y = player === "A" ? 0 : 5;
                newPositions[`${player}_${char}`] = { x, y };
            });
            setPositions(prevPositions => ({ ...prevPositions, ...newPositions }));
        };

        deployCharacters("A", initialSetup.A);
        deployCharacters("B", initialSetup.B);
    }, []);
    const handlePieceClick = (piece: string) => {
        if (!gameOver && piece.startsWith(currentPlayer)) {
            setSelectedPiece(piece);
            const moves = getValidMoves(piece);
            setValidMoves(moves);
        }
    };

    const handleMoveClick = (move: string) => {
        if (selectedPiece) {
            const [x, y] = move.split(',').map(Number);
            const result = movePiece(selectedPiece, { x, y });
            if (result.valid) {
                setHistory(prevHistory => [...prevHistory, `${selectedPiece} moved to (${x},${y})`]);
                setCurrentPlayer(currentPlayer === "A" ? "B" : "A");
                setSelectedPiece(null);
                setValidMoves([]);
                checkGameOver();
            } else {
                setMessage(result.message || "Invalid move. Try again.");
            }
        } else {
            setMessage("Select a piece to move.");
        }
    };

    const isCollision = (x: number, y: number, player: string): boolean => {
        const targetKey = Object.keys(positions).find(key =>
            positions[key].x === x && positions[key].y === y && key.startsWith(player)
        );
        return !!targetKey;
    };

    const validateMove = (piece: string, direction: string): boolean => {
        if (!piece || !direction) return false;

        const { x, y } = positions[piece];
        const [player, characterType] = piece.split("_");
        const isPlayerB = player === "B";

        let newX = x;
        let newY = y;

        const moveStep = characterType === "H3" ? 2 : (characterType === "H1" || characterType === "H2") ? 2 : 1;

        switch (direction) {
            case "L":
            case "R":
                newX += direction === "L" ? -moveStep : moveStep;
                break;
            case "F":
            case "B":
                newY += isPlayerB ? (direction === "F" ? -moveStep : moveStep) : (direction === "F" ? moveStep : -moveStep);
                break;
            case "FL":
            case "FR":
            case "BL":
            case "BR":
                if (characterType === "H2" || characterType === "H3") {
                    newX += direction.includes("R") ? moveStep : -moveStep;
                    newY += isPlayerB ? (direction.includes("F") ? -moveStep : moveStep) : (direction.includes("F") ? moveStep : -moveStep);
                }
                break;
            case "RF":
            case "RB":
            case "LF":
            case "LB":
                if (characterType === "H3") {
                    const [dx, dy] = {
                        "RF": [2, 1], "RB": [2, -1], "LF": [-2, 1], "LB": [-2, -1],
                        "FR": [1, 2], "BR": [-1, 2], "FL": [1, -2], "BL": [-1, -2]
                    }[direction];
                    newX += dx;
                    newY += dy;
                }
                break;
            default:
                return false;
        }

        if (newX < 0 || newX >= 6 || newY < 0 || newY >= 6) return false;

        if (["P1", "P2", "P3"].includes(characterType)) {
            if (Object.values(positions).some(pos => pos.x === newX && pos.y === newY)) {
                setMessage("Invalid move. Pawns cannot move to an occupied tile.");
                return false;
            }
        } else {
            if (isCollision(newX, newY, player)) {
                setMessage("Invalid move. Choose another member or different move.");
                return false;
            }
        }

        return true;
    };

    const checkGameOver = () => {
        const remainingPiecesA = Object.keys(positions).filter(key => key.startsWith("A"));
        const remainingPiecesB = Object.keys(positions).filter(key => key.startsWith("B"));

        if (remainingPiecesA.length === 0) {
            setGameOver(true);
            setWinner("B");
            setMessage("Player B wins! All of Player A's characters have been eliminated.");
        } else if (remainingPiecesB.length === 0) {
            setGameOver(true);
            setWinner("A");
            setMessage("Player A wins! All of Player B's characters have been eliminated.");
        }
    };

    const movePiece = (piece: string, newPosition: Position): { valid: boolean; message?: string } => {
        if (!piece) return { valid: false, message: "Invalid piece." };
        if (!piece.startsWith(currentPlayer)) return { valid: false, message: "It's not your turn!" };

        const validMoves = getValidMoves(piece);
        if (!validMoves.some(move => move.x === newPosition.x && move.y === newPosition.y)) {
            return { valid: false, message: "Invalid move for this piece." };
        }

        setPositions(prevPositions => {
            const newPositions = { ...prevPositions };
            const targetKey = Object.keys(newPositions).find(key =>
                newPositions[key].x === newPosition.x && newPositions[key].y === newPosition.y && !key.startsWith(currentPlayer)
            );

            if (targetKey) {
                delete newPositions[targetKey];
                if (targetKey.endsWith("H1") || targetKey.endsWith("H2") || targetKey.endsWith("H3")) {
                    setHeroCount(prevCount => ({
                        ...prevCount,
                        [targetKey.startsWith("A") ? "A" : "B"]: prevCount[targetKey.startsWith("A") ? "A" : "B"] - 1
                    }));
                }
            }

            newPositions[piece] = newPosition;
            return newPositions;
        });

        return { valid: true };
    };
    

    const getValidMoves = (piece: string): Position[] => {
        if (!piece) return [];
        const { x, y } = positions[piece];
        const [player, characterType] = piece.split("_");
        const validMoves: Position[] = [];
        const moveDirections = ["L", "R", "F", "B", "FL", "FR", "BL", "BR", "RF", "RB", "LF", "LB"];

        moveDirections.forEach(direction => {
            let newX = x;
            let newY = y;
            const moveStep = characterType === "H3" ? 2 : (characterType === "H1" || characterType === "H2") ? 2 : 1;

            switch (direction) {
                case "L":
                case "R":
                    newX += direction === "L" ? -moveStep : moveStep;
                    break;
                case "F":
                case "B":
                    newY += player === "B" ? (direction === "F" ? -moveStep : moveStep) : (direction === "F" ? moveStep : -moveStep);
                    break;
                case "FL":
                case "FR":
                case "BL":
                case "BR":
                    if (["H2", "H3"].includes(characterType)) {
                        newX += direction.includes("R") ? moveStep : -moveStep;
                        newY += player === "B" ? (direction.includes("F") ? -moveStep : moveStep) : (direction.includes("F") ? moveStep : -moveStep);
                    }
                    break;
                case "RF":
                case "RB":
                case "LF":
                case "LB":
                    if (characterType === "H3") {
                        const [dx, dy] = {
                            "RF": [2, 1], "RB": [2, -1], "LF": [-2, 1], "LB": [-2, -1],
                            "FR": [1, 2], "BR": [-1, 2], "FL": [1, -2], "BL": [-1, -2]
                        }[direction];
                        newX += dx;
                        newY += dy;
                    }
                    break;
            }

            if (newX >= 0 && newX < 6 && newY >= 0 && newY < 6 && validateMove(piece, direction)) {
                validMoves.push({ x: newX, y: newY });
            }
        });

        return validMoves;
    };
    const startNewGame = () => {
        setPositions({});
        setHistory([]);
        setSelectedPiece(null);
        setCurrentPlayer("A");
        setMessage("");
        setGameOver(false);
        setHeroCount({ A: 3, B: 3 });

        const deployCharacters = (player: string, characters: string[]) => {
            const newPositions: Positions = {};
            characters.forEach((char, index) => {
                const x = index;
                const y = player === "A" ? 0 : 5;
                newPositions[`${player}_${char}`] = { x, y };
            });
            setPositions(prevPositions => ({ ...prevPositions, ...newPositions }));
        };

        deployCharacters("A", initialSetup.A);
        deployCharacters("B", initialSetup.B);
        setWinner(null);
    };
    const renderBoard = () => {
        let board = [];

        for (let col = verticalAxis.length - 1; col >= 0; col--) {
            for (let row = 0; row < horizontalAxis.length; row++) {
                const tileColor = (row + col) % 2 === 0 ? "white-tile" : "black-tile";
                const piece = Object.keys(positions).find(key =>
                    positions[key].x === col && positions[key].y === row
                );
                board.push(
                    <div
                        key={`${row}-${col}`}
                        className={`tile ${tileColor}`}
                        onClick={() => piece && handlePieceClick(piece)}
                    >
                        {piece && (
                            <div
                                className={`piece ${piece === selectedPiece ? "selected" : ""} ${piece.startsWith("A") ? "player-a" : "player-b"}`}
                            >
                                {piece.replace("_", "")}
                            </div>
                        )}
                    </div>
                );
            }
        }

        return board;
    };

    return (
        <div className="extended-board-container">
            <div className="board">
                {[...Array(6)].map((_, row) => (
                    [...Array(6)].map((_, col) => {
                        const isLightSquare = (row + col) % 2 === 0;
                        const piece = Object.keys(positions).find(key => positions[key].x === col && positions[key].y === row);
                        return (
                            <div
                                key={`${row}-${col}`}
                                className={`square ${isLightSquare ? 'light' : 'dark'}`}
                                onClick={() => piece ? handlePieceClick(piece) : handleMoveClick(`${col},${row}`)}
                            >
                                {piece ? piece.split('_')[1] : ''}
                            </div>
                        );
                    })
                ))}
            </div>
            
            <div className="right-panel">
                <div className="controls">
                    <div className="message">{message}</div>
                    <div className="valid-moves">
                        {validMoves.map((move, index) => (
                            <button key={index} onClick={() => handleMoveClick(`${move.x},${move.y}`)}>
                                Move to ({move.x}, {move.y})
                            </button>
                        ))}
                    </div>
                    <div className="history">
                        <h3>Move History</h3>
                        <ul>
                            {history.map((move, index) => (
                                <li key={index}>{move}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="buttons-container">
                        <button onClick={startNewGame}>Start New Game</button>
                        <Link to="/">
                            <button className="back-to-home">Back to Home</button>
                        </Link>
                    </div>
                    
                </div>
                <div className="current-player">Current Player: {currentPlayer}</div>
            </div>
        </div>
    );
};

export default ExtendedBoard;


