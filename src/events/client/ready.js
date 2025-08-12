module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Success! ${client.user.tag} is logged in and online`);
    }
}