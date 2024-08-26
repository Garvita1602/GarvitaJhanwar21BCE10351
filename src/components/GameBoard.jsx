import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import "./GameBoard.css";
import GameView from './GameView';
import SpectatorView from './SpectatorView';
import TeamSelection from './TeamSelection';

function GameBoard() {
    const [gameState, setGameState] = useState({
        positions: {},
        history: [],
        currentPlayer: "A",
        message: "",
        gameOver: false,
        winner: null
    });
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isSpectatorMode, setIsSpectatorMode] = useState(false);
    const [player1Team, setPlayer1Team] = useState([]);
    const [player2Team, setPlayer2Team] = useState([]);

    useEffect(() => {
        if (player1Team.length === 5 && player2Team.length === 5) {
            startNewGame();
        }
    }, [player1Team, player2Team]);

    const startNewGame = () => {
        const newPositions = {};
        [player1Team, player2Team].forEach((team, playerIndex) => {
            team.forEach((char, index) => {
                const x = index;
                const y = playerIndex === 0 ? 0 : 4;
                newPositions[`${playerIndex === 0 ? 'A' : 'B'}_${char}`] = { x, y };
            });
        });
        setGameState({
            positions: newPositions,
            history: [],
            currentPlayer: "A",
            message: "",
            gameOver: false,
            winner: null
        });
        setIsGameStarted(true);
    };

    const handleTeamSelect = (team, player) => {
        if (player === 1) setPlayer1Team(team);
        if (player === 2) setPlayer2Team(team);
    };

    const handleMove = (piece, direction) => {
        // Implement move logic here
        // Update gameState with new positions, history, etc.
        // Check for game over conditions
    };

    const toggleSpectatorMode = () => {
        setIsSpectatorMode(!isSpectatorMode);
    };

    return (
        <div className="game-container">
            <div className="game-title">CHESS BATTLE</div>
            <button onClick={toggleSpectatorMode}>
                {isSpectatorMode ? 'Join as Player' : 'Watch as Spectator'}
            </button>
            {!isGameStarted ? (
                <div className="team-selection-phase">
                    <TeamSelection onTeamSelect={(team) => handleTeamSelect(team, 1)} player="A" />
                    <TeamSelection onTeamSelect={(team) => handleTeamSelect(team, 2)} player="B" />
                </div>
            ) : (
                isSpectatorMode ? (
                    <SpectatorView gameState={gameState} />
                ) : (
                    <GameView gameState={gameState} handleMove={handleMove} />
                )
            )}
            <div className="buttons-container">
                <button onClick={startNewGame}>Start New Game</button>
                <Link to="/extended-board">
                    <button>Go to Extended Board</button>
                </Link>
            </div>
        </div>
    );
}

export default GameBoard;