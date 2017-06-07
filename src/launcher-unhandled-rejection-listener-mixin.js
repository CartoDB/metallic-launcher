export default class LauncherUnhandledRejectionListenerMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor (logUnhandledRejectionListener, ...args) {
        super(...args)
        this.logUnhandledRejectionListener = logUnhandledRejectionListener
      }

      async run () {
        this.logUnhandledRejectionListener.listen((reason, promise) => {
          promise.catch(err => {
            if (this.logger) {
              this.logger.error('Unhandled promise rejection:', err)
            }
            this.exit(1)
          })
        })
        const httpServer = await super.run()
        return httpServer
      }

      async close () {
        this.logUnhandledRejectionListener.remove()
        await super.close()
      }

      async exit (failure = 0) {
        this.logUnhandledRejectionListener.remove()
        await super.exit(failure)
      }
    }
  }
}
