// deploy-commands.js
const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");
const { token, clientId, guildId } = require("./config.json");

const commands = [];
const commandsPath = path.join(__dirname, "commands");
for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"))) {
  const cmd = require(path.join(commandsPath, file));
  commands.push(cmd.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log("Registrando comandos en el guild...");
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    console.log("Comandos registrados ✅");
  } catch (err) {
    console.error(err);
  }
})();
