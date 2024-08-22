const fs = require('fs').promises;

const SCORES_FILE = './src/scores.json';

const writeScoresFile = async (data) => {
  await fs.writeFile(SCORES_FILE, JSON.stringify(data, null, '\t'));
};

const createScoresFile = async () => {
  fs.open(SCORES_FILE, 'r')
    .then(async (fd) => {
      await fd.close();
    })
    .catch(async (error) => {
      if (error.code === 'ENOENT') {
        await writeScoresFile([]);

        console.log('Scores file created!');
      }
    });
};

const readScoresFile = async () => {
  const data = await fs.readFile(SCORES_FILE, {
    encoding: 'utf8',
  });

  return JSON.parse(data);
};

const getTeamsName = async () => {
  const datas = await readScoresFile();

  return datas.map((data) => data.team);
};

const addScore = async (team, score) => {
  if (!team || typeof team !== 'string') {
    throw new Error('Team are required or must be a string!');
  }

  if (isNaN(score)) {
    throw new Error('Score are required or must be a number!');
  }

  if (score > 3 || score < 1) {
    throw new Error('Score must be between 1 and 3!');
  }

  const scores = await readScoresFile();

  const teamIndex = scores.findIndex((item) => item.team === team);

  if (teamIndex === -1) {
    throw Error('Team not found.');
  }

  scores[teamIndex].score += parseInt(score);

  await writeScoresFile(scores);
};

const getScoresAscending = async () => {
  const scores = await readScoresFile();

  return scores.sort((a, b) => a.score - b.score);
};

module.exports = {
  createScoresFile,
  addScore,
  getScoresAscending,
  getTeamsName,
};
