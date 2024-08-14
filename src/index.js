const express = require('express');
require('express-async-errors');

const http = require('node:http');

const { CREATED, BAD_REQUEST } = require('http-status-codes').StatusCodes;

const {
  createScoresFile,
  addScore,
  getScoresAscending,
} = require('./functions');

const main = async () => {
  await createScoresFile();
  console.log('Scores file loaded!');
};

const PORT = 4000;

main()
  .then(() => {
    const app = express();

    app.use(express.json());

    app.get('/', async (_request, response) => {
      const scores = await getScoresAscending();

      return response.json(scores);
    });

    app.post('/add-score', async (request, response) => {
      const { team, score } = request.body;

      await addScore(team, score);

      return response.status(CREATED).json();
    });

    app.get('/status', (_request, response) => {
      return response.json({ message: 'OK!' });
    });

    app.use(function (error, _request, response, next) {
      if (error) {
        return response.status(BAD_REQUEST).json({
          statusCode: BAD_REQUEST,
          error: http.STATUS_CODES[BAD_REQUEST],
          message: error.message,
        });
      } else {
        next();
      }
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => console.error(error));
