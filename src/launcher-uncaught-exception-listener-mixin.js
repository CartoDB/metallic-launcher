export default class LauncherUncaughtExceptionListenerMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor ({ uncaughtExceptionListeners }) {
        super(...arguments)
        this.uncaughtExceptionListeners = uncaughtExceptionListeners
      }

      async run () {
        this.uncaughtExceptionListeners.listen(() => this.exit(1))
        const httpServer = await super.run()
        return httpServer
      }

      async close () {
        this.uncaughtExceptionListeners.remove()
        await super.close()
      }

      async exit (failure = 0) {
        this.uncaughtExceptionListeners.remove()
        await super.exit(failure)
      }
    }
  }
}
