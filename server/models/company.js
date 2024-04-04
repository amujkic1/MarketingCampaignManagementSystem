class Company{

    constructor(pool, id, name, logo, admin_user_id){
        this.pool = pool;
        this.id = id;
        this.name = name;
        this.logo = logo;
        this.admin_user_id = admin_user_id;
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