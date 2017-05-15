import { ListenerAbstract } from 'metallic-listeners'

export default class UncaughtExceptionListener extends ListenerAbstract {
  constructor (emitter) {
    super(emitter, 'uncaughtException')
  }
}
