import { FactoryInterface } from 'metallic-interfaces'
import HttpServerFactory from 'metallic-app'
import Server from './server'

export default class ServerFactory extends FactoryInterface {
  static create (metrics, logger, options) {
    const httpServer = HttpServerFactory.create(metrics, logger, options)
    return new Server(httpServer, logger)
  }

  static shouldCreate (clusterOn) {
    return Server.is(clusterOn)
  }
}
