export default class LauncherUncaughtExceptionListenerMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor (uncaughtExceptionListeners, ...args) {
        super(...args)
        this.uncaughtExceptionListeners = uncaughtExceptionListeners
      }

      run () {
        this.uncaughtExceptionListeners.listen(() => this.exit(1))
        return super.run()
      }

      close () {
        this.uncaughtExceptionListeners.remove()
        return super.close()
      }

      exit (failure = 0) {
        this.uncaughtExceptionListeners.remove()
        return super.exit(failure)
      }
    }
  }
}
