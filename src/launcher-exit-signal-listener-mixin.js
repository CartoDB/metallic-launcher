export default class LauncherExitSignalListenerMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor ({ sigintListener }) {
        super(...arguments)
        this.sigintListener = sigintListener
      }

      async run () {
        this.sigintListener.listen(() => this.exit(0))
        const httpServer = await super.run()
        return httpServer
      }

      async close () {
        this.sigintListener.remove()
        await super.close()
      }

      async exit (failure = 0) {
        this.sigintListener.remove()
        await super.exit(failure)
      }
    }
  }
}
