const Discord = require("discord.js");
const YTDL = require("ytdl-core");

const PREFIX = ">"

function generateHex() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], { filter: audioonly }));

    server.queue.shift();

    server.dispatcher.on("end", function () {
        if (server.queue[0]) play(connection, message)
        else connection.disconnect();
    });
}

var fortunes = [
    "Yes",
    "No",
    "Maybe",
    "Never",
    "YEEEEEEEEEEEEEEEeeeeeeeeeeeee..............",
    "WOAH",
    "**W O A H**",
    "Fuck you",
    "My master is Kyuubi#1669 (McPunho2)",
    "What?",
    "...",
    "PHIJET PHINNNNEEETZZZZZZZZZZZZZZZZZZZZZ",
    "Nazism is good",
    "I refuse to say anything",
    "I am a good bot, controlled by a program."
];

var bot = new Discord.Client();

var servers = {};

bot.on("ready", function () {
    console.log("Ready");
    bot.user.setGame("Playing woah")
});

bot.on("guildMemberAdd", function (member) {
    member.guild.defaultChannel.send("Welcome to " + member.guild.name + " " + member.toString())
});

bot.on("message", function (message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()) {
        case "kick":
            if(!message.member.roles.some(r=>["Administrator", "Moderator", "Admin"].includes(r.name)) )
                return message.reply("Fock yu! U dun have permison!");

                let member = message.mentions.members.first();
                if(!member)
                    return message.reply("Please mention a valid member of this server");
                if(!member.kickable)
                    return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
                let reason = args.slice(1).join(' ');
                if(!reason)
                    return message.reply("Please indicate a reason for the kick!");
                await member.kick(reason)
                    .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
                message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
            break;
        case "say":
        const sayMessage = args.join(" ");
        message.delete().catch(O_o=>{}); 
        message.channel.send(sayMessage);
        break;
        case "ban":
        if(!message.member.roles.some(r=>["Administrator", "Admin"].includes(r.name)) )
            return message.reply("Sorry, you don't have permissions to use this!");
         break;

         let member = message.mentions.members.first();

         if(!member)
            return message.reply("Please mention a valid member of this server");
         if(!member.bannable) 
            return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");
        
            let reason = args.slice(1).join(' ');
            if(!reason)
              return message.reply("Please indicate a reason for the ban!");
            await member.ban(reason)
              .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
            message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
        case "noticeme":
            message.channel.sendMessage(message.author.toString() + " You were noticed by the god of memes, now get the fuck out.")
            break;
        case "purge":
        const deleteCount = parseInt(args[0], 10);
        
        // Ooooh nice, combined conditions. <3
        if(!deleteCount || deleteCount < 2 || deleteCount > 100)
          return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
        
        // So we get our messages, and delete them. Simple enough, right?
        const fetched = await message.channel.fetchMessages({count: deleteCount});
        message.channel.bulkDelete(fetched)
          .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
        break;
        case "ping":
            message.channel.sendMessage("Fuck you, i am not saying pong");
            break;
        case "info":
            message.channel.sendMessage("I am a meme bot, created for fun by McPunho2 (Kyuubi#1669).");
            break;
        case "8ball":
            if (args[1]) message.channel.sendMessage(fortunes[Math.floor(Math.random() * fortunes.length)]);
            else message.channel.sendMessage("I can't read that");
            break;
        default:
            message.channel.sendMessage("Invalid command, say **>cmds** for commands.");
    }

});

bot.login(process.env.TOKEN);
