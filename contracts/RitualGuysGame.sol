// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RitualGuysGame {
    struct Player {
        bool registered;
        uint256 gamesPlayed;
        uint256 highScore;
    }

    struct Score {
        address player;
        string displayName;
        uint256 score;
        uint256 highestTier;
        uint256 timestamp;
    }

    mapping(address => Player) public players;
    Score[] public scores;

    event PlayerRegistered(address indexed player);
    event GameStarted(address indexed player, uint256 gameNumber);
    event ScoreSubmitted(address indexed player, string displayName, uint256 score, uint256 highestTier);

    function registerPlayer() external {
        require(!players[msg.sender].registered, "Already registered");
        players[msg.sender].registered = true;
        emit PlayerRegistered(msg.sender);
    }

    function startGame() external {
        require(players[msg.sender].registered, "Not registered");
        players[msg.sender].gamesPlayed++;
        emit GameStarted(msg.sender, players[msg.sender].gamesPlayed);
    }

    function submitScore(
        string calldata displayName,
        uint256 score,
        uint256 highestTier
    ) external {
        require(players[msg.sender].registered, "Not registered");
        require(bytes(displayName).length > 0 && bytes(displayName).length <= 32, "Name 1-32 chars");

        if (score > players[msg.sender].highScore) {
            players[msg.sender].highScore = score;
        }

        scores.push(Score({
            player: msg.sender,
            displayName: displayName,
            score: score,
            highestTier: highestTier,
            timestamp: block.timestamp
        }));

        emit ScoreSubmitted(msg.sender, displayName, score, highestTier);
    }

    function isRegistered(address player) external view returns (bool) {
        return players[player].registered;
    }

    function getScoreCount() external view returns (uint256) {
        return scores.length;
    }

    function getScores(uint256 offset, uint256 limit) external view returns (Score[] memory) {
        uint256 total = scores.length;
        if (offset >= total) {
            return new Score[](0);
        }
        uint256 end = offset + limit;
        if (end > total) end = total;
        uint256 count = end - offset;

        Score[] memory result = new Score[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = scores[total - 1 - offset - i];
        }
        return result;
    }
}
