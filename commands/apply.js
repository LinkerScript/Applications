const { Message } = require('discord.js');
const Client = require('../client/Client');

module.exports = {
    name: 'apply',
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const questions = [`test1`, `test2`]
        const dmChannel = await message.author.send('Welcome to your application! Troll applications will be denied instantly and your responses will be sent to a channel.');
        const collector = dmChannel.channel.createMessageCollector((msg) => msg.author.id == message.author.id);
        let i = 0;
        const res = [];
        dmChannel.channel.send(questions[0])
        collector.on('collect', async(msg) => {
            if(questions.length == i) return collector.stop('MAX');
            const answer = msg.content;
            res.push({ question: questions[i], answer })
            i++;
            if(questions.length == i) return collector.stop('MAX');
            else {
                dmChannel.channel.send(questions[i])
            }
        });
        collector.on('end', async(collected, reason) => {
            if(reason == 'MAX') {
                const data = message.guild.channels.cache.find(ch => ch.name.toLowerCase() == 'application-logs' && ch.type == 'text');
                await data.send(`${message.member || message.author } submitted a application!\n${res.map(d => `${d.question} - ${d.answer}`).join("\n")}`)
            }
        })
    }
}
