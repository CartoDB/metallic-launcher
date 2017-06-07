export default class LeaderRebootListenerMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor (rebootListeners, ...args) {
        super(...args)
        this.rebootListeners = rebootListeners
      }

      async run () {
        this.rebootListeners.listen(() => this.reboot())
        await super.run()
      }

      async close () {
        this.rebootListeners.remove()
        await super.close()
      }

      async exit (failure = 0) {
        this.rebootListeners.remove()
        await super.exit(failure)
      }
    }
  }
}
