import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import './LoginPage.css';

const LoginPage = () => {
    const navigate = useNavigate();  // Initialize useNavigate

    const handleStartGame = () => {
        navigate('/chessboard');  // Redirect to chessboard page
    };

    return (
        <div className="container">
            <button className="start-button" onClick={handleStartGame}>
                Start Game
            </button>
            <div className="rules-section">
                <h2>Game Rules</h2>
                <ul>
                    <li>Each player controls a team of 5 characters.</li>
                    <li>Characters move based on specific rules:</li>
                    <li>Pawn1, Pawn2, Pawn3 move one block in any direction.</li>
                    <li>Hero1 moves two blocks straight in any direction and kills opponents in its path.</li>
                    <li>Hero2 moves two blocks diagonally in any direction and kills opponents in its path.</li>
                    <li>You can add Hero3 by clicking the button.</li>
                    <li>Hero3 moves in an L-shape and kills the character at its final landing position if occupied by an opponent.</li>
                    <li>Deploy characters on the starting row in any order.</li>
                    <li>Follow specific movement and combat rules for each character.</li>
                </ul>
            </div>
        </div>
    );
};

export default LoginPage;

