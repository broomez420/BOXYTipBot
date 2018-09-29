module.exports = {
  apps: [
    {
      name: 'CFCCTipBot',
      script: './bot/bot.js',
      cwd: '/root/TipBot/',
      instance_id_env: '418569497495076865',
      watch: true,
      error_file:
        '/root/TipBot/Logs/tipbot-err.log',
      out_file: '/root/TipBot/Logs/tipbot-out.log',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
