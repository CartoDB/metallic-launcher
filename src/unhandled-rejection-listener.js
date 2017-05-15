import { ListenerAbstract } from 'metallic-listeners'

export default class UnhandledRejectionListener extends ListenerAbstract {
  constructor (emitter) {
    super(emitter, 'unhandledRejection')
  }
}
