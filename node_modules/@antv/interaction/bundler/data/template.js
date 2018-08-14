module.exports = blocks => `
const interaction = require('./core');
${blocks}
module.exports = interaction;
`;
