module.exports = {
  apps: [
    {
      name: 'sixtech-kb',
      script: 'npx',
      args: 'wrangler pages dev dist --ip 0.0.0.0 --port 3000',
      cwd: '/home/user/sixtech-knowledgebot',
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN
      }
    }
  ]
}
