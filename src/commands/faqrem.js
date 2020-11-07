const JSONEdit = require('../utils/JSONEdit');
const config = require('../config.json');
const Logger = require('../utils/Logger');

module.exports = {
    name: 'faqrem',
    description: 'Remove a faq',
    async execute(message, args) {
        if(args.length !== 2) return message.reply("Invalid parameters");
        let id = parseInt(args[1]);
        let faq = await JSONEdit.removeFAQ(id);
        if(faq === undefined) return message.reply("Could not find a FAQ with that id");

        await message.react("✅");
        Logger.embed(message, 'Removed FAQ', '#' + faq.id + " | kw: " + faq.keywords.toString() + " | reply: " + faq.answer,'ID - ' + message.author.id, message.author, config.colors.faq.removed);
        return;
    }
}