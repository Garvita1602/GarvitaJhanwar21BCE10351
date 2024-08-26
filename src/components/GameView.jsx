
import { useState } from 'react';

function GameView({ gameState, handleMove }) {
    const [selectedPiece, setSelectedPiece] = useState(null);

    const handlePieceClick = (piece) => {
        if (piece.startsWith(gameState.currentPlayer)) {
            setSelectedPiece(piece);
        }
    };

    const renderBoard = () => {
        let board = [];
        for (let y = 4; y >= 0; y--) {
            for (let x = 0; x < 5; x++) {
                const tileColor = (x + y) % 2 === 0 ? "white-tile" : "black-tile";
                const piece = Object.keys(gameState.positions).find(key =>
                    gameState.positions[key].x === x && gameState.positions[key].y === y
                );
                board.push(
                    <div
                        key={`${x}-${y}`}
                        className={`tile ${tileColor}`}
                        onClick={() => piece && handlePieceClick(piece)}
                    >
                        {piece && (
                            <div className={`piece ${piece === selectedPiece ? "selected" : ""} ${piece.startsWith("A") ? "player-a" : "player-b"}`}>
                                {piece.split('_')[1]}
                            </div>
                        )}
                    </div>
                );
            }
        }
        return board;
    };

    return (
        <div className="game-view">
            <div className="board">{renderBoard()}</div>
            <div className="controls">
                {selectedPiece && (
                    <div className="move-buttons">
                        <button onClick={() => handleMove(selectedPiece, "L")}>L</button>
                        <button onClick={() => handleMove(selectedPiece, "R")}>R</button>
                        <button onClick={() => handleMove(selectedPiece, "F")}>F</button>
                        <button onClick={() => handleMove(selectedPiece, "B")}>B</button>
                        {(selectedPiece.includes("H2") || selectedPiece.includes("H3")) && (
                            <>
                                <button onClick={() => handleMove(selectedPiece, "FL")}>FL</button>
                                <button onClick={() => handleMove(selectedPiece, "FR")}>FR</button>
                                <button onClick={() => handleMove(selectedPiece, "BL")}>BL</button>
                                <button onClick={() => handleMove(selectedPiece, "BR")}>BR</button>
                            </>
                        )}
                    </div>
                )}
            </div>
            <div className="game-info">
                <div>Current Player: {gameState.currentPlayer}</div>
                <div>Message: {gameState.message}</div>
            </div>
        </div>
    );
}

export default GameView;
