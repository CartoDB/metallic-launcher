export default class LeaderRotateLogListenerMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor ({ sigusr2Listener }) {
        super(...arguments)
        this.sigusr2Listener = sigusr2Listener
      }

      async run () {
        this.sigusr2Listener.listen(() => this.rotateLog())
        await super.run()
      }

      async close () {
        this.sigusr2Listener.remove()
        await super.close()
      }

      async exit (failure = 0) {
        this.sigusr2Listener.remove()
        await super.exit(failure)
      }
    }
  }
}
