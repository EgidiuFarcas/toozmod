const mongoose = require('mongoose');
const moment = require('moment');
const lt = require('long-timeout');

const TimerModel = require('../database/timer');
const Actions = require('../utils/Actions');


class Timer {
    db_id = null;
    /**
     * Time event constructor
     * @param {User} user Discord user
     * @param {string} action Action Name
     * @param {number} duration Seconds
     * @param {boolean} start_now Optional (Default: True)
     * @param {number} start_delay Optional (Default: 0) Seconds
     */
    constructor(){}

    async load(database_id){
        this.db_id = database_id;

        let r = await TimerModel.findById(this.db_id);
        this.user_id = r.userID;
        this.username = r.username;
        this.end_action = r.action;
        this.time_start = moment.utc(r.started_at);
        this.time_end = moment.utc(r.end_at);
    }

    create(user, action, duration, start_now = true, start_delay = 0) {
        this.user_id = user.id;
        this.username = user.username;
        this.end_action = action;
        this.duration = duration;

        let m = moment.utc();
        this.time_start = (start_now) ? m.clone() : m.clone().add(start_delay, "s");
        this.time_end = this.time_start.clone().add(this.duration, "s");
    }

    start(message){
        let msg = "", user;
        if(this.end_action !== "unban") user = message.guild.members.cache.get(this.user_id).user;
        lt.setTimeout(async () => {
            switch (this.end_action){
                case "unmute":
                    msg = `**${message.client.user.tag}** unmuted user **${user.username}#${user.discriminator}**.`;
                    Actions.unmute(message, user, true, msg, message.client.user);
                    break;
                case "unblacklist":
                    msg = `**${message.client.user.tag}** unblacklisted user **${user.tag}**.`;
                    Actions.unblacklist(message, user, true, msg, message.client.user);
                    break;
                case "unban":
                    msg = `**${message.client.user.tag}** unbanned user **${this.user_id}**.`;
                    Actions.unban(message, this.user_id, true, msg, message.client.user);
                    break;
            }
            await this.delete();
        }, this.time_end.diff(moment.utc()));
    }

    save(){
        let t = new TimerModel({
            _id: mongoose.Types.ObjectId(),
            username: this.username,
            userID: this.user_id,
            action: this.end_action,
            started_at: this.time_start.toISOString(),
            end_at: this.time_end.toISOString(),
        });

        t.save()
            .then(result => {
                this.db_id = result._id;
            })
            .catch(err => console.log(err));
    }

    async delete(){
        if(this.db_id === null) return;
        await TimerModel.findByIdAndDelete(this.db_id);
    }

    /**
     * Get function from string name
     * @param {string} duration
     * @returns {number}
     */
    static parseTime(duration){
        let unit = duration.substr(duration.length - 1);
        let measure = parseInt(duration);
        switch (unit.toLowerCase()){
            case "s": return measure;
            case "m": return measure * 60;
            case "h": return measure * 3600;
            case "d": return measure * 86400;
            case "w": return measure * 604800;
            default:
                throw `Wrong time scale. Use s/m/h/d/w, ${unit} is not available.`;
                return 1;
        }
    }

    static async loadPendingTimers(message) {
        let timers = await this.getPendingTimers();
        await timers.forEach((info) => {
            let t = new Timer();
            t.load(info._id).then(() => t.start(message));
        });
        return;
    }

    static async getPendingTimers(){
        return await TimerModel.find();
    }
}

module.exports = Timer;