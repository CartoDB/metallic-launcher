import LauncherInterface from './launcher-interface'

export default class Launcher extends LauncherInterface {
  constructor (target) {
    super()
    this.target = target
  }

  get app () {
    return this.target.app
  }

  get role () {
    return this.target.role
  }

  async run () {
    const httpServer = await this.target.run()
    return httpServer
  }

  async close () {
    return this.target.close()
  }

  async exit (failure) {
    return this.target.exit(failure)
  }
}
