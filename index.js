const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

const TOKEN = process.env.DISCORD_TOKEN; // Utilisation de variables d'environnement pour la sécurité
const VISITOR_ROLE_NAME = 'Visiteur';
const VISIT_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const REGISTRATION_CHANNEL_ID = process.env.REGISTRATION_CHANNEL_ID;
const GUILD_ID = process.env.GUILD_ID;

client.once('ready', () => {
    console.log(`Bot ${client.user.tag} est connecté !`);
});

client.on('messageCreate', async message => {
    if (message.content === '!visit') {
        const guild = client.guilds.cache.get(GUILD_ID);
        const role = guild.roles.cache.find(r => r.name === VISITOR_ROLE_NAME);
        if (!role) return message.reply("Le rôle 'Visiteur' n'existe pas.");
        
        const member = guild.members.cache.get(message.author.id);
        if (member.roles.cache.has(role.id)) {
            return message.reply("Vous avez déjà le rôle 'Visiteur'.");
        }
        
        await member.roles.add(role);
        message.reply("Vous avez maintenant le rôle 'Visiteur' pour 24 heures.");

        setTimeout(async () => {
            await member.roles.remove(role);
        }, VISIT_DURATION);
    }

    if (message.content === '!register') {
        const filter = response => response.author.id === message.author.id;
        message.reply("Quel est votre nom ?");
        const collectedName = await message.channel.awaitMessages({ filter, max: 1, time: 60000 });
        const name = collectedName.first().content;

        message.reply("Quel âge avez-vous ?");
        const collectedAge = await message.channel.awaitMessages({ filter, max: 1, time: 60000 });
        const age = collectedAge.first().content;

        message.reply("Pourquoi souhaitez-vous rejoindre notre ville RP ?");
        const collectedReason = await message.channel.awaitMessages({ filter, max: 1, time: 60000 });
        const reason = collectedReason.first().content;

        const registrationChannel = client.channels.cache.get(REGISTRATION_CHANNEL_ID);
        registrationChannel.send(`Nouvelle inscription:\nNom: ${name}\nÂge: ${age}\nRaison: ${reason}`);
        message.reply("Votre inscription a été envoyée.");
    }
});

client.login(TOKEN);
