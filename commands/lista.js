const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { isAdmin } = require("../utils/checkAdmin");
const dbPath = path.join(__dirname, "../data/inventario.json");

function loadDB() {
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lista_inventario")
    .setDescription("Muestra el inventario completo (solo admins)"),
  async execute(interaction) {
    if (!isAdmin(interaction)) return interaction.reply({ content: "❌ No tienes permiso para ver el inventario.", ephemeral: true });
    const db = loadDB();
    if (Object.keys(db).length === 0) return interaction.reply("📦 El inventario está vacío.");
    let msg = "📦 **Inventario completo**\n\n";
    for (const cat in db) {
      msg += `**${cat.toUpperCase()}**\n`;
      for (const item in db[cat]) msg += `• ${item}: ${db[cat][item]}\n`;
      msg += "\n";
    }
    return interaction.reply(msg);
  }
};

