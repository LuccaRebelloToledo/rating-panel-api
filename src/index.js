const express = require('express');
require('express-async-errors');

const { BAD_REQUEST } = require('http-status-codes').StatusCodes;

const { addScore, getScoresDescending, getTeamsName } = require('./functions');

const { addScoreSchema } = require('./validations');

const PORT = 4000;

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));

app.use((request, _response, next) => {
  console.log(
    'Request received:',
    request.method,
    request.url,
    new Date().toISOString(),
  );

  next();
});

app.get('/status', (_request, response) => {
  return response.json({ message: 'OK!' });
});

app.get('/', async (_request, response) => {
  const scores = await getScoresDescending();

  return response.render('index', { scores });
});

app.get('/add-score', async (_request, response) => {
  const teams = await getTeamsName();

  return response.render('add-score', { teams });
});

app.post('/add-score', async (request, response) => {
  const { team, score } = request.body;

  const parsedScore = Number(score);

  await addScoreSchema.parseAsync({ team, score: parsedScore });

  await addScore(team, score);

  return response.send(
    '<script>alert("Score adicionado com sucesso!"); window.location.href = "/add-score";</script>',
  );
});

app.use(function (error, _request, response, next) {
  console.log(error);

  if (error) {
    return response
      .status(BAD_REQUEST)
      .send(
        `<script>alert("Error: ${error.message}"); window.location.href = "/";</script>`,
      );
  }

  next();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
