export default class LeaderReforkListenerMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor ({ serverExitListeners }) {
        super(...arguments)
        this.serverExitListeners = serverExitListeners
      }

      async run () {
        this.serverExitListeners.listen((server, code) => this.refork(server, code))
        const httpServersInfo = await super.run()
        return httpServersInfo
      }

      async close () {
        this.serverExitListeners.remove()
        await super.close()
      }

      async exit (failure = 0) {
        this.serverExitListeners.remove()
        await super.exit(failure)
      }
    }
  }
}
