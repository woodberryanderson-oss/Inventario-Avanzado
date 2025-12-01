// deploy-commands.js
require('dotenv').config(); // Carga las variables del .env
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Revisa que el token exista
if (!process.env.DISCORD_TOKEN) {
    console.error('❌ ERROR: No se encontró DISCORD_TOKEN en el archivo .env');
    process.exit(1);
}

// Obtenemos los comandos desde la carpeta "commands" (si los tienes)
const commands = [];
const commandsPath = path.join(__dirname, 'commands'); 
if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        if (command.data) commands.push(command.data.toJSON());
    }
}

// Creamos el REST client
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// Registramos los comandos
(async () => {
    try {
        console.log(`📤 Registrando ${commands.length} comandos slash...`);

        // Si quieres solo en un servidor (desarrollo)
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        // Si quieres global (publicado para todos los servidores)
        // await rest.put(
        //     Routes.applicationCommands(process.env.CLIENT_ID),
        //     { body: commands },
        // );

        console.log('✅ Comandos registrados correctamente.');
    } catch (error) {
        console.error('❌ Error registrando comandos:', error);
    }
})();


