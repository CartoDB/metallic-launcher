import { ListenerAbstract } from 'metallic-listeners'

export default class SigintListener extends ListenerAbstract {
  constructor (emitter) {
    super(emitter, 'SIGINT')
  }
}
