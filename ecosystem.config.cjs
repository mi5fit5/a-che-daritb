module.exports = {
  apps: [
    {
      name: 'wishlist-backend',
      script: 'dist/server.js',
      cwd: './backend',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      env_file: '.env',
    },
  ],
};
