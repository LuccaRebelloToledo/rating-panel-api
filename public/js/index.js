const populateRankings = async () => {
  const scores = await fetch('/scores').then((response) => response.json());

  const rankingContainer = document.getElementById('ranking-container');
  const additionalRankingsContainer = document.getElementById(
    'additional-rankings',
  );

  scores.forEach((item, index) => {
    if (index < 5) {
      const rankingItem = document.createElement('div');
      rankingItem.className = 'ranking-item';

      const rankDiv = document.createElement('div');
      rankDiv.className = `rank rank-${index + 1}`;
      rankDiv.textContent = index + 1;

      const schoolNameDiv = document.createElement('div');
      schoolNameDiv.className = 'school-name';
      schoolNameDiv.textContent = item.team;

      const scoreSpan = document.createElement('span');
      scoreSpan.className = 'score';
      scoreSpan.textContent = item.score;

      schoolNameDiv.appendChild(scoreSpan);
      rankingItem.appendChild(rankDiv);
      rankingItem.appendChild(schoolNameDiv);
      rankingContainer.appendChild(rankingItem);
    } else {
      if (!additionalRankingsContainer.querySelector('.additional-rankings')) {
        const additionalRankingsDiv = document.createElement('div');
        additionalRankingsDiv.className = 'additional-rankings';
        additionalRankingsContainer.appendChild(additionalRankingsDiv);
      }
      const additionalRankingsDiv = additionalRankingsContainer.querySelector(
        '.additional-rankings',
      );
      const p = document.createElement('p');
      p.textContent = `${index + 1}..............${item.team}..............${
        item.score
      }`;
      additionalRankingsDiv.appendChild(p);
    }
  });
};

window.onload = populateRankings;
