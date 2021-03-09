const { Pool } = require('pg');

const DB = require('./database');

module.exports = class ORM {
    static instance = null;

    constructor() {
		try {
        	this.pool = new Pool({
            	host: DB.PGHOST,
            	port: DB.PGPORT,
            	database: DB.PGDATABASE,
            	user: DB.PGUSER,
            	password: DB.PGPASSWORD
        	});
		} catch (error) {
			console.error("Error connecting to database:", error.stack);
		}
	}

	static getInstance() {
		if (!(this.instance))
			this.instance = new this;
		return this.instance;
	}

	select(table, where = {}, order = null, limit = null) {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM "' + table + '" WHERE 1 = 1';
      let counter = 1;
      let values = [];
      for (const column in where) {
        if (where.hasOwnProperty(column)) {
          const value = where[column];
          query += ' AND "' + column + '" = $' + counter;
          values.push(value);
          counter++;
        }
      }
      if (order)
        query += ' ORDER BY ' + order[0] + ' ' + order[1];
      if (limit)
      query += ' LIMIT ' + limit[0] + ' OFFSET ' + limit[1];
      console.log(query, values);
      try {
        resolve(this.pool.query(query, values));
      } catch (e) {
        reject(e.message);
      }
    });
	}

	insert(table, values, fields = []) {
    return new Promise((resolve, reject) => {
      let query = 'INSERT INTO "' + table + '"' + (fields[0] ? ' (' : '');
      if (fields[0]) {
        for (let i = 0; i < fields.length; i++) {
          query += '"' + fields[i] + '"';
          if (i + 1 < fields.length)
            query += ', ';
        }
        query += ')';
      }
      query += ' VALUES (';
      let count = 1;
      let value_array = [];
      for (let i = 0; i < values.length; i++) {
        query += '$' + count;
        value_array.push(values[i]);
        if (i + 1 < values.length)
          query += ', ';
        count++;
      }
      query += ') RETURNING *';
      console.log(query, value_array);

      try {
        resolve(this.pool.query(query, values));
      } catch(e) {
        reject(e.message);
      }
    });
	}

	update(table, set, where = {}) {
    return new Promise((resolve, reject) => {
      let query = 'UPDATE "' + table + '" SET ';
      let counter = 1;
      let values = [];
      for (const column in set) {
        if (set.hasOwnProperty(column)) {
          const value = set[column];
          query += '"' + column + '" = $' + counter;
          query += (column == Object.keys(set).reverse().shift() ? '' : ', ')
          values.push(value);
          counter++;
        }
      }
      query += " WHERE 1 = 1";
      for (const column in where) {
        if (where.hasOwnProperty(column)) {
          const value = where[column];
          query += ' AND "' + column + '" = $' + counter;
          values.push(value);
          counter++;
        }
        query += " RETURNING '*';"
      }
      console.log(query, values);

      try {
        resolve(this.pool.query(query, values));
      } catch (e) {
        reject(e.message);
      }
    });
	}

	delete(table, where) {
    return new Promise((resolve, reject) => {
      let query = 'DELETE FROM "' + table + '" WHERE 1 = 1';
      let counter = 1;
      let values = [];
      for (const column in where) {
        if (where.hasOwnProperty(column)) {
          const value = where[column];
          query += ' AND ' + column + ' = $' + counter;
          values.push(value);
          counter++;
        }
      }
      query += ' RETURNING *';
      console.log(query, values);

      try {
        resolve(this.pool.query(query, values));
      } catch (e) {
        reject(e.message);
      }
    });
	}

	count(table, where) {
    return new Promise((resolve, reject) => {
      let query = 'SELECT COUNT(*) FROM "' + table + '" WHERE 1 = 1 RETURNING *';
      let counter = 1;
      let values = [];
      for (const column in where) {
        if (where.hasOwnProperty(column)) {
          const value = where[column];
          query += ' AND ' + column + ' = $' + counter;
          values.push(value);
          counter++;
        }
      }
      console.log(query, values);

      try {
        resolve(this.pool.query(query, values));
      } catch (e) {
        reject(e.message);
      }
    });
	}

  query(queryString, values) {
    return new Promise((resolve, reject) => {
      console.log(queryString, values);
      try {
        resolve(this.pool.query(queryString, values));
      } catch (e) {
        reject(e.message);
      }
    });
  }

};
