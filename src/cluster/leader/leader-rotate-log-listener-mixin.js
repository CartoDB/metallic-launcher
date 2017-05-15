export default class LeaderRotateLogListenerMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor (rotateLogListeners, ...args) {
        super(...args)
        this.rotateLogListeners = rotateLogListeners
      }

      run () {
        this.rotateLogListeners.listen(() => this.rotateLog())
        return super.run()
      }

      close () {
        this.rotateLogListeners.remove()
        return super.close()
      }

      exit (failure = 0) {
        this.rotateLogListeners.remove()
        return super.exit(failure)
      }
    }
  }
}
