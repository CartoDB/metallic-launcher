export default class LeaderExitOnErrorMixin {
  static mix (superclass) {
    return class extends superclass {
      async run () {
        try {
          await super.run()
        } catch (err) {
          this.exit(1)
        }
      }
    }
  }
}
