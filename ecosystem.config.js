module.exports = {
  apps: [{
    script: 'npm start',
    env: {
      NODE_ENV: 'production',
      NEXT_PUBLIC_MINISTRY_ID: '1O4HtVq7a53ckg7fk40lj3',
      NEXT_PUBLIC_CONTENTFUL_SPACE_ID: 'g08mvfhb24ji',
      NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN: 'yZmq2UuZ1_8XDAKpc6zdstd8XtD4vEwTc5aqK-zPU-o',
      NEXT_PUBLIC_CONTENTFUL_PREVIEW_ACCESS_TOKEN: 'rlJ3RsWYOuYx4jdCjveT_2w5ekUNt4e14JuCHCdRfsw'
    }
  }],

  deploy: {
    production: {
      key: '~/.ssh/deeg.pem',
      user: 'ubuntu',
      host: 'digital-economy',
      ref: 'origin/main',
      repo: 'git@github.com:myimoapp/ministry-of-digital_economy.git',
      path: '/home/ubuntu',
      'pre-deploy-local': '',
      'post-deploy': 'export NEXT_PUBLIC_MINISTRY_ID=1O4HtVq7a53ckg7fk40lj3 && export NEXT_PUBLIC_CONTENTFUL_SPACE_ID=g08mvfhb24ji && export NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=yZmq2UuZ1_8XDAKpc6zdstd8XtD4vEwTc5aqK-zPU-o && export NEXT_PUBLIC_CONTENTFUL_PREVIEW_ACCESS_TOKEN=rlJ3RsWYOuYx4jdCjveT_2w5ekUNt4e14JuCHCdRfsw && source ~/.nvm/nvm.sh && npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes'
    }
  }
};
