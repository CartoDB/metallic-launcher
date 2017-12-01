import { FactoryInterface } from 'metallic-interfaces'
import Server from './server'

export default class ServerFactory extends FactoryInterface {
  static create ({ httpServer } = {}) {
    return new Server({ httpServer })
  }

  static shouldCreate (clusterOn) {
    return Server.is(clusterOn)
  }
}
