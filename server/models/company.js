class Company{

    constructor(pool, id, name, admin_user_id, niche, headquarters){
        this.pool = pool;
        this.id = id;
        this.name = name;
        this.admin_user_id = admin_user_id;
        this.niche = niche;
        this.headquarters = headquarters;
    }

    static async getAdminCompanies(pool){
        const query = 'SELECT * FROM companies';
        const client = await pool.connect();
        const { rows } = await client.query(query);
        client.release();
        return rows;
    }

}

module.exports = Company;