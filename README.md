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
        <h1>♟️ Chess-Like Game</h1>

        <h2>Overview</h2>
        <p>This game is a strategic chess-like game played on a 5x5 grid between two players. Each player controls a team of 5 characters, including Pawns, Hero1, Hero2, and optionally Hero3. Players arrange their characters on their respective starting rows and take turns to move their characters across the grid. The objective is to eliminate all of the opponent's characters. 🎯</p>
        <button class="button">Start Game Again</button>
        <button class="button">Add New Hero-Hero3</button>

        <h2>Characters</h2>

        <h3>1. Pawn 🏰</h3>
        <ul>
            <li><strong>Movement:</strong> Moves one block in any direction (Left, Right, Forward, or Backward).</li>
            <li><strong>Move Commands:</strong>
                <ul>
                    <li>L (Left)</li>
                    <li>R (Right)</li>
                    <li>F (Forward)</li>
                    <li>B (Backward)</li>
                </ul>
            </li>
        </ul>

        <h3>2. Hero1 ⚔️</h3>
        <ul>
            <li><strong>Movement:</strong> Moves two blocks straight in any direction.</li>
            <li><strong>Combat:</strong> Kills any opponent's character in its path.</li>
            <li><strong>Move Commands:</strong>
                <ul>
                    <li>L (Left)</li>
                    <li>R (Right)</li>
                    <li>F (Forward)</li>
                    <li>B (Backward)</li>
                </ul>
            </li>
        </ul>

        <h3>3. Hero2 🛡️</h3>
        <ul>
            <li><strong>Movement:</strong> Moves two blocks diagonally in any direction.</li>
            <li><strong>Combat:</strong> Kills any opponent's character in its path.</li>
            <li><strong>Move Commands:</strong>
                <ul>
                    <li>FL (Forward-Left)</li>
                    <li>FR (Forward-Right)</li>
                    <li>BL (Backward-Left)</li>
                    <li>BR (Backward-Right)</li>
                </ul>
            </li>
        </ul>

        <h3>4. Hero3 🚀</h3>
        <ul>
            <li><strong>Movement:</strong> Moves in an L-shape.</li>
            <li><strong>Combat:</strong> Kills only the character at its final landing position (if occupied by an opponent).</li>
            <li><strong>Move Commands:</strong>
                <ul>
                    <li>FL (2 steps Forward, 1 step Left)</li>
                    <li>FR (2 steps Forward, 1 step Right)</li>
                    <li>BL (2 steps Backward, 1 step Left)</li>
                    <li>BR (2 steps Backward, 1 step Right)</li>
                    <li>RF (2 steps Right, 1 step Forward)</li>
                    <li>RB (2 steps Right, 1 step Backward)</li>
                    <li>LF (2 steps Left, 1 step Forward)</li>
                    <li>LB (2 steps Left, 1 step Backward)</li>
                </ul>
            </li>
        </ul>

        <h3>Combat</h3>
        <ul>
            <li>For Hero1 and Hero2, any opponent's character in their path is removed, not just at the final destination.</li>
            <li>Hero3 only removes opponents at its final landing position.</li>
        </ul>

        <h3>Invalid Moves</h3>
        <ul>
            <li>Moves are considered invalid if:
                <ul>
                    <li>The specified character doesn't exist.</li>
                    <li>The move would take the character out of bounds.</li>
                    <li>The move is not valid for the given character type.</li>
                    <li>The move targets a friendly character.</li>
                </ul>
            </li>
            <li>Players must retry their turn if they input an invalid move.</li>
        </ul>

        <h3>Movement History</h3>
        <p>After each turn, the 5x5 grid is displayed with all character positions. Character names are prefixed with the player's identifier and character type (e.g., A-P1, B-H1, A-H2).</p>

        <h3>Winning the Game 🏆</h3>
        <ul>
            <li>The game ends when one player eliminates all of their opponent's characters.</li>
            <li>The winning player is announced, and players can choose to start a new game.</li>
        </ul>
    </div>
</body>
</html>

