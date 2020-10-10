import Discord from 'discord.js';
import Timer from '../models/timer';
import Actions from '../helpers/actions';
import moment from 'moment';
import mongoose from 'mongoose';
import lt from 'long-timeout';

export default class TimeEvent {
    userID: string;
    username: string;
    endAction: string;
    timeStart: moment.Moment;
    timeEnd: moment.Moment;
    duration: string;
    objectID: mongoose.Types.ObjectId;
    
    constructor(){}

    /**
     * Load info from database
     * @param {mongoose.Types.ObjectId} objectID 
     */
    async load(objectID: mongoose.Types.ObjectId){
        this.objectID = objectID;

        let r = await Timer.findById(this.objectID);
        this.userID = r.userID;
        this.username = r.username;
        this.endAction = r.action;
        this.timeStart = moment.utc(r.startedAt);
        this.timeEnd = moment.utc(r.endAt);
    }

    /**
     * Create from scratch
     * @param {Discord.User} user 
     * @param {string} action 
     * @param {string} duration 
     * @param {boolean} startNow 
     * @param {number} startDelay 
     */
    create(user: Discord.User, action: string, duration: string, startNow: boolean = true, startDelay: number = 0) {
        this.userID = user.id;
        this.username = user.username;
        this.endAction = action;
        this.duration = duration;

        let m = moment.utc();
        this.timeStart = (startNow) ? m.clone() : m.clone().add(startDelay, "s");
        this.timeEnd = this.timeStart.clone().add(this.duration, "s");
    }

    /**
     * Start timeout 
     * @param {Discord.Message} message 
     */
    start(message: Discord.Message){
        let msg = "", user;
        if(this.endAction !== "unban") user = message.guild.members.cache.get(this.userID).user;
        lt.setTimeout(async () => {
            switch (this.endAction){
                case "unmute":
                    msg = `**${message.client.user.tag}** unmuted user **${user.username}#${user.discriminator}**.`;
                    Actions.unmute(message, user, true, msg, message.client.user);
                    break;
                case "unblacklist":
                    msg = `**${message.client.user.tag}** unblacklisted user **${user.tag}**.`;
                    Actions.unblacklist(message, user, true, msg, message.client.user);
                    break;
                case "unban":
                    msg = `**${message.client.user.tag}** unbanned user **${this.userID}**.`;
                    Actions.unbanID(message, this.userID, true, msg, message.client.user);
                    break;
            }
            await this.delete();
        }, this.timeEnd.diff(moment.utc()));
    }

    /**
     * Save time event info to database
     */
    save(){
        let t = new Timer({
            _id: mongoose.Types.ObjectId(),
            username: this.username,
            userID: this.userID,
            action: this.endAction,
            started_at: this.timeStart.toISOString(),
            end_at: this.timeEnd.toISOString(),
        });

        t.save()
            .then(result => {
                this.objectID = result._id;
            })
            .catch(err => console.log(err));
    }

    /**
     * Delete time event info from the database
     */
    async delete(){
        if(this.objectID === null) return;
        await Timer.findByIdAndDelete(this.objectID);
    }

    /**
     * Get function from string name
     * @param {string} duration
     * @returns {number}
     */
    static parseTime(duration: string): number{
        let unit = duration.substr(duration.length - 1);
        let measure = parseInt(duration);
        switch (unit.toLowerCase()){
            case "s": return measure;
            case "m": return measure * 60;
            case "h": return measure * 3600;
            case "d": return measure * 86400;
            case "w": return measure * 604800;
            default: return 0;
        }
    }
}