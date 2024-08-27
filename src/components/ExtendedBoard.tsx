import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import "./ExtendedBoard.css";

interface Position {
    x: number;
    y: number;
}

interface Positions {
    [key: string]: Position;
}

const initialSetup = {
    A: ["A-P1", "A-H1", "A-H2", "A-H3", "A-P2"],
    B: ["B-P1", "B-H1", "B-H2", "B-H3", "B-P2"]
};

const ExtendedBoard: React.FC = () => {
    const [positions, setPositions] = useState<Positions>({});
    const [history, setHistory] = useState<string[]>([]);
    const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
    const [currentPlayer, setCurrentPlayer] = useState<string>("A");
    const [message, setMessage] = useState<string>("");
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [winner, setWinner] = useState<string | null>(null);
    const [validMoves, setValidMoves] = useState<Position[]>([]);
    const [timer, setTimer] = useState<number>(300); // 5 minutes in seconds

    useEffect(() => {
        startNewGame();
    }, []);

    useEffect(() => {
        if (!gameOver && timer > 0) {
            const timerId = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(timerId);
        } else if (timer === 0) {
            endGame(currentPlayer === "A" ? "B" : "A", "Time's up!");
        }
    }, [timer, gameOver, currentPlayer]);

    const handlePieceClick = (piece: string) => {
        if (!gameOver && piece.startsWith(currentPlayer)) {
            setSelectedPiece(piece);
            const moves = getValidMoves(piece);
            setValidMoves(moves);
        }
    };

    const handleMoveClick = (move: Position) => {
        if (selectedPiece && !gameOver) {
            const result = movePiece(selectedPiece, move);
            if (result.valid) {
                checkGameOver();
            } else {
                setMessage(result.message || "Invalid move. Try again.");
            }
        } else {
            setMessage("Select a piece to move.");
        }
    };

    const isCollision = (x: number, y: number, player: string): boolean => {
        return Object.keys(positions).some(key =>
            positions[key].x === x && positions[key].y === y && key.startsWith(player)
        );
    };

    const validateMove = (piece: string, newX: number, newY: number): boolean => {
        if (!piece) return false;
        const [player, characterType] = piece.split("-");
        if (newX < 0 || newX >= 5 || newY < 0 || newY >= 5) return false;

        if (["P1", "P2"].includes(characterType)) {
            return !Object.values(positions).some(pos => pos.x === newX && pos.y === newY);
        } else {
            return !isCollision(newX, newY, player);
        }
    };

    const checkGameOver = () => {
        const remainingPiecesA = Object.keys(positions).filter(key => key.startsWith("A"));
        const remainingPiecesB = Object.keys(positions).filter(key => key.startsWith("B"));

        if (remainingPiecesA.length === 0) {
            endGame("B", "Player B wins! All of Player A's characters have been eliminated.");
        } else if (remainingPiecesB.length === 0) {
            endGame("A", "Player A wins! All of Player B's characters have been eliminated.");
        }
    };


    const endGame = (winningPlayer: string, message: string) => {
        setGameOver(true);
        setWinner(winningPlayer);
        setMessage(message);
    };

    const movePiece = (piece: string, newPosition: Position): { valid: boolean; message?: string } => {
        if (!piece) return { valid: false, message: "Invalid piece." };
        if (!piece.startsWith(currentPlayer)) return { valid: false, message: "It's not your turn!" };

        const validMoves = getValidMoves(piece);
        if (!validMoves.some(move => move.x === newPosition.x && move.y === newPosition.y)) {
            return { valid: false, message: "Invalid move." };
        }

        let killedPiece: string | null = null;

        setPositions(prevPositions => {
            const newPositions = { ...prevPositions };
            const { x: oldX, y: oldY } = newPositions[piece];
            const [player, characterType] = piece.split("-");

            // Determine if a piece is being killed
            if (characterType === "P1" || characterType === "P2") {
                const direction = player === "A" ? 1 : -1;
                if (newPosition.x === oldX && newPosition.y === oldY + direction) {
                    const targetKey = Object.keys(newPositions).find(key =>
                        newPositions[key].x === newPosition.x &&
                        newPositions[key].y === newPosition.y &&
                        !key.startsWith(player)
                    );
                    if (targetKey) {
                        killedPiece = targetKey;
                        delete newPositions[targetKey];
                    }
                }
            } else if (characterType === "H1" || characterType === "H2") {
                const dx = newPosition.x - oldX;
                const dy = newPosition.y - oldY;
                const steps = Math.max(Math.abs(dx), Math.abs(dy));
                for (let i = 1; i <= steps; i++) {
                    const checkX = oldX + Math.round((dx * i) / steps);
                    const checkY = oldY + Math.round((dy * i) / steps);
                    const targetKey = Object.keys(newPositions).find(key =>
                        newPositions[key].x === checkX &&
                        newPositions[key].y === checkY &&
                        !key.startsWith(player)
                    );
                    if (targetKey) {
                        killedPiece = targetKey;
                        delete newPositions[targetKey];
                        break; // Stop after the first kill found in the path
                    }
                }
            } else if (characterType === "H3") {
                const targetKey = Object.keys(newPositions).find(key =>
                    newPositions[key].x === newPosition.x &&
                    newPositions[key].y === newPosition.y &&
                    !key.startsWith(player)
                );
                if (targetKey) {
                    killedPiece = targetKey;
                    delete newPositions[targetKey];
                }
            }

            // Update the position of the piece
            newPositions[piece] = newPosition;
            return newPositions;
        });

        setHistory(prevHistory => [
            ...prevHistory,
            `${piece} moved to (${newPosition.x},${newPosition.y})${killedPiece ? ` (Killed: ${killedPiece})` : ''}`
        ]);

        setCurrentPlayer(currentPlayer === "A" ? "B" : "A");
        setSelectedPiece(null);
        setValidMoves([]);
        checkGameOver();

        return { valid: true };
    };




    const getValidMoves = (piece: string): Position[] => {
        if (!piece) return [];
        const { x, y } = positions[piece];
        const [player, characterType] = piece.split("-");
        const validMoves: Position[] = [];

        const isOpponent = (x: number, y: number) => {
            return Object.keys(positions).some(key =>
                positions[key].x === x && positions[key].y === y && !key.startsWith(player)
            );
        };

        const addMove = (newX: number, newY: number, checkPath = false) => {
            if (newX >= 0 && newX < 5 && newY >= 0 && newY < 5) {
                if (!checkPath || !isCollision(newX, newY, player)) {
                    if (checkPath || !Object.values(positions).some(pos => pos.x === newX && pos.y === newY)) {
                        validMoves.push({ x: newX, y: newY });
                    } else if (isOpponent(newX, newY)) {
                        validMoves.push({ x: newX, y: newY });
                    }
                }
            }
        };

        const direction = player === "A" ? 1 : -1;

        switch (characterType) {
            case "P1":
            case "P2":
                addMove(x, y + direction); // Forward
                addMove(x, y - direction); // Backward
                addMove(x - 1, y); // Left
                addMove(x + 1, y); // Right

                // Special case: Add opponent piece directly in front as a valid move
                if (isOpponent(x, y + direction)) {
                    validMoves.push({ x, y: y + direction });
                }
                break;

                
            case "H1":
                addMove(x, y + 2 * direction, true); // Forward
                addMove(x, y - 2 * direction, true); // Backward
                addMove(x - 2, y, true); // Left
                addMove(x + 2, y, true); // Right
                break;
            case "H2":
                addMove(x + 2, y + 2 * direction, true); // Forward-Right
                addMove(x - 2, y + 2 * direction, true); // Forward-Left
                addMove(x + 2, y - 2 * direction, true); // Backward-Right
                addMove(x - 2, y - 2 * direction, true); // Backward-Left
                break;
            case "H3":
                addMove(x + 1, y + 2 * direction); // Forward-Right
                addMove(x - 1, y + 2 * direction); // Forward-Left
                addMove(x + 1, y - 2 * direction); // Backward-Right
                addMove(x - 1, y - 2 * direction); // Backward-Left
                addMove(x + 2, y + direction); // Right-Forward
                addMove(x + 2, y - direction); // Right-Backward
                addMove(x - 2, y + direction); // Left-Forward
                addMove(x - 2, y - direction); // Left-Backward
                break;
        }

        return validMoves;
    };

    const startNewGame = () => {
        const newPositions: Positions = {};
        initialSetup.A.forEach((char, index) => {
            newPositions[char] = { x: index, y: 0 }; // No prefixing with "A-"
        });
        initialSetup.B.forEach((char, index) => {
            newPositions[char] = { x: index, y: 4 }; // No prefixing with "B-"
        });

        setPositions(newPositions);
        setHistory([]);
        setSelectedPiece(null);
        setCurrentPlayer("A");
        setMessage("");
        setGameOver(false);
        setWinner(null);
        setTimer(300);
    };


    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="extended-board-container">
            <div className="board">
                {[...Array(5)].map((_, row) => (
                    <React.Fragment key={row}>
                        {[...Array(5)].map((_, col) => {
                            const isLightSquare = (row + col) % 2 === 0;
                            const piece = Object.keys(positions).find(key => positions[key].x === col && positions[key].y === 4 - row);
                            const isValidMove = validMoves.some(move => move.x === col && move.y === 4 - row);
                            const isSelected = piece === selectedPiece;
                            return (
                                <div
                                    key={`${row}-${col}`}
                                    className={`square ${isLightSquare ? 'light' : 'dark'} ${isValidMove ? 'valid-move' : ''} ${isSelected ? 'selected' : ''}`}
                                    onClick={() => piece ? handlePieceClick(piece) : handleMoveClick({ x: col, y: 4 - row })}
                                >
                                    {piece || ''}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>

            <div className="right-panel">
                <div className="controls">
                    <div className="timer">Time Remaining: {formatTime(timer)}</div>
                    <div className="message">{message}</div>
                    {winner && <div className="winner">Player {winner} wins!</div>}
                    <div className="current-player">Current Player: {currentPlayer}</div>
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
            </div>
        </div>
    );
};

export default ExtendedBoard;