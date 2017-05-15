export default class LauncherExitSignalListenerMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor (exitListeners, ...args) {
        super(...args)
        this.exitListeners = exitListeners
      }

      run () {
        this.exitListeners.listen(() => this.exit(0))
        return super.run()
      }

      close () {
        this.exitListeners.remove()
        return super.close()
      }

      exit (failure = 0) {
        this.exitListeners.remove()
        return super.exit(failure)
      }
    }
  }
}
