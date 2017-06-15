export default class ListenerLoggerMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor ({ logger }) {
        super(...arguments)
        this.logger = logger
      }

      listen (handler) {
        this.logger.debug(`${super.constructor.name} attached to ${this.event} event`)
        super.listen((...args) => {
          this.logger.debug(`event (${this.event}) received`)
          handler(...args)
        })
      }
    }
  }
}
