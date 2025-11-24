process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { Client, Collection } from "discord.js";
import 'dotenv/config';
import { readdirSync } from "fs";

const client = new Client({
    intents: [33283],
    presence: {
        status: "online",
        activities: [{ name: "Sunucuyu", type: "WATCHING" }]
    }
});

export default client;

// ------------------- Event Loader -------------------
readdirSync("./events").forEach(file => {
    import(`./events/${file}`).then(m => {
        const event = m.default;
        event(client); // spamcontrol.js buraya bağlanacak
    }).catch(console.error);
});

// ------------------- Command Handler -------------------
client.commands = new Collection();
readdirSync("./commands").forEach(category => {
    readdirSync(`./commands/${category}`).forEach(file => {
        import(`./commands/${category}/${file}`).then(c => {
            const command = c.default;
            client.commands.set(command.name, command);
        }).catch(console.error);
    });
});

client.login(process.env.token);
