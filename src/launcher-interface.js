import { AbstractClassError, UnimplementedError } from 'metallic-errors'
import { RunnerInterface } from 'metallic-interfaces'

export default class LauncherInterface extends RunnerInterface {
  constructor () {
    if (new.target === LauncherInterface) {
      throw new AbstractClassError(LauncherInterface.name)
    }
    super()
  }

  async close () {
    throw new UnimplementedError()
  }
}
