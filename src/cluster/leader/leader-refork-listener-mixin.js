export default class LeaderReforkListenerMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor (reforkListeners, ...args) {
        super(...args)
        this.reforkListeners = reforkListeners
      }

      run () {
        this.reforkListeners.listen((server, code) => this.refork(server, code))
        return super.run()
      }

      close () {
        this.reforkListeners.remove()
        return super.close()
      }

      exit (failure = 0) {
        this.reforkListeners.remove()
        return super.exit(failure)
      }
    }
  }
}
