'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Score',
      [
        {
          team: 'Team A',
          score: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          team: 'Team B',
          score: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          team: 'Team C',
          score: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          team: 'Team D',
          score: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Score', null, {});
  },
};
