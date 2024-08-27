<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chess-Like Game README</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
            perspective: 1000px;
        }
        .container {
            max-width: 900px;
            margin: auto;
            padding: 20px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            transform: rotateX(3deg);
            transition: transform 0.3s ease;
        }
        .container:hover {
            transform: rotateX(0deg);
        }
        h1, h2, h3 {
            color: #333;
        }
        h2 {
            margin-top: 20px;
        }
        h3 {
            margin-top: 15px;
        }
        ul {
            margin: 0;
            padding-left: 20px;
        }
        code {
            background: #e2e2e2;
            padding: 2px 4px;
            border-radius: 4px;
        }
        pre {
            background: #e2e2e2;
            padding: 10px;
            border-radius: 4px;
            overflow-x: auto;
        }
        .emoji {
            font-size: 1.2em;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 10px 0;
            background: #007bff;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-align: center;
            text-decoration: none;
            font-size: 1em;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: background 0.3s, box-shadow 0.3s;
        }
        .button:hover {
            background: #0056b3;
            box-shadow: 0 6px 12px rgba(0,0,0,0.3);
        }
    </style>
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
    </div>
</body>
</html>

