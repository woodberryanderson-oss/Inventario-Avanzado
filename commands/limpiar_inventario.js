const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { isAdmin } = require("../utils/checkAdmin");
const dbPath = path.join(__dirname, "../data/inventario.json");

function saveDB(data) { fs.writeFileSync(dbPath, JSON.stringify(data, null, 2)); }

module.exports = {
  data: new SlashCommandBuilder()
    .setName("limpiar_inventario")
    .setDescription("Limpia todo el inventario (solo admins)"),
  async execute(interaction) {
    if (!isAdmin(interaction)) return interaction.reply({ content: "❌ No tienes permiso para limpiar el inventario.", ephemeral: true });
    saveDB({});
    return interaction.reply("🗑 Inventario borrado completamente.");
  }
};

