const express = require('express');
require('express-async-errors');

const http = require('node:http');

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

    app.get('/', async (_request, response) => {
      const scores = await getScoresAscending();

      const html = `
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Ranking</title>
      </head>
      <body>
        <h1>Ranking</h1>
        <table border="1">
          <tr>
            <th>Team</th>
            <th>Score</th>
          </tr>
          ${scores
            .map(
              (score) => `
            <tr>
              <td>${score.team}</td>
              <td>${score.score}</td>
            </tr>
          `,
            )
            .join('')}
        </table>
        <a href="/forms">Add new score</a>
      </body>
      </html>
    `;

      return response.send(html);
    });

    app.get('/forms', async (_request, response) => {
      const teams = await getTeamsName();

      const html = `
      <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Pontuação</title>
        </head>
        <body>
            <h1>Cadastro de Pontuação</h1>
            <form action="/add-score" method="post">
                <label for="team">Selecione o time:</label>
                <select id="team" name="team">
                    ${teams.map((team) => {
                      return `<option value="${team}">${team}</option>`;
                    })}
                </select>
                <br><br>
                <label for="score">Pontuação:</label>
                <input type="number" id="score" name="score" min="1" max="3" required>
                <br><br>
                <button type="submit">Enviar</button>
            </form>
        </body>
      </html>
`;

      return response.send(html);
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
