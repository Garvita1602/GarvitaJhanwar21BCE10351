<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    
</head>
<body>
    <div class="container">
        <h1>♟️ Welcome to the Chess-Like Game!</h1>

        <h2>Game Overview</h2>
        <p>Step into a thrilling chess-like battle on a 5x5 grid where strategy reigns supreme! Each player commands a team of five unique characters: Pawns, Hero1, Hero2, and optionally Hero3. Strategically deploy your team and outmaneuver your opponent to eliminate all their characters and claim victory. 🎯</p>
        <button class="button">Start Game Again</button>
        <button class="button">Add New Hero-Hero3</button>

        <h2>Meet the Characters</h2>

        <h3>1. Pawn 🏰</h3>
        <p>Pawns are your front-line fighters, moving one block in any direction: Left, Right, Forward, or Backward. Use them wisely to navigate the battlefield!</p>

        <h3>2. Hero1 ⚔️</h3>
        <p>Hero1 charges ahead with powerful moves, traveling two blocks straight in any direction and clearing any opponent's character in its path. Their commanding presence can turn the tide of battle!</p>

        <h3>3. Hero2 🛡️</h3>
        <p>Hero2 brings tactical versatility, moving two blocks diagonally and vanquishing any foe in their path. Use their diagonal strikes to outflank and eliminate your adversaries!</p>

        <h3>4. Hero3 🚀</h3>
        <p>Hero3 excels in dynamic L-shaped moves, striking only at their final landing spot. With options like Forward-Left and Right-Forward, Hero3's unique movement can be a game-changer!</p>

        <h3>Combat Mechanics</h3>
        <p>In combat, Hero1 and Hero2 eliminate any opponents in their path. Hero3, however, only removes enemies at its final position. Plan your moves carefully to maximize your advantage!</p>

        <h3>Invalid Moves</h3>
        <p>Be cautious! Moves are invalid if they:
            <ul>
                <li>Attempt to move a non-existent character.</li>
                <li>Take a character out of bounds.</li>
                <li>Are not valid for the character type.</li>
                <li>Target a friendly character.</li>
            </ul>
            Retry if you encounter any of these issues to keep the game flowing smoothly.</p>

        <h3>Movement History</h3>
        <p>After each turn, check out the updated 5x5 grid displaying all characters. Names are prefixed with player identifiers and character types (e.g., A-P1, B-H1, A-H2) for easy tracking.</p>

        <h3>Winning the Game 🏆</h3>
        <p>The game concludes when one player has successfully eliminated all of their opponent's characters. The victor is celebrated, and you have the option to start a new game to test your skills once more!</p>
        <div class="footer">
            <p>© 2024 Chess-Like Game. All rights reserved to Garvita Jhanwar.</p>
        </div>
    </div>
</body>
</html>

