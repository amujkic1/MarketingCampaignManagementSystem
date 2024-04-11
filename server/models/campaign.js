class Campaign {
  constructor(pool, id, name, duration) {
    this.pool = pool;
    this.id = id;
    this.name = name;
    this.duration = duration;
  }

  static async createCampaign(
    pool,
    name,
    durationfrom,
    durationto,
    mediatypesName,
    channelName
  ) {
    const client = await pool.connect();
    const query =
      "INSERT INTO campaign (name, durationfrom, durationto,mediatypes, channels) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    console.log(channelName);
    console.log(mediatypesName);
    const channels = `SELECT id FROM channels WHERE name='${channelName}' `;
    const mediatypes = `SELECT id FROM mediatypes WHERE name='${mediatypesName}'`;

    const channelResult = await client.query(channels);
    const mediatypesResult = await client.query(mediatypes);

    const channelId = channelResult.rows[0].id;
    const mediatypesId = mediatypesResult.rows[0].id;

    console.log(channelId);
    console.log(mediatypesId);

    const values = [
      name,
      durationfrom,
      durationto,
      mediatypesName,
      channelName,
    ];
    const { rows } = await client.query(query, values);
    const campaignId = rows[0].id;

    const channelCampaign =
      "INSERT INTO campaign_channels (campaign_id,channel_id) VALUES ($1,$2)";
    const campaignChannelValues = [campaignId, channelId];
    const { rows: campaignChannelRows } = await client.query(
      channelCampaign,
      campaignChannelValues
    );
    const mediatypesCampaign =
      "INSERT INTO campaign_mediatypes (campaign_id, mediatype_id) VALUES ($1,$2)";
    const campaignMediaTypesValues = [campaignId, mediatypesId];
    const { rows: campaignMediaTypesRows } = await client.query(
      mediatypesCampaign,
      campaignMediaTypesValues
    );

    console.log(campaignChannelRows);
    console.log(campaignMediaTypesRows);

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
  static async updateCampaign(pool, id, name, durationfrom, durationto, mediatypes, channels) {
    try {
      let query;
      let values;

      if (name && durationfrom && durationto && mediatypes && channels) {
        query =
          "UPDATE campaign SET name=$2, durationfrom=$3, durationto=$4, mediatypes=$5, channels=$6 WHERE id=$1 RETURNING *";
        values = [id, name, durationfrom, durationto, mediatypes, channels];
      } else if (name) {
        query = "UPDATE campaign SET name=$2 WHERE id=$1 RETURNING *";
        values = [id, name];
      } else if (durationfrom) {
        query = "UPDATE campaign SET durationfrom=$2 WHERE id=$1 RETURNING *";
        values = [id, durationfrom];
      } else if (durationto) {
        query = "UPDATE campaign SET durationto=$2 WHERE id=$1 RETURNING *";
        values = [id, durationto];
      } else if(mediatypes) {
        query = "UPDATE campaign SET mediatypes=$2 WHERE id=$1 RETURNING *";
        values = [id, mediatypes];
      } else if(channels) {
        query = "UPDATE campaign SET channels=$2 WHERE id=$1 RETURNING *";
        values = [id, channels];
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

    const mediaQuery = "DELETE FROM campaign_mediatypes WHERE campaign_id = $1"
    const channelQuery = "DELETE FROM campaign_channels WHERE campaign_id = $1"
    const query = "DELETE FROM campaign WHERE id = $1";

    const client = await pool.connect();
    const values = [id];

    try {
      await client.query(mediaQuery, values);
      await client.query(channelQuery, values);
      await client.query(query, values);
    } catch (error) {
      console.log(error);
    }


    client.release();
    return true;
  }
}

module.exports = Campaign;
