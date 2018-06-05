module.exports = {
  apps: [
    {
      name: 'TipBot',
      script: './bot/bot.js',
      cwd: '~/TipBot/',
      instance_id_env: '0',
      watch: true,
      error_file:
        '~/TipBot/Logs/tipbot-err.log',
      out_file: '~/TipBot/Logs/tipbot-out.log',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
