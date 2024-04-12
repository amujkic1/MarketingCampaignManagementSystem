class Media {

    constructor(pool, id, name) {
        this.pool = pool;
        this.id = id;
        this.name = name;
    }

    static async createMedia(pool, name) {
        const query = 'INSERT INTO mediatypes (name) VALUES ($1) RETURNING *';
        const client = await pool.connect();
        const values = [name];
        const { rows } = await client.query(query, values);
        client.release();
        return rows[0];
    }

    static async getAllMedia(pool) {
        const query = 'SELECT * FROM mediatypes';
        const client = await pool.connect();
        const { rows } = await client.query(query);
        client.release();
        return rows;
    }

    static async getMediaById(pool, id) {
        const query = 'SELECT * FROM mediatypes WHERE id = $1';
        const client = await pool.connect();
        const values = [id];
        const { rows } = await client.query(query, values);
        client.release();
        return rows[0];
    }

    static async updateMediaById(pool, name, id) {
        const query = 'UPDATE mediatypes SET name = $1 WHERE id = $2 RETURNING *';
        const client = await pool.connect();
        const values = [name, id];
        const { rows } = await client.query(query, values);
        client.release();
        return rows[0];
    }

    static async updateTextMedia(pool, id, newText){
        const query = 'UPDATE media SET text = $2 WHERE id = $1'
        const client = await pool.connect();
        console.log(id);
        const values = [id, newText];
        const { rows } = await client.query(query, values);
        client.release();
        return rows[0];
    }

    static async deleteMediaById(pool, id) {
        const mediaQuery = "DELETE FROM campaign_mediatypes WHERE mediatype_id = $1"
        const query = 'DELETE FROM mediatypes WHERE id = $1';

        const client = await pool.connect();
        const values = [id];

        try {
            await client.query(mediaQuery, values);
            await client.query(query, values);
        } catch (error) {
            console.log(error);
        }

        client.release();
        return true;
    }

    static async getCampaignMedia(pool, campaign_id){
        const query = 'SELECT * FROM media WHERE campaign_id = $1';
        const client = await pool.connect();
        const values = [campaign_id];
        const { rows } = await client.query(query, values);
        client.release();
        return rows;
    }

    static async addMediaURL(pool, type, url, banner_link, campaign_id){

        let query, values;
        
        if(banner_link){
            query = 'INSERT INTO media (type, url, banner_link, campaign_id) VALUES ($1, $2, $3, $4) RETURNING *'
            values = [type, url, banner_link, campaign_id];
        }
        else{
            query = 'INSERT INTO media (type, url, campaign_id) VALUES ($1, $2, $3) RETURNING *'
            values = [type, url, campaign_id];
        }
        
        const client = await pool.connect();
        const { rows } = await client.query(query, values);
        client.release();
        return rows[0];
    }

    static async deleteCampaignUrl(pool, id) {
        
        const query = "DELETE FROM media WHERE campaign_id = $1"
        
        const client = await pool.connect();
        const values = [id];

        try {
            await client.query(query, values);
        } catch (error) {
            console.log(error);
        }

        client.release();
        return true;
    }

    static async deleteMediaUrl(pool, id) {
        
        const query = "DELETE FROM media WHERE id = $1"
        
        const client = await pool.connect();
        const values = [id];

        try {
            await client.query(query, values);
        } catch (error) {
            console.log(error);
        }

        client.release();
        return true;
    }

    static async addText(pool, text, campaign_id, type){
        
        const query = 'INSERT INTO media (type, text, campaign_id) VALUES ($1, $2, $3) RETURNING *'
        const values = [type, text, campaign_id];
        
        const client = await pool.connect();
        const { rows } = await client.query(query, values);
        client.release();
        return rows[0];
    }

}

module.exports = Media;