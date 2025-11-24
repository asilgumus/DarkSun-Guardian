const mentionLimits = new Map();
const LIMIT = 5; 
const TIME_FRAME = 10000; 

export default (client) => {
    client.on('messageCreate', async (message) => {
        if (message.author.bot || !message.guild) return;

        // Yetkili veya bot yapıyorsa ignore et
        if (message.member.permissions.has("MANAGE_MESSAGES")) return;

        const userId = message.author.id;
        const now = Date.now();
        if (!mentionLimits.has(userId)) mentionLimits.set(userId, []);
        const timestamps = mentionLimits.get(userId);

        const mentions = message.mentions.users.size + (message.content.match(/<:[^:]+:\d+>/g) || []).length;
        if (mentions > 0) {
            timestamps.push(now);
            const recent = timestamps.filter(ts => now - ts <= TIME_FRAME);
            mentionLimits.set(userId, recent);

            if (recent.length >= LIMIT) {
                try {
                    await message.channel.send(`${message.author}, mention/emoji spam yapmayın!`);
                    await message.member.timeout(10000, 'Mention/Emoji spam');
                } catch(err) {
                    console.error(err);
                }
                mentionLimits.set(userId, []);
            }
        }
    });
};
