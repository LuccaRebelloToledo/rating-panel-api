const { z } = require('zod');

const {
    getTeamsName,
} = require('./functions');

const isValidTeam = async (teamName) => {
    const validTeams = await getTeamsName();

    return validTeams.includes(teamName);
};

const addScoreSchema = z.object({
    team: z.string({ message: 'O nome do time é obrigatório!' }).refine(async (teamName) => {
        return await isValidTeam(teamName);
    }, {
        message: "Nome do time inválido!",
    }),
    score: z.number().int({ message: 'O score é obrigatório!' }).min(1).refine((val) => val === 1 || val === 3, {
        message: "O valor deve ser 1 ou 3",
    })
})

module.exports = {
    addScoreSchema,
}