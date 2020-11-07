const fs = require('fs');
const path = require('path');
const confPath = path.join(__dirname, '../config.json');

class JSONEdit {

    static async addFAQ(keywords, answer){
        let conf = JSON.parse(fs.readFileSync(confPath));
        let id = Date.now();
        while(conf.faq.includes(e => e.id === id)) id = Date.now();
        conf.faq.push({
            id: id,
            keywords: keywords,
            answer: answer
        });
        await fs.writeFile(confPath, JSON.stringify(conf), () => console.log('added FAQ'));
        delete require.cache[require.resolve(confPath)];
        return {
            id: id,
            keywords: keywords,
            answer: answer
        }
    }

    static async removeFAQ(id){
        let conf = JSON.parse(fs.readFileSync(confPath));
        let faq = conf.faq.find(e => e.id === id);
        if(faq === undefined) return undefined;
        conf.faq = conf.faq.filter(e => e.id !== id);
        await fs.writeFile(confPath, JSON.stringify(conf), () => console.log('removed FAQ'));
        delete require.cache[require.resolve(confPath)];
        return faq;
    }
}

module.exports = JSONEdit;