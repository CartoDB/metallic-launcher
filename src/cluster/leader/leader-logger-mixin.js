export default class LeaderLoggerMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor ({ logger }) {
        super(...arguments)
        this.logger = logger
      }

      async rotateLog () {
        try {
          await super.rotateLog()
          this.logger.info('Reopened all log file streams successfully')
        } catch (err) {
          this.logger.error('Failed while rotating logs', err)
          throw err
        }
      }

      async reboot () {
        try {
          await super.reloadAllServers()
          this.logger.info('Reloaded all servers successfully')
        } catch (err) {
          this.logger.error({ err })
        }
      }

      refork (server, code) {
        this.logger.info(`Refork server ${server} after exited with code ${code}`)
        this.fork(server, code)
      }
    }
  }
}
