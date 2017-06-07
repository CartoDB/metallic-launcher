export default class LeaderReforkListenerMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor (reforkListeners, ...args) {
        super(...args)
        this.reforkListeners = reforkListeners
      }

      async run () {
        this.reforkListeners.listen((server, code) => this.refork(server, code))
        await super.run()
      }

      async close () {
        this.reforkListeners.remove()
        await super.close()
      }

      async exit (failure = 0) {
        this.reforkListeners.remove()
        await super.exit(failure)
      }
    }
  }
}
