import { ListenerAbstract } from 'metallic-listeners'

export default class Sigusr2Listener extends ListenerAbstract {
  constructor ({ emitter }) {
    super(emitter, 'SIGUSR2')
  }
}
