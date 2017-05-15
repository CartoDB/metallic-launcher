import { AbstractClassError, UnimplementedError } from 'metallic-errors'
import ClusterInterface from '../cluster-interface'

export default class LeaderInterface extends ClusterInterface {
  constructor () {
    if (new.target === LeaderInterface) {
      throw new AbstractClassError(LeaderInterface.name)
    }
    super()
  }

  refork () {
    throw new UnimplementedError()
  }

  async reboot () {
    throw new UnimplementedError()
  }

  async rotateLog () {
    throw new UnimplementedError()
  }
}
