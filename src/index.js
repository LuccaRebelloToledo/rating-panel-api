const express = require('express');
require('express-async-errors');

const expressLayouts = require('express-ejs-layouts');

const { BAD_REQUEST, PERMANENT_REDIRECT } =
  require('http-status-codes').StatusCodes;

const {
  createScoresFile,
  addScore,
  getScoresAscending,
  getTeamsName,
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
    app.use(express.urlencoded({ extended: true }));

    app.set('view engine', 'ejs');
    app.set('views', './src/views');
    app.use(expressLayouts);
    app.set('layout', 'layout');

    app.get('/', async (_request, response) => {
      const scores = await getScoresAscending();

      return response.render('ranking', {
        title: 'Ranking das Equipes',
        scores,
      });
    });

    app.get('/forms', async (_request, response) => {
      const teams = await getTeamsName();

      return response.render('forms', {
        title: 'Cadastro de Pontuação',
        teams,
      });
    });

    app.post('/add-score', async (request, response) => {
      const { team, score } = request.body;

      await addScore(team, score);

      return response.status(PERMANENT_REDIRECT).redirect('/');
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
