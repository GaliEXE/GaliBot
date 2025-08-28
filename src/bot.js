require('dotenv').config();
const { token, APIKEY } = process.env
const { Client, Collection, GatewayIntentBits, Events, EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionsBitField, ChannelType } = require('discord.js');
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

client.on(Events.InteractionCreate, async (interaction) => {
    if(interaction.customId !== 'reportBtn') return;

    try{
        await interaction.deferUpdate();

        const member = interaction.member;
        const username = member.user.username;
        const categoryId = '1409950629232906240';

        const createdChannel = await interaction.guild.channels.create({
            type: ChannelType.GuildText,
            parent: categoryId,
            name: `${username}'s Report Ticket`,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
            ],
        });

        createdChannel.lockPermissions()
            .then(() => console.log('Successfully synched permissions with percent channel'))
            .catch(console.error);
        createdChannel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: true });
        const closeButton = new ButtonBuilder()
            .setCustomId('closeticket')
            .setLabel('Close Ticket')
            .setStyle('Danger');

        const row = new ActionRowBuilder().addComponents(closeButton)

        const embed = new EmbedBuilder()
            .setTitle('Report Ticket Info')
            .setDescription(`**Welcome To Your Ticket** <@${member.user.id}>!
                A Team Member Will Respond To You Shortly.
                Please Let Us Know What Happened And We Will Do Our Best To Fix It.`)
            .setColor('ADD8E6')
            .setFooter({
                text: 'Created By Gali7'
            })

            await createdChannel.send({ embeds: [embed], components: [row]});

            await interaction.followUp({ content: `Ticket channel created: ${createdChannel.name}`, ephemeral: true});
    } catch(error) {
        console.error('Error creating ticket channel:', error);
        await interaction.followUp({ content: 'Failed to create ticket channel.', ephemeral: true });
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if(interaction.customId !== 'generalBtn') return;

    try{
        await interaction.deferUpdate();

        const member = interaction.member;
        const username = member.user.username;
        const categoryID = '1409950629232906240';

        const createdChannel = await interaction.guild.channels.create({
            type: ChannelType.GuildText,
            parent: categoryID,
            name: `${username}'s General Query Ticket`,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
            ],
        });

        createdChannel.lockPermissions()
            .then(() => console.log('Successfully Synchronized Permissions With Parent Channel'))
            .catch(console.error);
        createdChannel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: true});
        const closeButton = new ButtonBuilder()
            .setCustomId('closeticket')
            .setLabel('Close Ticket')
            .setStyle('Danger');

        const row = new ActionRowBuilder().addComponents(closeButton);

        const embed = new EmbedBuilder()
            .setTitle('Ticket Information')
            .setDescription(`**Welcome To Your General Inquery Ticket** <@${member.user.id}>!
                A Team Member Will Respond Shortly To Resolve Your Issue.
                Please put as much information about your problem here.`)
            .setColor('ADD8E6')
            .setFooter({ text: 'Created By Gali7'});

        await createdChannel.send({ embeds: [embed], components: [row] });

        await interaction.followUp({ content: `Ticket channel created: ${createdChannel.name}`, ephemeral: true});
    } catch (error){
        console.error('Error creating ticket channel: ', error);
        await interaction.followUp({ content: 'Failed to create ticket channel.', ephemeral: true});
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if(interaction.customId !== 'staffBtn') return;

    try {
        await interaction.deferUpdate();

        const member = interaction.member;
        const username = member.user.username;
        const categoryID = '1409950629232906240';

        const createdChannel = await interaction.guild.channels.create({
            type: ChannelType.GuildText,
            parent: categoryID,
            name: `${username}'s Staff App Ticket`,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
            ],
        });

        createdChannel.lockPermissions()
            .then(() => console.log('Successfully Synchronized Permissions With Parent Channel'))
            .catch(console.error);
        createdChannel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: true});
        const closeButton = new ButtonBuilder()
            .setCustomId('closeticket')
            .setLabel('Close Application')
            .setStyle('Danger');

        const row = new ActionRowBuilder().addComponents(closeButton);

        const embed = new EmbedBuilder()
            .setTitle('Application Information')
            .setDescription(`**Welcome To Your Staff Application** <@${member.user.id}>!
                Please fill out this application form and we will get back to you with further
                questions shortly.
                Application Form: https://forms.gle/zQpbEvtqfpBZDEvdA
                **__Please Don't Ping Staff To Ask About Your Application Status!__**`)
                .setColor('ADD8E6')
                .setFooter({ text: 'Created By Gali7'});

        await createdChannel.send({ embeds: [embed], components: [row] });

        await interaction.followUp({ content: `Ticket channel created: ${createdChannel.name}`, ephemeral: true});
    } catch (error) {
        console.error('Error creating ticket channel:', error);
        await interaction.followUp({ content: `Failed to create ticket channel.`, ephemeral: true});
    }
});

client.on(Events.InteractionCreate, async (interaction) => {
    if(interaction.customId !== `closeticket`) return;

    const member = interaction.member;
    
    const channelId = interaction.channelId;

    const ticketChannel = interaction.guild.channels.cache.get(channelId);

    if(ticketChannel){
         await interaction.reply({ content: 'Ticket closed successfully!', ephemeral: true});
        await ticketChannel.delete();
    } else {
        await interaction.reply({ content: 'Ticket Channel Not Found!', ephemeral: true});
    }
});
