import { FactoryInterface } from 'metallic-interfaces'
import ServerFactory from './server'
import LeaderFactory from './leader'

const ClusterClassFactories = new Set([ LeaderFactory, ServerFactory ])

export default class ClusterFactory extends FactoryInterface {
  static create ({ httpServer, metrics, logger, options = { enabled: false } } = {}) {
    for (let ClusterClassFactory of ClusterClassFactories) {
      if (ClusterClassFactory.shouldCreate(options.enabled)) {
        return ClusterClassFactory.create({ httpServer, metrics, logger, options })
      }
    }
  }
}
