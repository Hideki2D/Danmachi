module.exports.run = async(bot, msg, args) => {
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
    db = bot.getMRGRS();
    msgID = db[args[0]] = {};
    let reacts = [], roles = [];
    for(let i = 1; i < args.length;)
    {
        reacts.push(args[i++]);
        roles.push(getRoleFromMention(args[i++]));
    }
    msg.channel.messages.fetch(args[0])
    .then(message => {
        for(let i=0; i<reacts.length; i++)
        {
            message.react(reacts[i]);
            msgID.channel = message.channel.id;
            msgID.guild = message.guild.id;
        }
    })
    .catch(err => console.log(err));
    
    for(let i = 0; i<(args.length-1)/2; i++)
    {
        msgID[reacts[i]] = roles[i];
    }
}

// {
//    MsgID - "1231231123123123123" : {
//        "🖼" : role - "123123123123",
//        "🖼" : role - "123123123123"
//    }
// }