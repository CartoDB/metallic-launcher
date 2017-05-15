export default class LauncherLoggerMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor (logger, ...args) {
        super(...args)
        this.logger = logger
      }

      async run () {
        try {
          await super.run()
          this.logger.info('Ready')
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

      exit (failure) {
        this.logger.info(`Exit with code ${failure}`)
        super.exit(failure)
      }
    }
  }
}
