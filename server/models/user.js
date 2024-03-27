class User {
  constructor(pool, id, username, email, two_factor_enabled, two_factor_secret) {
    this.pool = pool;
    this.id = id;
    this.username = username;
    this.email = email;
    this.two_factor_enabled = two_factor_enabled;
    this.two_factor_secret = two_factor_secret;
  }

  static async getAllUsers(pool) {
    const query = 'SELECT * FROM users';
    try {
      const client = await pool.connect();
      const result = await client.query(query);
      client.release();
      return result.rows.map(row => new User(pool, row.id, row.username, row.email, row.two_factor_enabled, row.two_factor_secret));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  static async getUser(pool, username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    try {
      const client = await pool.connect();
      const result = await client.query(query, [username]);
      client.release();
      const userData = result.rows[0];
      if (!userData) {
        return null; 
      }
      return new User(pool, userData.id, userData.username, userData.email, userData.two_factor_enabled, userData.two_factor_secret);
    } catch (error) {
      console.error(`Error fetching user with username ${username}:`, error);
      throw error;
    }
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
      console.error('Error updating user:', error);
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
      console.error('Error enabling 2FA for user:', error);
      throw error;
    }
  }
}

module.exports = User;