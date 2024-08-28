module.exports = {
  apps: [
    {
      name: 'clean-designs',
      script: 'dist/main.js',
      watch: true,
      env: {
        NODE_ENV: 'development', // Môi trường phát triển
      },
      env_production: {
        NODE_ENV: 'production', // Môi trường sản xuất
      },
    },
  ],
};
