const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

// Ruta a la base de datos
const dbPath = path.join(__dirname, "../data/inventario.json");

// Cargar la base de datos
function loadDB() {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));
    }
    return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

// Guardar la base de datos
function saveDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("se_mete")
        .setDescription("Agregar objetos al inventario")
        .addStringOption(o =>
            o.setName("categoria")
                .setDescription("Ej: armas, balas, comida, etc.")
                .setRequired(true))
        .addStringOption(o =>
            o.setName("objeto")
                .setDescription("Nombre del objeto")
                .setRequired(true))
        .addIntegerOption(o =>
            o.setName("cantidad")
                .setDescription("Cantidad a agregar")
                .setRequired(true))
    
        // Segundo comando
        .toJSON(),

    async execute(interaction) {
        const comando = interaction.commandName;
        const categoria = interaction.options.getString("categoria");
        const objeto = interaction.options.getString("objeto");
        const cantidad = interaction.options.getInteger("cantidad");

        let db = loadDB();

        // =====================
        // COMANDO: /se_mete
        // =====================
        if (comando === "se_mete") {
            if (!db[categoria]) db[categoria] = {};
            if (!db[categoria][objeto]) db[categoria][objeto] = 0;

            db[categoria][objeto] += cantidad;

            saveDB(db);
            return interaction.reply(
                `✔ Se agregaron **${cantidad} ${objeto}** a la categoría **${categoria}**.`
            );
        }
    }
};

