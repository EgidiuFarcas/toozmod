let Timer = require("../models/timer");
let Actions = require("../helpers/actions");
let moment = require("moment");

class TimeEvent {
    /**
     * Time event constructor
     * @param {User} user Discord user
     * @param {string} action Action Name
     * @param {number} duration Seconds
     * @param {boolean} start_now Optional (Default: True)
     * @param {number} start_delay Optional (Default: 0) Seconds
     */
    constructor(user, action, duration, start_now = true, start_delay = 0) {
        this.user_id = user.id;
        this.username = user.username;
        this.end_action = action;
        this.duration = duration;

        let m = moment.utc();
        this.time_start = (start_now) ? m.clone() : m.clone().add(start_delay, "s");
        this.time_end = this.time_start.clone().add(this.duration, "s");
        console.log("Time values: \n" + this.time_start.toISOString() + "\n" + this.time_end.toISOString());
    }

    start(client){
        setTimeout(() => {

        }, this.time_end.diff(moment.utc()));
    }

    save(){
        let t = new Timer({
            _id: mongoose.Types.ObjectId(),
            username: this.username,
            userID: this.user_id,
            action: this.end_action,
            started_at: this.time_start.toISOString(),
            end_at: this.time_end.toISOString(),
        });

        t.save()
            .then(result => console.log(result))
            .catch(err => console.log(err));
    }

    /**
     * Get function from string name
     * @param {string} name
     * @returns {function()}
     */
    static getFunctionFromName(name){
        switch (name){
            default: return ()=>{};
        }
    }
}

module.exports = TimeEvent;