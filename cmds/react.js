module.exports.run = async (bot, msg , args) =>
{
    if(args.length > 1)
    {
            msg.channel.messages.fetch(args[0])
            .then( message => 
            {
                for (let i = 1; i < args.length; i++) 
                {
                    message.react(args[i]);
                }
            });
    }
}