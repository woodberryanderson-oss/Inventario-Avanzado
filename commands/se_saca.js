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
    .setName("se_saca")
    .setDescription("Quita un objeto del inventario")
    .addStringOption(o => o.setName("categoria").setDescription("Categoría").setRequired(true))
    .addStringOption(o => o.setName("objeto").setDescription("Objeto").setRequired(true))
    .addIntegerOption(o => o.setName("cantidad").setDescription("Cantidad a quitar").setRequired(true)),
  async execute(interaction) {
    const categoria = interaction.options.getString("categoria").toLowerCase();
    const objeto = interaction.options.getString("objeto").toLowerCase();
    const cantidad = interaction.options.getInteger("cantidad");
    const db = loadDB();
    if (!db[categoria] || !db[categoria][objeto]) return interaction.reply("❌ Ese objeto no existe.");
    if (db[categoria][objeto] < cantidad) return interaction.reply(`❌ No hay suficiente ${objeto}. Hay ${db[categoria][objeto]}.`);
    db[categoria][objeto] -= cantidad;
    if (db[categoria][objeto] <= 0) delete db[categoria][objeto];
    if (Object.keys(db[categoria]).length === 0) delete db[categoria];
    saveDB(db);
    return interaction.reply(`➖ Se quitaron **${cantidad} ${objeto}** de **${categoria}**.`);
  }
};
