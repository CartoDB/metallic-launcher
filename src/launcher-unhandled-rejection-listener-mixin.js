export default class LauncherUnhandledRejectionListenerMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor ({ unhandledRejectionListeners }) {
        super(...arguments)
        this.unhandledRejectionListeners = unhandledRejectionListeners
      }

      async run () {
        this.unhandledRejectionListeners.listen((reason, promise) => {
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
        this.unhandledRejectionListeners.remove()
        await super.close()
      }

      async exit (failure = 0) {
        this.unhandledRejectionListeners.remove()
        await super.exit(failure)
      }
    }
  }
}
