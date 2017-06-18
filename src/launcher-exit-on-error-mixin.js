export default class LauncherExitOnErrorMixin {
  static mix (superclass) {
    return class extends superclass {
      async run () {
        try {
          const httpServer = await super.run()
          return httpServer
        } catch (err) {
          this.exit(1)
        }
      }
    }
  }
}
