module.exports.run = async (bot, msg, args, cfg) => {
    if(args.length > 1)
    {
        return await msg.channel.send(`A lot of arguments, please use ${cfg.prefix}prefix <new prefix> for set new command prefix`);
    }
    else if(args[0])
    {
        cfg.prefix = args[0];
        await msg.channel.send(`New command prefix for this server is: '${args[0]}'`);
    }
    else
    {
        await msg.channel.send(`Current command prefix for this server is: '${cfg.prefix}'`);
    }
}