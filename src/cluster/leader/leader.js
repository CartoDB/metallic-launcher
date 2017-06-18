import { ExitError } from 'metallic-errors'
import Role, { LEADER } from '../role'
import LeaderInterface from './leader-interface'

export default class Leader extends LeaderInterface {
  constructor (cluster, serverPoolSize) {
    super()
    this.cluster = cluster
    this.serverPoolSize = serverPoolSize
  }

  static is (clusterOn) {
    return Role.isLeader(clusterOn)
  }

  get role () {
    return LEADER
  }

  async run () {
    for (let i = 0; i < this.serverPoolSize; i++) {
      this.cluster.fork()
    }
  }

  async close () {
    process.exit(0)
  }

  async exit (failure = 0) {
    process.exit(failure)
  }

  refork (server, code) {
    if (code > 0 && !server.exitedAfterDisconnect) {
      this.cluster.fork()
    }
  }

  async reboot () {
    const serverKeys = Object.keys(this.cluster.workers)
    const reloads = serverKeys.map(serverKey => this.rebootServer(serverKey))

    return Promise.all(reloads)
  }

  rebootServer (serverKey) {
    return new Promise((resolve, reject) => {
      const server = this.cluster.workers[serverKey]

      server.disconnect()

      server.once('exit', () => {
        if (!server.exitedAfterDisconnect) {
          return reject(new ExitError('Server'))
        }

        const newServer = this.cluster.fork()

        newServer.once('listening', () => resolve())
        newServer.once('error', err => reject(err))
      })
    })
  }

  async rotateLog () {
    const serverKeys = Object.keys(this.cluster.workers)
    const rotates = serverKeys.map(serverKey => this.sendSignalToRotateLog(this.cluster.workers[serverKey]))

    return Promise.all(rotates)
  }

  sendSignalToRotateLog (server) {
    return new Promise((resolve, reject) => {
      server.send('logger:reopen-file-streams', err => err ? reject(err) : resolve())
    })
  }
}
