export default class LauncherMetricsMixin {
  static mix (superclass) {
    return class extends superclass {
      constructor ({ metrics }) {
        super(...arguments)
        this.metrics = metrics
      }

      async run () {
        await this.metrics.run()
        const httpServer = await super.run()
        return httpServer
      }

      async close () {
        await super.close()
        await this.metrics.close()
      }
    }
  }
}
