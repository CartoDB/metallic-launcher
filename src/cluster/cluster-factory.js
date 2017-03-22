import { FactoryInterface } from 'metallic-interfaces'
import ServerFactory from './server/server-factory'
import LeaderFactory from './leader/leader-factory'

const ClusterClassFactories = new Set([ LeaderFactory, ServerFactory ])

export default class ClusterFactory extends FactoryInterface {
  static create (metrics, logger, options = { enabled: false }) {
    for (let ClusterClassFactory of ClusterClassFactories) {
      if (ClusterClassFactory.shouldCreate(options.enabled)) {
        return ClusterClassFactory.create(metrics, logger, options)
      }
    }
  }
}
