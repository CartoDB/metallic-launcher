export default class LauncherUnhandledRejectionListenerMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor ({ unhandledRejectionListener }) {
        super(...arguments)
        this.unhandledRejectionListener = unhandledRejectionListener
      }

      async run () {
        this.unhandledRejectionListener.listen((reason, promise) => {
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
        this.unhandledRejectionListener.remove()
        await super.close()
      }

      async exit (failure = 0) {
        this.unhandledRejectionListener.remove()
        await super.exit(failure)
      }
    }
  }
}
