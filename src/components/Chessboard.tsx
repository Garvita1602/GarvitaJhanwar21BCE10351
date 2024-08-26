import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Chessboard.css";

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
    A: ["P1", "H1", "H2", "P2", "P3"],
    B: ["P1", "H1", "H2", "P2", "P3"]
};

export default function Chessboard() {
    const [positions, setPositions] = useState<Positions>({});
    const [history, setHistory] = useState<string[]>([]);
    const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
    const [currentPlayer, setCurrentPlayer] = useState<string>("A");
    const [message, setMessage] = useState<string>("");
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [heroCount, setHeroCount] = useState<{ A: number, B: number }>({ A: 2, B: 2 });
    const [winner, setWinner] = useState<string | null>(null);
    const [historyPositions, setHistoryPositions] = useState<Positions[]>([]);


    useEffect(() => {
        const deployCharacters = (player: string, characters: string[]) => {
            const newPositions: Positions = {};
            characters.forEach((char, index) => {
                const x = index;
                const y = player === "A" ? 0 : 4;
                newPositions[`${player}_${char}`] = { x, y };
            });
            setPositions(prevPositions => ({ ...prevPositions, ...newPositions }));
        };

        deployCharacters("A", initialSetup.A);
        deployCharacters("B", initialSetup.B);
    }, []);

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

        const moveStep = (characterType === "H1" || characterType === "H2") ? 2 : 1;

        switch (direction) {
            case "L":
            case "R":
                newX += (direction === "L" ? -moveStep : moveStep);
                break;
            case "F":
            case "B":
                newY += isPlayerB ? (direction === "F" ? -moveStep : moveStep) : (direction === "F" ? moveStep : -moveStep);
                break;
            case "FL":
            case "FR":
            case "BL":
            case "BR":
                if (characterType !== "H2") return false;
                newX += (direction.includes("R") ? moveStep : -moveStep);
                newY += isPlayerB ? (direction.includes("F") ? -moveStep : moveStep) : (direction.includes("F") ? moveStep : -moveStep);
                break;
            default:
                return false;
        }

        if (newX < 0 || newX >= 5 || newY < 0 || newY >= 5) return false;

        // Check for collision with any piece for P1, P2, P3
        if (characterType === "P1" || characterType === "P2" || characterType === "P3") {
            if (Object.values(positions).some(pos => pos.x === newX && pos.y === newY)) {
                setMessage("Invalid move. Pawns cannot move to an occupied tile.");
                return false;
            }
        } else {
            // For H1 and H2, only check collision with friendly pieces
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


    const movePiece = (piece: string, direction: string) => {
        setHistoryPositions(prev => [...prev, positions]);
        if (!piece || !direction) return;

        if (!piece.startsWith(currentPlayer)) {
            setMessage("It's not your turn!");
            return;
        }

        if (!validateMove(piece, direction)) {
            return;
        }

        let killedPiece: string | null = null;

        setPositions(prevPositions => {
            const newPositions = { ...prevPositions };
            const { x, y } = newPositions[piece];
            const [player, characterType] = piece.split("_");
            const isPlayerB = player === "B";

            let newX = x;
            let newY = y;

            const moveStep = (characterType === "H1" || characterType === "H2") ? 2 : 1;

            switch (direction) {
                case "L":
                    newX -= moveStep;
                    break;
                case "R":
                    newX += moveStep;
                    break;
                case "F":
                    newY += isPlayerB ? -moveStep : moveStep;
                    break;
                case "B":
                    newY += isPlayerB ? moveStep : -moveStep;
                    break;
                case "FL":
                case "FR":
                case "BL":
                case "BR":
                    if (characterType === "H2") {
                        newX += (direction.includes("R") ? moveStep : -moveStep);
                        newY += isPlayerB ? (direction.includes("F") ? -moveStep : moveStep) : (direction.includes("F") ? moveStep : -moveStep);
                    }
                    break;
            }

            // Combat logic only for H1 and H2
            if (characterType === "H1" || characterType === "H2") {
                for (let i = 1; i <= moveStep; i++) {
                    const intermediateX = x + (newX - x) * (i / moveStep);
                    const intermediateY = y + (newY - y) * (i / moveStep);
                    Object.keys(prevPositions).forEach(key => {
                        if (!key.startsWith(player) &&
                            prevPositions[key].x === Math.round(intermediateX) &&
                            prevPositions[key].y === Math.round(intermediateY)) {
                            killedPiece = key;  // Capture the killed piece
                            delete newPositions[key];
                        }
                    });
                }
            }

            newPositions[piece] = { x: newX, y: newY };

            setTimeout(() => checkGameOver(), 0);

            return newPositions;
        });

        // Update history with the move and the killed piece (if any)
        setHistory(prev => [...prev, `${piece}:${direction}${killedPiece ? ` (Killed: ${killedPiece})` : ""}`]);
        setCurrentPlayer(prev => (prev === "A" ? "B" : "A"));
        setMessage("");

        checkGameOver();
    };
    const undoMove = () => {
        if (historyPositions.length > 0) {
            const lastPosition = historyPositions[historyPositions.length - 1];
            setPositions(lastPosition);
            setHistoryPositions(historyPositions.slice(0, -1)); // Remove the last state from history
            setHistory(prev => prev.slice(0, -1)); // Remove last move from history
            setCurrentPlayer(prev => (prev === "A" ? "B" : "A")); // Switch back the turn
        }
    };


    const handlePieceClick = (piece: string) => {
        if (!gameOver && piece.startsWith(currentPlayer)) {
            setSelectedPiece(piece);
        }
    };

    const handleMoveClick = (direction: string) => {
        if (selectedPiece) {
            movePiece(selectedPiece, direction);
            setSelectedPiece(null);
        }
    };

    const renderBoard = () => {
        let board = [];

        for (let j = verticalAxis.length - 1; j >= 0; j--) {
            for (let i = 0; i < horizontalAxis.length; i++) {
                const tileColor = (i + j) % 2 === 0 ? "white-tile" : "black-tile";
                const piece = Object.keys(positions).find(key =>
                    positions[key].x === i && positions[key].y === j
                );
                board.push(
                    <div
                        key={`${i}-${j}`}
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

    const startNewGame = () => {
        setPositions({});
        setHistory([]);
        setSelectedPiece(null);
        setCurrentPlayer("A");
        setMessage("");
        setGameOver(false);
        setHeroCount({ A: 2, B: 2 });

        const deployCharacters = (player: string, characters: string[]) => {
            const newPositions: Positions = {};
            characters.forEach((char, index) => {
                const x = index;
                const y = player === "A" ? 0 : 4;
                newPositions[`${player}_${char}`] = { x, y };
            });
            setPositions(prevPositions => ({ ...prevPositions, ...newPositions }));
        };

        deployCharacters("A", initialSetup.A);
        deployCharacters("B", initialSetup.B);
        setWinner(null);
    };

    const addHero = () => {
        if (heroCount[currentPlayer as "A" | "B"] < 3) {
            setHeroCount(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer as "A" | "B"] + 1 }));
            const heroType = heroCount[currentPlayer as "A" | "B"] === 2 ? "H3" : `H${heroCount[currentPlayer as "A" | "B"] + 1}`;
            const newHeroKey = `${currentPlayer}_${heroType}`;
            setPositions(prev => {
                const newPositions = { ...prev };
                const x = Object.values(newPositions).filter(pos => pos.y === (currentPlayer === "A" ? 0 : 4)).length;
                const y = currentPlayer === "A" ? 0 : 4;
                newPositions[newHeroKey] = { x, y };
                return newPositions;
            });
            setMessage(`Added new hero ${newHeroKey}`);
        } else {
            setMessage("Maximum number of heroes reached for this player");
        }
    };

    return (
        <div className="game-container">
            <div className="game-title"> CHESS BATTLE IT IS!!</div>
            {gameOver ? (
                <div className="game-over-screen">
                    <h2>Game Over!</h2>
                    <h1>{winner ? `Player ${winner} Wins!` : "It's a draw!"}</h1>
                    <p>{message}</p>
                    <button onClick={startNewGame}>Start New Game</button>
                </div>
            ) : (
                <div className="game-content">
                    <div id="chessboard">{renderBoard()}</div>
                    <div className="move-history">
                        <h3>Move History</h3>
                        {history.map((move, index) => (
                            <div key={index}>{move}</div>
                        ))}
                    </div>
                    <div className="buttons-container">
                        

                        <button onClick={startNewGame}>Start New Game</button>
                        <Link to="/extended-board">
                            <button>Add Hero</button>
                        </Link>
                    </div>
                        
                </div>
            )}
            <div className="current-player">Current Player: {currentPlayer}</div>
            <div className="message">{message}</div>
            <div className="controls">
                {selectedPiece && !gameOver && (
                    <div className="move-buttons">
                        <button onClick={() => handleMoveClick("L")}>L</button>
                        <button onClick={() => handleMoveClick("R")}>R</button>
                        <button onClick={() => handleMoveClick("F")}>F</button>
                        <button onClick={() => handleMoveClick("B")}>B</button>
                        {(selectedPiece.includes("H2") || selectedPiece.includes("H3")) && (
                            <>
                                <button onClick={() => handleMoveClick("FL")}>FL</button>
                                <button onClick={() => handleMoveClick("FR")}>FR</button>
                                <button onClick={() => handleMoveClick("BL")}>BL</button>
                                <button onClick={() => handleMoveClick("BR")}>BR</button>
                            </>
                        )}
                        {selectedPiece.includes("H3") && (
                            <>
                                <button onClick={() => handleMoveClick("RF")}>RF</button>
                                <button onClick={() => handleMoveClick("RB")}>RB</button>
                                <button onClick={() => handleMoveClick("LF")}>LF</button>
                                <button onClick={() => handleMoveClick("LB")}>LB</button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
