import Role, { SERVER } from '../role'
import ClusterInterface from '../cluster-interface'
import cluster from 'cluster'

export default class Server extends ClusterInterface {
  constructor ({ httpServer }) {
    super()
    this.httpServer = httpServer
  }

  static is (clusterOn) {
    return Role.isServer(clusterOn)
  }

  get role () {
    return SERVER
  }

  async run () {
    const httpServer = await this.httpServer.run()

    const httpServerInfo = { [process.pid]: httpServer.address() }

    if (cluster.isWorker) {
      process.send(httpServerInfo)
    }

    return httpServerInfo
  }

  async close () {
    await this.httpServer.close()
  }

  async exit (failure = 0) {
    await this.httpServer.close()
    process.exit(failure)
  }
}
