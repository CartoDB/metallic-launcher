export default class LauncherUnhandledRejectionListenerMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor (logUnhandledRejectionListener, ...args) {
        super(...args)
        this.logUnhandledRejectionListener = logUnhandledRejectionListener

        if (!this.logger || typeof this.logger.log !== 'function') {
          throw new TypeError(`A logger bound to ${superclass.name} is required to use ${LauncherUnhandledRejectionListenerMixin.name}`)
        }
      }

      run () {
        this.logUnhandledRejectionListener.listen((reason, promise) => {
          promise.catch(err => this.logger.error('Unhandled promise rejection:', err))
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
