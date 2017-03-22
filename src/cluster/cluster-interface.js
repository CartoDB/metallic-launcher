import { AbstractClassError, UnimplementedError } from 'metallic-errors'
import { RunnerInterface } from 'metallic-interfaces'

export default class ClusterInterface extends RunnerInterface {
  constructor () {
    if (new.target === ClusterInterface) {
      throw new AbstractClassError(ClusterInterface.name)
    }
    super()
  }

  static is () {
    throw new UnimplementedError()
  }
}
