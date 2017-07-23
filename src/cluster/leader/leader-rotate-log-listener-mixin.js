export default class LeaderRotateLogListenerMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor ({ sigusr2Listeners }) {
        super(...arguments)
        this.sigusr2Listeners = sigusr2Listeners
      }

      async run () {
        this.sigusr2Listeners.listen(() => this.rotateLog())
        const httpServersInfo = await super.run()
        return httpServersInfo
      }

      async close () {
        this.sigusr2Listeners.remove()
        await super.close()
      }

      async exit (failure = 0) {
        this.sigusr2Listeners.remove()
        await super.exit(failure)
      }
    }
  }
}
