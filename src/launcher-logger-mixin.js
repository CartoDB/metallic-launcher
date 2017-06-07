export default class LauncherLoggerMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor (logger, ...args) {
        super(...args)
        this.logger = logger
      }

      async run () {
        try {
          const httpServer = await super.run()
          this.logger.info('Ready')
          return httpServer
        } catch (err) {
          this.logger.error('Failed on initialization', err)
          throw err
        }
      }

      async close () {
        try {
          await super.close()
          this.logger.info('Closed')
        } catch (err) {
          this.logger.error('Failed on close', err)
          throw err
        }
      }

      async exit (failure) {
        this.logger.info(`Exit with code ${failure}`)
        await super.exit(failure)
      }
    }
  }
}
