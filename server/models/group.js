class Group {
    constructor(pool, id, name, channel_type){
        this.pool = pool;
        this.id = id;
        this.name = name;
        this.channel_type = channel_type;
    }

    static async createGroup(pool, name, channelType){
        const query = "INSERT INTO groups (name, channel_type) VALUES ($1, $2) RETURNING *";
        const client = await pool.connect();
        const values = [name, channelType];
        const { rows } = await client.query(query, values);
        client.release();
        return rows[0];
    }

    static async getAllGroups(pool){
        const query = "SELECT * FROM groups";
        const client = await pool.connect();
        const { rows } = await client.query(query);
        client.release();
        return rows;
    }

}

module.exports = Group;