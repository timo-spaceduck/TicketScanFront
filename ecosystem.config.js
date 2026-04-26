module.exports = {
  apps: [
    {
      name: 'TicketScanFront',
      port: '3043',
      exec_mode: 'cluster',
      instances: '1',
      script: './.output/server/index.mjs'
    }
  ]
}
