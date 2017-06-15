import { FactoryInterface } from 'metallic-interfaces'
import HttpServerFactory from 'metallic-app'
import Server from './server'

export default class ServerFactory extends FactoryInterface {
  static create ({ metrics, logger, options }) {
    options = {
      port: 0,
      ...options
    }
    const opts = { port: options.port }
    const httpServer = HttpServerFactory.create({ metrics, logger, opts })

    return new Server(httpServer)
  }

  static shouldCreate (clusterOn) {
    return Server.is(clusterOn)
  }
}
