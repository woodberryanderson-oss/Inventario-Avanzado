require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Colección para comandos
client.commands = new Collection();

// Cargar comandos de la carpeta "commands"
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        if (command.data && command.execute) {
            client.commands.set(command.data.name, command);
            console.log(`✅ Comando cargado: ${command.data.name}`);
        } else {
            console.log(`⚠️ El archivo ${file} no tiene "data" o "execute"`);
        }
    }
} else {
    console.log('⚠️ Carpeta "commands" no encontrada.');
}

// Manejar interacciones
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    console.log(`🔹 Comando recibido: ${interaction.commandName}`);

    const command = client.commands.get(interaction.commandName);
    if (!command) {
        console.log(`⚠️ Comando no encontrado: ${interaction.commandName}`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('❌ Error ejecutando comando:', error);
        if (!interaction.replied) {
            await interaction.reply({ content: '❌ Ocurrió un error al ejecutar el comando.', ephemeral: true });
        }
    }
});

// Conexión del bot
client.once('ready', () => {
    console.log(`✅ Bot listo! Conectado como ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN).catch(err => {
    console.error('❌ Error al iniciar sesión con el token:', err);
});
