// utils/checkAdmin.js
const { adminRoleId, ownerId } = require("../config.json");

function isAdmin(interaction) {
    if (!interaction.member) return false;
    if (interaction.user.id === ownerId) return true;
    // roles.cache puede no estar poblado en DMs; aquí asumimos que es comando en servidor
    return interaction.member.roles.cache.has(adminRoleId);
}

module.exports = { isAdmin };
