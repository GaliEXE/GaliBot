const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-ticket-hub')
        .setDescription('Create The Ticket Hub')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel To Send The Hub Too')
                .setRequired(true)),
    async execute(interaction){

        await interaction.deferReply();
        const member = interaction.member;

        const allowedRoles = ['1404357804764172349', '1403996887052193832', '1404346778098077756'];

        if(!interaction.member.roles.cache.some(role => allowedRoles.includes(role.id))){
            console.log("Unauthorized Command usage!")
            return interaction.editReply('You Don\'t Have Permission To Run That Command');
        }

        const embedMsg = `Welcome To The Ticket Hub!
        If you have a report to make against another player or discord user you can create a report ticket.
        If you have are experiencing problems with the discord or with the server you can create a general help ticket.
        If you want to fill out a staff application you can create a staff application ticket.
        To create a ticket select the button below that corresponds to the ticket you wish to open.`;

        const embed = new EmbedBuilder()
            .setColor('ADD8E6')
            .setTitle('Ticket Creation Hub')
            .setDescription(embedMsg)
            .setFooter({
                text: "Created By Gali7"
            });

        const reportBtn = new ButtonBuilder()
            .setCustomId('reportBtn')
            .setLabel('Report')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('812532783184216064');

        const generalBtn = new ButtonBuilder()
            .setCustomId('generalBtn')
            .setLabel('Help')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🎟️');

        const staffBtn = new ButtonBuilder()
            .setCustomId('staffBtn')
            .setLabel('Staff Application')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('✉️');

        const row = new ActionRowBuilder().addComponents(reportBtn, generalBtn, staffBtn);

        const channelId = interaction.options.getChannel('channel').id;
        const channel = interaction.client.channels.cache.get(channelId);

        await channel.send({ embeds: [embed], components: [row] });
        await interaction.editReply({ content: 'Embed Successfully Inserted', ephemeral: true});

    }
}