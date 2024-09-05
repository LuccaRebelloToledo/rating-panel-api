const populateSelect = async () => {
  const teams = await fetch('/teams').then((response) => response.json());

  const select = document.getElementById('team-name');

  teams.forEach((team) => {
    const option = document.createElement('option');
    option.value = team;
    option.textContent = team;
    select.appendChild(option);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('add-score-form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const team = document.getElementById('team-name').value;
    const score = document.getElementById('score').value;

    if (!team || !score) {
      alert('Por favor, selecione uma equipe e uma pontuação.');
      return;
    }

    try {
      const response = await fetch('/add-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ team, score }),
      });

      if (response.ok) {
        alert('Pontuação adicionada com sucesso!');
        form.reset();
        window.location.href = '/';
      } else {
        alert('Erro ao adicionar pontuação. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao adicionar pontuação. Tente novamente.');
    }
  });
});

window.onload = populateSelect;
