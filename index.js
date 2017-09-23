const Discord = require("discord.js");
const YTDL = require("ytdl-core");
const opus = require('node-opus');
const search = require('youtube-search');

function play(connection, message){
    var server = servers[message.guild.id];
    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));
    server.queue.shift();
    server.dispatcher.on("end", function(){
      if(server.queue[0]) play(connection, message);
      else connection.disconnect();
      message.channel.send("Song Finished...")
    });
  }
  function searchfunc(message){
    var server = servers[message.guild.id];
    let opts = {
      key: "AIzaSyCeFwwxcMUvRlj8gR8rcX6g44X5NLYBIrg",
    }
    let args = message.content.slice(6)
    let name = args
    console.log(name)
    search(name, opts, (err, results) => {
        if(err) return console.log(err);
        server.queue.push(results[0].link);
      })
  };

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

    var moron= message.mentions.members.first();

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
            moron.kick().then((member) => {
                    message.channel.send(":wave: " + moron.displayName + " has been sucessfully kicked :point_right:");
            }).catch(() => {
                message.channel.send("Acess Denied");
            });
            break;
        case "ban":
            moron.ban().then((member) => {
                message.channel.send(moron.displayName + " is an idiot and was banned by " + message.author.toString());
            }).catch(() => {
                message.channel.send("Acess denied sori.");
            });
            break;
        case "play":
        if(!args[0]) return message.channel.send("Please send a link/name..."); //Makes sure that theres a name/link
        if(!message.member.voiceChannel) return message.reply("Please join a voice channel first!"); //Makes sure it can join a voice chat with that person
        if(!servers[message.guild.id]) servers[message.guild.id] ={ //makes sure that there is a queue value for that server
            queue: []
          }
          var server = servers[message.guild.id]
          if(args[0].startsWith("http")){ //checks if its a link or not
            message.reply("Adding "+args[0]);
            server.queue.push(args[0]);
          } else{ //searches for it with the api if a name
            message.reply("Adding "+(message.content.slice(6)));
            searchfunc(message)
          }
          if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){ //joins the vc
            play(connection, message); 
          });
        }
        break;
        case "deleterole":
            message.member.guild.roles.find("name", "dank member").delete();
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
