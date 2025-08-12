require('dotenv').config();
const { token, APIKEY } = process.env
const { Client, Collection, GatewayIntentBits, Events } = require('discord.js');
const fs = require('fs');
const { roleId } = require('./commands/tools/reactionroles');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
client.commands = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
    const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of functionFiles) require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.login(token);
client.handleCommands();


client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;
    if (!interaction.customId.startsWith('roleButton_')) return;


    try {
        const roleID = interaction.customId.split('_')[1];

        await interaction.deferUpdate();
        await interaction.member.roles.add(roleID);
        console.log(`Added role ${roleID} to ${interaction.user.tag}`);
    } catch (error) {
        console.error('Error Assigning Roles', error);
        await interaction.followUp({
            content: "There was a problem adding your role, please try again later :(",
            ephemeral: true
        });
    }
});
