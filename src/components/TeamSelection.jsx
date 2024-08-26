import { useState } from 'react';

function TeamSelection({ onTeamSelect, player }) {
    const [selectedCharacters, setSelectedCharacters] = useState([]);

    const availableCharacters = ['P1', 'P2', 'P3', 'H1', 'H2', 'H3'];

    const handleCharacterSelect = (character) => {
        if (selectedCharacters.length < 5) {
            setSelectedCharacters([...selectedCharacters, character]);
        }
    };

    const handleSubmit = () => {
        if (selectedCharacters.length === 5) {
            onTeamSelect(selectedCharacters);
        }
    };

    return (
        <div className="team-selection">
            <h3>Player {player} - Select Your Team</h3>
            <div className="characters">
                {availableCharacters.map((character) => (
                    <button
                        key={character}
                        onClick={() => handleCharacterSelect(character)}
                        disabled={selectedCharacters.includes(character)}
                    >
                        {character}
                    </button>
                ))}
            </div>
            <div>Selected: {selectedCharacters.join(', ')}</div>
            <button onClick={handleSubmit} disabled={selectedCharacters.length < 5}>
                Confirm Team
            </button>
        </div>
    );
}

export default TeamSelection;