class User {
  constructor(pool, id, username, password, email, phone, two_factor_enabled, two_factor_secret, role, company_id) {
    this.pool = pool;
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.phone = phone;
    this.two_factor_enabled = two_factor_enabled;
    this.two_factor_secret = two_factor_secret;
    this.role = role
    this.company_id = company_id
  }

  static async getAllUsers(pool) {

    const query = "SELECT * FROM users WHERE role = 'user'";
    const client = await pool.connect();
    const { rows } = await client.query(query);
    client.release();
    return rows;
  }

  static async getUser(pool, username) {
    const query = "SELECT * FROM users WHERE username = $1";
    try {
      const client = await pool.connect();
      const result = await client.query(query, [username]);
      client.release();
      const userData = result.rows[0];
      if (!userData) {
        return null;
      }
      return new User(pool, userData.id, userData.username, userData.password, userData.email, userData.phone, userData.two_factor_enabled, userData.two_factor_secret, userData.role, userData.company_id);
    } catch (error) {
      console.error(`Error fetching user with username ${username}:`, error);
      throw error;
    }
  }

  static async createUser(pool, username, password, email, phone) {
    const query = "INSERT INTO users (username, password, email, phone, two_factor_enabled, two_factor_secret, role) " +
                  "VALUES ($1,$2,$3,$4,false,null,'user') RETURNING *";
    const client = await pool.connect();
    const values = [username, password, email, phone];
    const { rows } = await client.query(query, values);
    client.release();
    return rows[0];
  }

  static async getUserById(pool, id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const client = await pool.connect();
    const values = [id];
    const { rows } = await client.query(query, values);
    client.release();
    return rows[0];
  }

  static async updateUserById(pool, id, username, password, email, phone, role, company_id) {
    const query = 'UPDATE users SET username=$1, password=$2, email=$3, phone=$4, role=$5, company_id=$6 '
                  + 'WHERE id = $7 RETURNING *';
    const client = await pool.connect();
    const values = [username, password, email, phone, role, company_id, id];
    const { rows } = await client.query(query, values);
    client.release();
    return rows[0];
  }

  static async deleteUserById(pool, id) {
    const query = 'DELETE FROM users WHERE id = $1';
    const client = await pool.connect();
    const values = [id];
    await client.query(query, values);
    client.release();
    return true;
  }

  async updateUserSecret(secret) {
    try {
      const two_factor_secret = secret;

      const query = `
        UPDATE users
        SET two_factor_secret = $1
        WHERE id = $2
      `;
      const values = [two_factor_secret, this.id];

      const client = await this.pool.connect();
      await client.query(query, values);
      client.release();

      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async enable2FA() {
    try {
      const query = `
        UPDATE users
        SET two_factor_enabled = true
        WHERE id = $1
      `;
      const values = [this.id];

      const client = await this.pool.connect();
      await client.query(query, values);
      client.release();

      this.two_factor_enabled = true;
      return true;
    } catch (error) {
      console.error("Error enabling 2FA for user:", error);
      throw error;
    }
  }
}

module.exports = User;
