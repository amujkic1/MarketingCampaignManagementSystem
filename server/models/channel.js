class Channel {
  constructor(pool, id, name) {
    this.pool = pool;
    this.id = id;
    this.name = name;
  }
  static async createChannel(pool, name) {
    const query = "INSERT INTO channels (name) VALUES ($1) RETURNING *";
    const client = await pool.connect();
    const values = [name];
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
    //const { rows } = await client.query(channel, values);
    //return rows;
  }
  static async updateChannel(pool, name, id) {
    const channel = "UPDATE channels SET name=$1 WHERE id=$2 RETURNING *";
    const client = await pool.connect();
    const values = [name, id];
    const { rows } = await client.query(channel, values);
    client.release();
    return rows[0];
  }

  static async getAllCampaignsForChannel(pool, id) {
    const query = "SELECT campaign.* FROM campaign JOIN campaign_channels ON campaign.id = campaign_channels.campaign_id"
                + " JOIN channels ON campaign_channels.channel_id = channels.id WHERE channels.id = $1"
    const client = await pool.connect();
    const values = [id];
    const { rows } = await client.query(query, values);
    client.release();
    return rows;
  }
}

module.exports = Channel;
