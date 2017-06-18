export default class LauncherExitSignalListenerMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor ({ exitSignalListeners }) {
        super(...arguments)
        this.exitSignalListeners = exitSignalListeners
      }

      async run () {
        this.exitSignalListeners.listen(() => this.exit(0))
        const httpServer = await super.run()
        return httpServer
      }

      async close () {
        this.exitSignalListeners.remove()
        await super.close()
      }

      async exit (failure = 0) {
        this.exitSignalListeners.remove()
        await super.exit(failure)
      }
    }
  }
}
