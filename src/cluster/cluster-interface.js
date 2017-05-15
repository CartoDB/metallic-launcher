import { AbstractClassError, UnimplementedError } from 'metallic-errors'
import LauncherInterface from '../launcher-interface'

export default class ClusterInterface extends LauncherInterface {
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
