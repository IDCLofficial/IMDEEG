module.exports = {
  apps: [{
    script: 'npm start',
  }],

  deploy: {
    production: {
      key: 'key.pem',
      user: 'ubuntu',
      host: 'ministry-digital-economy',
      ref: 'origin/main',
      repo: 'git@github.com:myimoapp/ministry-of-digital_economy.git',
      path: '/home/ubuntu',
      'pre-deploy-local': '',
      'post-deploy': 'source ~/.nvm/nvm.sh && npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes'
    }
  }
};
