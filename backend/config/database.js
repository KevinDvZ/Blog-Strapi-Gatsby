import fs from 'fs';

module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'sqlite',
        filename: env('DATABASE_FILENAME', '.tmp/data.db'),
        cors: {
          enabled: true,
          origin: ['*']
        },
      },
      options: {
        useNullAsDefault: true,
      },
    },
  },
});
