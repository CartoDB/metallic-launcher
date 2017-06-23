import { ListenerAbstract } from 'metallic-listeners'

export default class SighupListener extends ListenerAbstract {
  constructor ({ emitter }) {
    super(emitter, 'SIGHUP')
  }
}
