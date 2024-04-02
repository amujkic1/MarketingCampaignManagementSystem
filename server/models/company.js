class Company{

    constructor(pool, id, name, logo, admin_user_id){
        this.pool = pool;
        this.id = id;
        this.name = name;
        this.logo = logo;
        this.admin_user_id = admin_user_id;
    }

    static async getAdminCompanies(pool, adminId){
        const query = 'SELECT * FROM companies WHERE admin_user_id = $1';
        const client = await pool.connect();
        const values = [adminId];
        const { rows } = await client.query(query, values);
        client.release();
        return rows;
    }

}

module.exports = Company;