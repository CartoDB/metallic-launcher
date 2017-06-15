export default class LeaderReforkListenerMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor ({ serverExitListener }) {
        super(...arguments)
        this.serverExitListener = serverExitListener
      }

      async run () {
        this.serverExitListener.listen((server, code) => this.refork(server, code))
        await super.run()
      }

      async close () {
        this.serverExitListener.remove()
        await super.close()
      }

      async exit (failure = 0) {
        this.serverExitListener.remove()
        await super.exit(failure)
      }
    }
  }
}
