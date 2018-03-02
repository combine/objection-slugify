module.exports = {
  test: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './test/db/test.sqlite3'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './test/db/migrations'
    }
  }
};
