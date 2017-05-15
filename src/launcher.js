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

  run () {
    return this.target.run()
  }

  close () {
    return this.target.close()
  }

  exit (failure) {
    return this.target.exit(failure)
  }
}
