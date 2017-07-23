export default class LeaderRebootListenerMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor ({ sighupListeners }) {
        super(...arguments)
        this.sighupListeners = sighupListeners
      }

      async run () {
        this.sighupListeners.listen(() => this.reboot())
        const httpServersInfo = await super.run()
        return httpServersInfo
      }

      async close () {
        this.sighupListeners.remove()
        await super.close()
      }

      async exit (failure = 0) {
        this.sighupListeners.remove()
        await super.exit(failure)
      }
    }
  }
}
