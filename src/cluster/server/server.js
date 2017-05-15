import Role, { SERVER } from '../role'
import ClusterInterface from '../cluster-interface'

export default class Server extends ClusterInterface {
  constructor (httpServer) {
    super()
    this.httpServer = httpServer
  }

  static is (clusterOn) {
    return Role.isServer(clusterOn)
  }

  get role () {
    return SERVER
  }

  get app () {
    return this.httpServer.app
  }

  async run () {
    const listener = await this.httpServer.run()
    return listener
  }

  async close () {
    await this.httpServer.close()
  }

  async exit (failure = 0) {
    await this.httpServer.close()
    process.exit(failure)
  }
}
