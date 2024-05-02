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
    region,
    durationfrom,
    durationto,
    mediatypesName,
    channelName
  ) {
    const client = await pool.connect();
    const query =
      "INSERT INTO campaign (name, region, durationfrom, durationto,mediatypes, channels) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    const channels = `SELECT id FROM channels WHERE name='${channelName}' `;
    const mediatypes = `SELECT id FROM mediatypes WHERE name='${mediatypesName}'`;

    const channelResult = await client.query(channels);
    const mediatypesResult = await client.query(mediatypes);

    const channelId = channelResult.rows[0].id;
    const mediatypesId = mediatypesResult.rows[0].id;

    const values = [
      name,
      region,
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

  static async updateCampaign(
    pool,
    id,
    name,
    region,
    durationfrom,
    durationto,
    mediatypes,
    channels,
    oldChannel
  ) {
    try {
      
      let query;
      let values;

      if (name && region && durationfrom && durationto && mediatypes && channels) {
        query =
          "UPDATE campaign SET name=$2, region=$3, durationfrom=$4, durationto=$5, mediatypes=$6, channels=$7 WHERE id=$1 RETURNING *";
        values = [id, name, region, durationfrom, durationto, mediatypes, channels];
      } else if (name) {
        query = "UPDATE campaign SET name=$2 WHERE id=$1 RETURNING *";
        values = [id, name];
      } else if (durationfrom) {
        query = "UPDATE campaign SET durationfrom=$2 WHERE id=$1 RETURNING *";
        values = [id, durationfrom];
      } else if (durationto) {
        query = "UPDATE campaign SET durationto=$2 WHERE id=$1 RETURNING *";
        values = [id, durationto];
      } else if (mediatypes) {
        query = "UPDATE campaign SET mediatypes=$2 WHERE id=$1 RETURNING *";
        values = [id, mediatypes];
      } else if (channels) {
        query = "UPDATE campaign SET channels=$2 WHERE id=$1 RETURNING *";
        values = [id, channels];
      }

      const channelQuery = "SELECT id FROM channels WHERE name = $1"
      const channelValues = [channels]   

      const oldChannelQuery = "SELECT id FROM channels WHERE name = $1"
      const oldChannelValues = [oldChannel]
      
      const client = await pool.connect();
      const { rows } = await client.query(query, values); 
      
      const { rows: channelRows } = await client.query(channelQuery, channelValues); 
      const channelId = channelRows[0].id;

      const { rows: oldChannelRows } = await client.query(oldChannelQuery, oldChannelValues);
      const oldChannelId = oldChannelRows[0].id;

      const deleteOldChannelQuery = "DELETE FROM campaign_channels WHERE campaign_id = $1 AND channel_id = $2";
      const insertNewChannelQuery = "INSERT INTO campaign_channels (campaign_id, channel_id) VALUES ($1, $2)";

      await client.query(deleteOldChannelQuery, [id, oldChannelId]);

      await client.query(insertNewChannelQuery, [id, channelId]);

      console.log(channelId);
      console.log(oldChannelId);

      client.release();
      return rows[0];

    } catch (error) {
      console.error("Error updating campaign:", error);
      throw error;
    }
  }

  static async deleteCampaign(pool, id) {
    const mediaTypeQuery =
      "DELETE FROM campaign_mediatypes WHERE campaign_id = $1";
    const channelQuery = "DELETE FROM campaign_channels WHERE campaign_id = $1";
    const mediaQuery = "DELETE FROM media WHERE campaign_id = $1";
    const query = "DELETE FROM campaign WHERE id = $1";

    const client = await pool.connect();
    const values = [id];

    try {
      await client.query(mediaTypeQuery, values);
      await client.query(channelQuery, values);
      await client.query(mediaQuery, values);
      await client.query(query, values);
    } catch (error) {
      console.log(error);
    }

    client.release();
    return true;
  }

  static async getCampaignMedia(pool, id) {
    const allCampaignMedia =
      "SELECT url, type, banner_link, text, id FROM media JOIN campaign_mediatypes ON media.campaign_id=campaign_mediatypes.campaign_id WHERE media.campaign_id=$1";

    const client = await pool.connect();
    const values = [id];

    try {
      const result = await client.query(allCampaignMedia, values);

      return result.rows.map((row) => ({
        url: row.url,
        mediatype: row.type,
        banner_link: row.banner_link,
        text: row.text,
        id: row.id,
      }));
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async assignGroup(pool, region_name, campaign_name) {

    console.log('region name u assign group ', region_name);
    console.log('campaign name u assign group ', campaign_name);
    try{
      const groupIdQuery = "select id from groups where name = $1"
      const client = await pool.connect();
      const groupValues = [region_name];
      const { rows: groupRows } = await client.query(groupIdQuery, groupValues);
      const groupId = groupRows[0];

      console.log('id grupe kod assign group', groupId);

      const campaignQuery = "select id from campaign where name = $1"
      const campaignValues = [campaign_name];
      const { rows: campaignRows } = await client.query(campaignQuery, campaignValues);
      const campId = campaignRows[0];

      console.log('id kampanje kod assign group', campId);
      
      const assignQuery = "update campaign set groupid = $2 where id = $1";
      const assignValues = [campId.id, groupId.id];
      await client.query(assignQuery, assignValues);    
      
      client.release();
  
  
    } catch (error) {
      console.log(error);
    }

  }
}

module.exports = Campaign;
