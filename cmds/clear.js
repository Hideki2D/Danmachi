module.exports.run = async (bot, msg, args) => {
    if(!msg.member.hasPermission(`MANAGE_MESSAGES`)) return msg.reply('У вас нет прав');
    let del = Number(args[0]);
    if(!del || isNaN(args[0]) || parseInt(args[0]) <= 0 || parseInt(args[0]) > 100)
    {
        return msg.reply(`Пожалуйста введите целое число от 1-99`)
    }
    else
    {
        msg.delete();
        msg.channel.bulkDelete(del, true)
        .then(deleted => {msg.reply(`Удалено ${deleted.size}`)
        .then(msg => {msg.delete({timeout : 5000})})})
    }
}