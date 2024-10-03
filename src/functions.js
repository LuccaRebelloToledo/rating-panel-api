const { Score } = require('../models');

const getTeamsName = async () => {
  const scores = await Score.findAll({
    attributes: ['team'],
  });

  return scores.map((score) => score.team);
};

const addScore = async (team, score) => {
  const teamRecord = await Score.findOne({ where: { team } });

  if (!teamRecord) {
    throw new Error('Team not found.');
  }

  teamRecord.score += parseInt(score);

  await teamRecord.save();
};

const getScoresDescending = async () => {
  const scores = await Score.findAll({
    order: [['score', 'DESC']],
  });

  return scores;
};

module.exports = {
  addScore,
  getScoresDescending,
  getTeamsName,
};
