export default class LeaderRebootListenerMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor (rebootListeners, ...args) {
        super(...args)
        this.rebootListeners = rebootListeners
      }

      run () {
        this.rebootListeners.listen(() => this.reboot())
        return super.run()
      }

      close () {
        this.rebootListeners.remove()
        return super.close()
      }

      exit (failure = 0) {
        this.rebootListeners.remove()
        return super.exit(failure)
      }
    }
  }
}
