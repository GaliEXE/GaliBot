const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-punishment-record')
        .setDescription("Create A Record Of Punishment")
        .addStringOption(option =>
            option.setName('punishment')
                .setDescription('Punishment User Recieved')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason For The Punishment')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('date-and-time')
                .setDescription('Time and date of end of punishment (Format: MM/DD/YYYY HH:MM (24 hr)), If Permanent Type perma')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('user-ign')
                .setDescription('Minecraft Username Of Person'))
        .addUserOption(option =>
            option.setName('user-discord-ign')
                .setDescription('The Discord Username Of Person')),
    async execute(interaction, client) {

        await interaction.deferReply;

        const allowedRoles = ['1404357804764172349', '1403996887052193832', '1404346778098077756']
        if (!interaction.member.roles.cache.some(role => allowedRoles.includes(role.id))) {
            console.log('Unauthorized Command Usage!')
            return interaction.editReply('You Don\'t Have Permission To Run That Command');
        }

        let punishedUserDisc;
        let punishedUserMC;
        let punishedUserTtl;
        let punishedDiscordId;

        punishedUserMC = interaction.options.getString('user-ign');
        punishedUserDisc = interaction.options.getUser('user-discord-ign');

        if (punishedUserDisc) {
            punishedUserTtl = punishedUserDisc.username;
            punishedDiscordId = `Discord ID: ${punishedUserDisc.id} ~ ${punishedUserDisc}`;
        } else if (punishedUserDisc && punishedUserMC) {
            punishedDiscordId = '';
            punishedUserTtl = punishedUserMC;
        } else {
            punishedDiscordId = '';
            punishedUserTtl = punishedUserMC;
        }

        const userPunishment = interaction.options.getString('punishment');
        const punishmentTime = interaction.options.getString('date-and-time');
        const regex = /^\d{2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2}$/;
        const punishmentReason = interaction.options.getString('reason');

        if (regex.test(punishmentTime) || punishmentTime === "perma") {
            console.log("Date Recorded");
        } else {
            return interaction.reply({ content: 'Invalid date and time format. Please use the format MM/DD/YYYY HH:MM (24hr).', ephemeral: true });
        }

        let timeEmbedMsg;
        let discTimeRemain;

        if (punishmentTime === "perma") {
            timeEmbedMsg = 'INDEFINITE';
            discTimeRemain = '';
        } else {
            const d = new Date();
            const dateSplit = punishmentTime.split(' ');
            const unixSplit = punishmentTime.split((/[/ ]/));
            const unixDate = `${unixSplit[2]}-${unixSplit[0]}-${unixSplit[1]}T${unixSplit[3]}`;
            const unixConvert = new Date(unixDate);
            const unixTimestamp = Math.floor(unixConvert.getTime() / 1000);
            const formatDate =`(${d.getMonth() + 1}/${d.getDate()}/${String(d.getFullYear())} - ${dateSplit[0]})`;
            timeEmbedMsg = formatDate;
            discTimeRemain = `Sentence Complete <t:${unixTimestamp}:R>`;
        }

        const embedTtl = `**Season 0 Punishment ${punishedUserTtl}**`;
        const embedMsg = `${punishedDiscordId}
        Punishment: ${userPunishment}
        Reason: ${punishmentReason}
        Duration: ${timeEmbedMsg}
        ${discTimeRemain}`;

        const embed = new EmbedBuilder()
            .setColor('DarkRed')
            .setTitle(embedTtl)
            .setDescription(embedMsg)
            .setFooter({
                text: "Created By Gali7",
            });

        const channelId = '1404002529213153412';
        const channel = await client.channels.fetch(channelId);

        await channel.send({ embeds: [embed] });
        await interaction.reply({ content: 'Record Successfully Created', ephemeral: true});
    }

}