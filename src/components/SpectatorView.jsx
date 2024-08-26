
function SpectatorView({ gameState }) {
    const renderBoard = () => {
        let board = [];
        for (let y = 4; y >= 0; y--) {
            for (let x = 0; x < 5; x++) {
                const tileColor = (x + y) % 2 === 0 ? "white-tile" : "black-tile";
                const piece = Object.keys(gameState.positions).find(key =>
                    gameState.positions[key].x === x && gameState.positions[key].y === y
                );
                board.push(
                    <div key={`${x}-${y}`} className={`tile ${tileColor}`}>
                        {piece && (
                            <div className={`piece ${piece.startsWith("A") ? "player-a" : "player-b"}`}>
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
        <div className="spectator-view">
            <h3>Game in Progress (Spectator Mode)</h3>
            <div className="board">{renderBoard()}</div>
            <div className="game-info">
                <div>Current Player: {gameState.currentPlayer}</div>
                <div>Message: {gameState.message}</div>
            </div>
            <div className="move-history">
                <h4>Move History</h4>
                {gameState.history.map((move, index) => (
                    <div key={index}>{move}</div>
                ))}
            </div>
        </div>
    );
}

export default SpectatorView;