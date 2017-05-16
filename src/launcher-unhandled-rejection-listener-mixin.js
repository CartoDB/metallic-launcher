export default class LauncherUnhandledRejectionListenerMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor (logUnhandledRejectionListener, ...args) {
        super(...args)
        this.logUnhandledRejectionListener = logUnhandledRejectionListener
      }

      run () {
        this.logUnhandledRejectionListener.listen((reason, promise) => {
          promise.catch(err => {
            if (this.logger) {
              this.logger.error('Unhandled promise rejection:', err)
            }
            this.exit(1)
          })
        })
        return super.run()
      }

      close () {
        this.logUnhandledRejectionListener.remove()
        return super.close()
      }

      exit (failure = 0) {
        this.logUnhandledRejectionListener.remove()
        return super.exit(failure)
      }
    }
  }
}
