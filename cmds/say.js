module.exports.run = async (bot, msg, args) =>{
    let str = msg.content.slice(msg.content.indexOf(' '), msg.content.length);
    msg.channel.send(str);
}