class Channel {
  constructor(pool, id, name, channel) {
    this.pool = pool;
    this.id = id;
    this.name = name;
    this.channel = channel;
  }
  static async createChannel(pool, name, channel) {
    const query = "INSERT INTO channels (name, channel) VALUES ($1, $2) RETURNING *";
    const client = await pool.connect();
    const values = [name, channel];
    const { rows } = await client.query(query, values);
    client.release();
    return rows[0];
  }

  static async getChannels(pool) {
    const channels = "SELECT * FROM channels";
    const client = await pool.connect();
    const { rows } = await client.query(channels);
    client.release();
    return rows;
  }
  static async getChannelById(pool, id) {
    const channel = "SELECT * FROM channels WHERE id=$1";
    const client = await pool.connect();
    const values = [id];
    const { rows } = await client.query(channel, values);
    return rows;
  }
  static async deleteChannel(pool, id) {
    const channelQuery = "DELETE FROM campaign_channels WHERE channel_id = $1"
    const channel = "DELETE FROM channels WHERE id=$1";
    
    const client = await pool.connect();
    const values = [id];
    
    try{
      await client.query(channelQuery, values);
      await client.query(channel, values);
    } catch(error){
      console.log(error);
    }
    
    client.release();
    return true;
  }

  static async updateChannel(pool, name, channel, id) {
    console.log('update na serveru ', channel);
    const channelq = "UPDATE channels SET name=$1, channel=$3 WHERE id=$2 RETURNING *";
    const client = await pool.connect();
    const values = [name, id, channel];
    const { rows } = await client.query(channelq, values);
    client.release();
    return rows[0];
  }

  static async getAllCampaignsForChannel(pool, name) {
    const query = "SELECT * FROM campaign WHERE channels = $1";
    const client = await pool.connect();
    const values = [name];
    const { rows } = await client.query(query, values);
    client.release();
    return rows;
  }

  static async getChannelsByType(pool, type) {
    const query = "SELECT * FROM channels WHERE name = $1";
    const client = await pool.connect();
    const values = [type];
    const { rows } = await client.query(query, values);
    client.release();
    return rows;
  }

  static async addChannelToGroup(pool, groupId, channelId ) {
    try{
      console.log('usli u bazuuuuuuuuuuuuuuuuuuuuuu', groupId, channelId);
      const query = "UPDATE channels SET group_id = $1 WHERE id = $2"
      const client = await pool.connect();
      const values = [groupId, channelId];
      const { rows } = await client.query(query, values);
      client.release();
      return rows;  
    } catch(error) {
      console.log(error);
    }
  }

}

module.exports = Channel;
