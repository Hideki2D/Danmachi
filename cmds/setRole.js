module.exports.run = async (bot, msg, args) =>{
    if(args.length != 2){
        msg.channel.send("Вы ввели неверное количество аргументов");
    }
    let firstRole = getRoleFromMention(args[0]) || args[0];
    let secondRole = getRoleFromMention(args[1]) || args[1];
    console.log(firstRole,secondRole);
    bot.database.guilds[msg.guild.id]  = {};
    bot.database.guilds[msg.guild.id].unknownRole = firstRole;
    bot.database.guilds[msg.guild.id].verifedRole = secondRole;

}
function getRoleFromMention(mention) {
    if(!mention){
        return;
    }
    if(mention.startsWith('<@&') && mention.endsWith('>')) 
    {
        mention = mention.slice(3, -1 );
        if(mention.startsWith('!'))
        {
            mention = mention.slice(1);
        }
        return mention;
    }
}