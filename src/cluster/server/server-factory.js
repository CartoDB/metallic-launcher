import { FactoryInterface } from 'metallic-interfaces'
import HttpServerFactory from 'metallic-app'
import Server from './server'

export default class ServerFactory extends FactoryInterface {
  static create (metrics, logger, options) {
    options = {
      port: 0,
      ...options
    }
    const port = options.port
    const httpServer = HttpServerFactory.create(metrics, logger, { port })
    return new Server(httpServer, logger)
  }

  static shouldCreate (clusterOn) {
    return Server.is(clusterOn)
  }
}
