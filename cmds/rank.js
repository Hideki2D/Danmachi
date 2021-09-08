/*const canvacord = require("canvacord");
const Discord = require('discord.js')
module.exports.run  = async(bot, msg, args, cfg) =>{
    let user = msg.mentions.members.first() || msg.member;
    let guild = bot.ranks[msg.guild.id];
    let memberRank  = guild[user.id]; //  или bot.ranks[msg.member.id]
    let required = cfg.lvls[memberRank.lvl];
    if(memberRank.lvl >= Object.keys(cfg.lvls).length)
    {
        required = cfg.xpn;
    }
    let avatar = user.user.avatarURL().slice(0, user.user.avatarURL().lastIndexOf('.')+1) + "png";

    const rank = new canvacord.Rank()
    .setAvatar(avatar)
    .setCurrentXP(memberRank.xp)
    .setRequiredXP(required)
    .setStatus(user.presence.status)
    .setProgressBar("#FFFFFF", "COLOR")
    .setUsername(user.displayName)
    .setDiscriminator(user.user.discriminator);

rank.build()
    .then(buffer => {
        const attachment = new Discord.MessageAttachment(buffer, "RankCard.png");
        msg.channel.send(attachment);
    });
}
*/