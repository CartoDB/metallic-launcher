import LauncherInterface from './launcher-interface'

export default class Launcher extends LauncherInterface {
  constructor ({ metrics, target }) {
    super()
    this.metrics = metrics
    this.target = target
  }

  get role () {
    return this.target.role
  }

  async run () {
    await this.metrics.run()
    const httpServersInfo = await this.target.run()
    return httpServersInfo
  }

  async close () {
    await this.metrics.close()
    await this.target.close()
  }

  async exit (failure) {
    await this.target.exit(failure)
  }
}
