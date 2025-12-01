const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const dbPath = path.join(__dirname, "../data/inventario.json");

function loadDB() {
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}
function saveDB(data) { fs.writeFileSync(dbPath, JSON.stringify(data, null, 2)); }

module.exports = {
  data: new SlashCommandBuilder()
    .setName("se_mete")
    .setDescription("Agrega un objeto al inventario")
    .addStringOption(o => o.setName("categoria").setDescription("Ej: armas, balas, comida").setRequired(true))
    .addStringOption(o => o.setName("objeto").setDescription("Nombre del objeto").setRequired(true))
    .addIntegerOption(o => o.setName("cantidad").setDescription("Cantidad a agregar").setRequired(true)),
  async execute(interaction) {
    const categoria = interaction.options.getString("categoria").toLowerCase();
    const objeto = interaction.options.getString("objeto").toLowerCase();
    const cantidad = interaction.options.getInteger("cantidad");
    const db = loadDB();
    if (!db[categoria]) db[categoria] = {};
    db[categoria][objeto] = (db[categoria][objeto] || 0) + cantidad;
    saveDB(db);
    return interaction.reply(`✅ Se agregaron **${cantidad} ${objeto}** a **${categoria}**.`);
  }
};
