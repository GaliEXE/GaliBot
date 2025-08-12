const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reaction-roles-create')
        .setDescription('Create A Reaction Role Embed')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel To Send The Embed To')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('rolemsg')
                .setDescription('Describe The Purpose Of The Role Embed')
                .setRequired(true))
        .addStringOption(option =>
                option.setName('title')
            .setDescription('Title For The Embed')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('emoji')
            .setDescription('Emoji To Use For The Embed')
            .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
            .setDescription('Role To Give')
            .setRequired(true)),
    async execute(interaction, client){
        
        await interaction.deferReply();
        const member = interaction.member;

        const allowedRoles = ['1404357804764172349', '1403996887052193832', '1404346778098077756'];

        if(!interaction.member.roles.cache.some(role => allowedRoles.includes(role.id))){
            console.log("Unauthorized Command Usage");
            return interaction.reply('You Don\'t Have Permission To Run That Command');
        }

        const roleToAdd = interaction.options.getRole('role');
        const roleId = roleToAdd.id;

        const roleMsg = interaction.options.getString('rolemsg');
        const embedTitle = interaction.options.getString('title');
        const embed = new EmbedBuilder()
            .setColor('E10707')
            .setTitle(embedTitle)
            .setDescription(roleMsg)
            .setFooter({
                text: "Created By Gali7"
            });

const emojiInput = interaction.options.getString('emoji');

let emojiData;
const customEmojiMatch = emojiInput.match(/^<a?:([a-zA-Z0-9_]+):(\d+)>$/);

if (customEmojiMatch) {
    // customEmojiMatch[1] = name, customEmojiMatch[2] = id
    emojiData = { name: customEmojiMatch[1], id: customEmojiMatch[2] };
    console.log('Detected custom emoji:', emojiData);
} else {
    // Unicode emoji
    emojiData = { name: emojiInput };
}
            

        const roleBtn = new ButtonBuilder()
          .setCustomId(`roleButton_${roleId}`)
          .setLabel('Get Role')
          .setEmoji(emojiData)
          .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(roleBtn);
            
        

        const channelID = interaction.options.getChannel('channel').id;
        const channel = interaction.client.channels.cache.get(channelID);

        await channel.send({ embeds: [embed], components: [row] });


    }
}