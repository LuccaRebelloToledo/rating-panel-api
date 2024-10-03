const http = require('node:http')
const express = require('express');
require('express-async-errors');

const { BAD_REQUEST, PERMANENT_REDIRECT } = require('http-status-codes').StatusCodes;

const {
  createScoresFile,
  addScore,
  getScoresDescending,
  getTeamsName,
} = require('./functions');

const { addScoreSchema } = require('./validations');

const main = async () => {
  await createScoresFile();
  console.log('Scores file loaded!');
};

const PORT = 4000;

main()
  .then(() => {
    const app = express();

    app.use(express.static('public'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use((request, _response, next) => {
      console.log('Request received:', request.method, request.url, new Date().toISOString());

      next();
    });

    app.get('/', (_request, response) => {});

    app.get('/status', (_request, response) => {
      return response.json({ message: 'OK!' });
    });

    app.get('/scores', async (_request, response) => {
      const scores = await getScoresDescending();

      return response.json(scores);
    });

    app.get('/teams', async (_request, response) => {
      const teams = await getTeamsName();

      return response.json(teams);
    });

    app.post('/add-score', async (request, response) => {
      let { team, score } = request.body;

      score = Number(score)

      await addScoreSchema.parseAsync({ team, score });

      await addScore(team, score);

      return response.status(PERMANENT_REDIRECT).redirect('/');
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
    

    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => console.error(error));
