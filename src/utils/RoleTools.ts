import { Message, Role } from 'discord.js'

export default class RoleTools {
    /**
     * Adds a role to a user
     * @param {Message} message 
     * @param {string} roleName 
     * @param {string} userID 
     */
    public static add(message: Message, roleName: string, userID: string): boolean{
        //Get role
        let role = this.findByName(message, roleName);
        //Check getter was successful
        if(role === null) return message.reply(roleName + ' role doesn\'t exist!'), false;
        //Try to add the role
        try {
            message.guild.members.cache.get(userID).roles.add(role);
        }catch (err) {
            console.log(err);
            return false;
        }
        return true;
    }

    /**
     * Removes role from user
     * @param {Mesage} message 
     * @param {string} roleName 
     * @param {string} userID 
     */
    public static remove(message: Message, roleName: string, userID: string): boolean {
        //Get member and role
        let member = message.guild.members.cache.get(userID);
        let role = this.findByName(message, roleName);
        //Check getter was successful
        if(role === null) return message.reply(roleName + ' role doesn\'t exist!'), false;
        if(!member) return message.reply('Member not found!'), false;
        //Check if user has the role
        if(member.roles.cache.has(role.id))
            //Remove the role
            member.roles.remove(role).catch(err => console.log(err));
        //Otherwise fail
        else return false;
        //Return successful
        return true;
    }

    /**
     * Get role by name
     * @param {Message} message 
     * @param {string} roleName 
     */
    private static findByName(message: Message, roleName: string): Role {
        let role = message.guild.roles.cache.find(r => r.name === roleName);
        return (!role) ? null : role;
    }
};