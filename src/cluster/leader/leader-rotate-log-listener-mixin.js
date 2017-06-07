export default class LeaderRotateLogListenerMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor (rotateLogListeners, ...args) {
        super(...args)
        this.rotateLogListeners = rotateLogListeners
      }

      async run () {
        this.rotateLogListeners.listen(() => this.rotateLog())
        await super.run()
      }

      async close () {
        this.rotateLogListeners.remove()
        await super.close()
      }

      async exit (failure = 0) {
        this.rotateLogListeners.remove()
        await super.exit(failure)
      }
    }
  }
}
