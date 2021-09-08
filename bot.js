const Discord = require('discord.js');
const fs  = require('fs');
const bot = new Discord.Client();
const Levels = require("discord-xp");
Levels.setURL("mongodb://localhost:27017/Danmachi");

if (fs.existsSync("./cfg.json"))
    cfg = JSON.parse(fs.readFileSync("./cfg.json").toString());
bot.login(cfg.token);

bot.on('ready', async () => {
});

bot.on("message", async (message) => {
    if (!message.guild) return;
    if (message.author.bot) return;
    
    const randomAmountOfXp = Math.floor(Math.random() * 29) + 1; // Min 1, Max 30
    const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
    if (hasLeveledUp) {
      const user = await Levels.fetch(message.author.id, message.guild.id);
      message.channel.send(`${message.author}, congratulations! You have leveled up to **${user.level}**. :tada:`);
    }
});