module.exports = {
  apps: [
    {
      name: 'sorokid',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/var/www/sorokid',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // Auto restart nếu memory vượt quá 1GB
      max_memory_restart: '1G',
      // Logs
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      // Auto restart
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 1000
    }
  ]
};
