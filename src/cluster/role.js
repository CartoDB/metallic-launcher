import { isMaster } from 'cluster'
import { AbstractClassError } from 'metallic-errors'

export const LEADER = Symbol('leader')
export const SERVER = Symbol('server')

export default class Role {
  constructor () {
    throw new AbstractClassError(Role.name)
  }

  static isLeader (clusterOn) {
    return clusterOn && isMaster
  }

  static isServer (clusterOn) {
    return !this.isLeader(clusterOn)
  }

  static get (clusterOn) {
    return this.isLeader(clusterOn) ? LEADER : SERVER
  }

  static getName (clusterOn) {
    return this.isLeader(clusterOn) ? 'leader' : 'server'
  }
}
