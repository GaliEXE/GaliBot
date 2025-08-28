const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed-rules')
        .setDescription('Send The Rules Embed To A Specified Channel (ADMIN ONLY)')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel To Send The Embed To')
                .setRequired(true)),
    async execute(interaction) {

        await interaction.deferReply();

        const member = interaction.member;
        const allowedRoles = ['1404357804764172349', '1403996887052193832', '1404346778098077756']
        if (!interaction.member.roles.cache.some(role => allowedRoles.includes(role.id))) {
            console.log('Unauthorized Command Usage!')
            return interaction.editReply('You Don\'t Have Permission To Run That Command');
        }

        const rulesEmbedMsg = `**Discord Rules**
        1.) Keep Spamming To A Minimum
        2.) No NSFW Content
        3.) No Slurs/ Curse Words
        4.) Do Not Harass Anyone
        5.) Use Channels For There Intended Purpose
        6.) Be Respectful To All Users
        7.) Follow The Discord TOS
        \n
        **Minecraft Server Rules**
        1.) No Griefing
        2.) No Stealing Anything From Anyone
        3.) No Claiming Other Members Bases
        4.) No Hacking Or Exploits
        5.) No PVP Except When Agreed Upon Or In A PVP Allowed Zone
        6.) When PVPing No Crystal PVP
        7.) PVP Is Allowed When Someone Is Breaking Rules 1-6
        8.) Discord Chat Rules Apply To In Game Chat Aswell\n
        You May Suggest New Rules In The <#1408130293042253856> Channel.`;

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Server Rules')
            .setDescription(rulesEmbedMsg)
            .setFooter({
                text: "Created By Gali7"
            });

        const channelId = interaction.options.getChannel('channel').id;
        const channel = interaction.client.channels.cache.get(channelId);

        if(channel) {
            channel.send({ embeds: [embed] });
            await interaction.editReply({ content: 'Embed Successfully Inserted', ephemeral: true});
            console.log("Embed Inserted Successfully");
        } else {
            console.log("Specified Channel Not Found!")
            await interaction.editReply({ content: 'Channel Not Found. Please Use An Accessible Channel!', ephemeral: true});
        }
    }
};