class Campaign {
  constructor(pool, id, name, duration) {
    this.pool = pool;
    this.id = id;
    this.name = name;
    this.duration = duration;
  }

  static async createCampaign(pool, name, duration) {
    const query =
      "INSERT INTO campaign (name, duration) VALUES ($1, $2) RETURNING *";
    const client = await pool.connect();
    const values = [name, duration];
    const { rows } = await client.query(query, values);
    client.release();
    return rows[0];
  }

  static async getCampaigns(pool) {
    const campaigns = "SELECT * FROM campaign";
    const client = await pool.connect();
    const { rows } = await client.query(campaigns);
    client.release();
    return rows;
  }
  static async getCampaignsById(pool, id) {
    const campaigns = "SELECT * FROM campaign WHERE id=$1";
    const client = await pool.connect();
    const values = [id];
    const { rows } = await client.query(campaigns, values);
    client.release();
    return rows;
  }
  static async updateCampaign(pool, id, name, duration) {
    try {
      let query;
      let values;

      if (name && duration) {
        query =
          "UPDATE campaign SET name=$2, duration=$3 WHERE id=$1 RETURNING *";
        values = [id, name, duration];
      } else if (name) {
        query = "UPDATE campaign SET name=$2 WHERE id=$1 RETURNING *";
        values = [id, name];
      } else if (duration) {
        query = "UPDATE campaign SET duration=$2 WHERE id=$1 RETURNING *";
        values = [id, duration];
      }

      const client = await pool.connect();
      const { rows } = await client.query(query, values);
      client.release();
      return rows[0];
    } catch (error) {
      console.error("Error updating campaign:", error);
      throw error;
    }
  }

  static async deleteCampaign(pool, id) {
    const query = "DELETE FROM campaign WHERE id = $1";
    const client = await pool.connect();
    const values = [id];
    await client.query(query, values);
    client.release();
    return true;
  }
}

module.exports = Campaign;
