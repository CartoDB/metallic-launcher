import { ListenerAbstract } from 'metallic-listeners'

export default class ServerExitListener extends ListenerAbstract {
  constructor (emitter) {
    super(emitter, 'exit')
  }
}
