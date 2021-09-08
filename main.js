const Discord = require('discord.js');
const fs  = require('fs');
const bot = new Discord.Client();

let cfg = {}, mrgrs = {};
bot.ranks = {};

const commands = {};

if (fs.existsSync("./cfg.json"))
    cfg = JSON.parse(fs.readFileSync("./cfg.json").toString());

bot.login(cfg.token);

bot.getMRGRS = (() => {
    return mrgrs;
});

process.on("SIGINT", () =>{
    save('./database.json', bot.database);
    save('./mrgrs.json', mrgrs);
    save('./cfg.json', cfg);
    save('./xp.json', bot.ranks);
    bot.destroy();
});

bot.on('ready', () => {
    mrgrs = JSON.parse(fs.readFileSync('./mrgrs.json').toString());
    bot.ranks = JSON.parse(fs.readFileSync('./xp.json').toString());
    loadCommands("./cmds");
    bot.database = JSON.parse(fs.readFileSync('./database.json').toString());
    //loadMessages();
    console.log('Bot ready');
});




bot.on('guildMemberAdd', async (member) => {
    let unknownRole = await bot.database.guilds[member.guild.id].unknownRole;
    let verifiedRole = await bot.database.guilds[member.guild.id].verifedRole;
    if(unknownRole == undefined || verifiedRole == undefined) return;
	let guild = member.guild;
    let channel;
    await member.createDM().then(dmchannel => {
        channel = dmchannel;
    })
	member.roles.add(unknownRole);
	let num = 0;
	checkReact:
		while(1)
		{
			msg = await createReactions(bot, channel, cfg.emojis);
			res = await waitForReact(bot, msg, member);
			if(res)
			{
				await member.roles.remove(unknownRole);
                await member.roles.add(verifiedRole);
				await msg.delete();
				break checkReact;
			}
			else 
			{
				num++;
				msg.delete();
				if(num == 3) { member.kick("Bot"); return }
				else continue checkReact;
			}
		}
	if(!member.roles.cache.has(unknownRole))	
	{
		welcome(bot, member, guild);
	}
});

async function createReactions(bot, channel, emojies){
    emojis = await generateEmojis(emojies);
    react = await emojis[getRandomInt(emojis.length)];
    msg = await channel.send(`This is capcha, for registration please react on this message with this ${react}`);
    for(let i=0; i<emojis.length; i++)
    {
        msg.react(emojis[i]);
    } 
    bot.react = react;
    return msg;
}

async function waitForReact(bot, msg, member){
    let flag = false;
    await msg.awaitReactions((reaction, user) => user.id == member.id, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                if(collected.first().emoji.name == bot.react)
                {    
                    flag = true;
                }
            })
            .catch(() => {
                msg.channel.send('Time ran out, try again').delete({ timeout: 5000 })
            });
    return flag;
}

async function generateEmojis(emoji)
{
    emjcopy = emoji;
    let reacts = [];
    let k;
    for(let i=0; i<5; i++)
    {
        k = getRandomInt(emjcopy.length);
        await reacts.push(emjcopy[k]);
        emjcopy.splice(k, 1);
    } 
    return reacts;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
async function welcome(bot, member, guild)
{
    var embed = new Discord.MessageEmbed()
    .setTitle(`Привет ${member.displayName}!`)
    .setColor("#ff0051")
    .setDescription(`Доборо пожаловать на **${guild.name}**. Бери чаек и присаживайся и рассказывай свою забавную историю`)
    .setFooter(`ID:${member.id} | Стал пользователем Discord: ${member.user.createdAt}`, `https://i.imgur.com/FJn0EDJ.png`)
    .setImage(`https://i.gifer.com/3f4u.gif`)
    .setThumbnail(`https://i.imgur.com/lLHuaQX.png`)
     member.send(embed)
}




bot.on('message', msg => {
    if(msg.author.bot || msg.channel.type != "text") return;
    if(msg.content.startsWith(cfg.prefix))
    {
        let cmdLine = msg.content.slice(cfg.prefix.length, msg.content.length);
        let cmd = cmdLine;
        if(cmdLine.indexOf(' ') != -1)
        {
            cmd = cmdLine.slice(0,cmdLine.indexOf(' '));
            // args = cmdLine.slice(cmdLine.indexOf(' '), cmdLine.length);
        }
        for(let cname in commands){
            console.log(cname);
            if(cname == cmd)
            {
                let args = cmdLine.slice(cname.length+1).split(' ').filter(Boolean);
                console.log(args);
                commands[cname].run(bot, msg, args, cfg);
            }
        }
    }
    else
    {
        if(!bot.ranks[msg.guild.id])
        {
            bot.ranks[msg.guild.id] = {}
        }
        guild = bot.ranks[msg.guild.id];
        if(!guild[msg.member.id]) // bot.ranks[msg.member.id]
        {
            guild[msg.member.id] = { xp : 0, lvl : 1} // или bot.ranks[msg.member.id]
        } 
        else
        {
            let memberRank  = guild[msg.member.id]; //  или bot.ranks[msg.member.id]
            memberRank.xp++;
            if(memberRank.lvl >= Object.keys(cfg.lvls).length && memberRank.xp >= cfg.xpn)
            {
                memberRank.lvl++;
                memberRank.xp = 0;
                msg.reply(`You get ${memberRank.lvl} lvl`)
                return;
            }
            if(memberRank.xp  == cfg.lvls[memberRank.lvl])
            {
                memberRank.lvl++; // memberRank.xp = 0
                msg.reply(`You get ${memberRank.lvl} lvl`)
            }
        }
    }
});

bot.on('messageReactionAdd', (react, user) => {
    if(user.bot) return;
    if(!mrgrs[react.message.id] || !mrgrs[react.message.id][react.emoji.name]) return;
    role = mrgrs[react.message.id][react.emoji.name];
    if(role == null) return;
    react.message.guild.members.fetch(user.id)
    .then(member => { member.roles.add(role)})
    .then(() => { console.log(`Пользователь получил новую роль ${react.message.guild.roles.cache.get(role).name}`)})
    .catch(console.error);
});

bot.on('messageReactionRemove', (react, user) => {
    if(user.bot) return;
    if(!mrgrs[react.message.id] || !mrgrs[react.message.id][react.emoji.name]) return;
    role = mrgrs[react.message.id][react.emoji.name];
    if(role == null) return;
    react.message.guild.members.fetch(user.id)
    .then(member => { member.roles.remove(role)})
    .then(() => { console.log(`Пользователь лишился роли ${react.message.guild.roles.cache.get(role).name}`)})
    .catch(console.error);
});

function loadCommands(path)
{
    console.log('loading commands...');
    const files = fs.readdirSync(path).filter(f=> f.endsWith('.js'));
    files.forEach(file => {
        const cname = file.toLowerCase().substring(0, file.length-3);
        const command = require(path + "/" + file);
        commands[cname] = command;
        console.log(`* ${file} loaded - command ${cname}`)
    });
    console.log('commands successfully loaded');
}

function save(path, val) 
{
    fs.writeFileSync(path, JSON.stringify(val, null, 4 ));
}


async function loadMessages() {  
    console.log('loading msgs...');
    let msgs = mrgrs,
    channel;
    for(let msg in mrgrs)
    {
        channel = bot.guilds.cache.get(mrgrs[msg].guild).channels.cache.get(mrgrs[msg].channel);
        message = await setMessageValue(msg, channel);
        if(!message.id)
        {
            delete msg;
        }
        else
        {
            channel.messages.fetch(msg).then((msg) => {console.log(msg.content)})
        }
        console.log();
    }

}

async function setMessageValue (_messageID, _targetedChannel) {
    let foundMessage = new String();
    
    // Check if the message contains only numbers (Beacause ID contains only numbers)
    if (!Number(_messageID)) return 'FAIL_ID=NAN';

    // Check if the Message with the targeted ID is found from the Discord.js API
    try {
        await Promise.all([_targetedChannel.messages.fetch(_messageID)]);
    } catch (error) {
        // Error: Message not found
        if (error.code == 10008) {
            console.error('Failed to find the message! Setting value to error message...');
            foundMessage = 'FAIL_ID';
        }
    } finally {
        // If the type of variable is string (Contains an error message inside) then just return the fail message.
        if (typeof foundMessage == 'string') return foundMessage;
        // Else if the type of the variable is not a string (beacause is an object with the message props) return back the targeted message object.
        return _targetedChannel.messages.fetch(_messageID);
    }
}