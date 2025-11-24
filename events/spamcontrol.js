const messageLimits = new Map();
const LIMIT = 5;       
const TIME_FRAME = 3000; 

export default (client) => {
    console.log("Spam event yüklendi");

    client.on('messageCreate', async (message) => {
        if (message.author.bot || !message.guild) return;

        // Yetkili veya bot yapıyorsa ignore et
        if (message.member.permissions.has("MANAGE_MESSAGES")) return;

        const userId = message.author.id;
        const now = Date.now();

        if (!messageLimits.has(userId)) messageLimits.set(userId, []);

        const timestamps = messageLimits.get(userId);
        timestamps.push(now);

        const recent = timestamps.filter(ts => now - ts <= TIME_FRAME);
        messageLimits.set(userId, recent);

        if (recent.length >= LIMIT) {
            await message.channel.send(`${message.author}, spam yapmayı kes!`);
            try {
                await message.member.timeout(10 * 1000, 'Spam tespit edildi');
            } catch (err) {
                console.error(`Timeout başarısız: ${err}`);
            }
            messageLimits.set(userId, []);
        }
    });
};
