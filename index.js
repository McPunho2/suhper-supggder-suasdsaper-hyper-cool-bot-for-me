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
});

bot.on("guildMemberAdd", function (member) {
    member.guild.channels.find("name", "scripts_nudes_everything").sendMessage(member.toString() + " Welcome!")

    member.addRole(member.guild.roles.find("name", "dank member"));

    member.guild.createRole({
        name: member.user.username,
        color: generateHex(),
        permissions: []
    }).then(function (role) {
        member.addRole(role);
    })
});

bot.on("message", function (message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLowerCase()) {
        case "cmds":
            var cmds = new Discord.RichEmbed()
                .addField("cmds", "Show the commands")
                .addField("ping", "I will be rude")
                .addField("noticeme", "You will get noticed")
                .addField("info", "Info!")
                .addField("8ball", "Talk with me atleast a bit...")
                .setColor(0xDC143C)
                .setThumbnail()
            message.channel.sendEmbed(cmds);
            break;
        case "removerole":
            message.member.removeRole(message.member.guild.roles.find("name", "dank member"));
            break;
        case "kick":
            var moron= message.mentions.members.first();
            moron.kick().then((member) => {
                    message.channel.send(":wave: " + moron.displayName + " has been sucessfully kicked :point_right:");
            }).catch(() => {
                message.channel.send("Acess Denied");
            });
            break;
        case "deleterole":
            message.member.guild.roles.find("name", "dank member").delete();
            break;
        case "die":
            if (!args[1]) {
                message.channel.sendMessage("Please provide a link.")
                return;
            }

            if (!message.member.voiceChannel) {
                message.channel.sendMessage("You must be in a voice channel.")
                return;
            }

            if (!server[message.guild.id]) server[message.guild.id] = {
               queue: {} 
            };

            var server = server[message.guild.id];

            server.queue.push(args[1]);

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function (connection) {
                play(connection, message)
            })
            break;
        case "skip":
            var server = servers[message.guild.id];

            if (server.dispatcher) server.dispatcher.end();
            break;
        case "stop":
            var server = servers[message.guild.id];

            if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
            break;
        case "noticeme":
            message.channel.sendMessage(message.author.toString() + " You were noticed by the god of memes, now get the fuck out.")
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
