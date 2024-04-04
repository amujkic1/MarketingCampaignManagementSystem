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

}

module.exports = Media;