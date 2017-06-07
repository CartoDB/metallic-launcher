export default class LauncherExitSignalListenerMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor (exitListeners, ...args) {
        super(...args)
        this.exitListeners = exitListeners
      }

      async run () {
        this.exitListeners.listen(() => this.exit(0))
        const httpServer = await super.run()
        return httpServer
      }

      async close () {
        this.exitListeners.remove()
        await super.close()
      }

      async exit (failure = 0) {
        this.exitListeners.remove()
        await super.exit(failure)
      }
    }
  }
}
