const { Client, Collection } = require('discord.js');
const { join } = require('path');
const { readdirSync } = require('fs');
const { token } = require('../handle/Config.json')

class ApplicationClient extends Client {
    constructor(){
        super();
        this.commands = new Collection()
    };
    start(token, cmd){
        this.prefix = '/';
        this.login(token);
        readdirSync(join(process.cwd(), '..', cmd)).map((data) => {
            const file = require(join(process.cwd(), `..`, cmd, data));
            this.commands.set(file.name, file)
        });
        this.on('ready', () => console.log(`Logged in!`))
        this.on('message', async(message) => {
            if(message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(this.prefix)) return;
            const [ cmd, ...args ] = message.content.slice(this.prefix.length).trim().split(/ +/g);
            const command = this.commands.get(cmd.toLowerCase());
            if(!command) return;
            command.run(this, message, args).catch(console.error);
        })
    }
};
module.exports = ApplicationClient;
