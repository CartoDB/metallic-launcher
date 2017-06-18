import { ListenerAbstract } from 'metallic-listeners'

export default class SigtermListener extends ListenerAbstract {
  constructor ({ emitter }) {
    super(emitter, 'SIGTERM')
  }
}
