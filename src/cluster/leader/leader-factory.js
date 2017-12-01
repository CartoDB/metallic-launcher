import cluster from 'cluster'
import os from 'os'
import { FactoryInterface } from 'metallic-interfaces'
import ListenerLoggerMixin from '../../listener-logger-mixin'
import Sigusr2Listener from './sigusr2-listener'
import SighupListener from './sighup-listener'
import ServerExitListener from './server-exit-listener'
import LeaderRebootListenerMixin from './leader-reboot-listener-mixin'
import LeaderReforkListenerMixin from './leader-refork-listener-mixin'
import LeaderRotateLogListenerMixin from './leader-rotate-log-listener-mixin'
import Leader from './leader'

export default class LeaderFactory extends FactoryInterface {
  static create ({ metrics, logger } = {}) {
    const serverPoolSize = os.cpus().length

    const LoggedSigusr2Listener = logger ? ListenerLoggerMixin.mix(Sigusr2Listener) : Sigusr2Listener
    const sigusr2Listeners = new LoggedSigusr2Listener({ logger, emitter: process })

    const LoggedServerExitListener = logger ? ListenerLoggerMixin.mix(ServerExitListener) : ServerExitListener
    const serverExitListeners = new LoggedServerExitListener({ logger, emitter: process })

    const LoggedSighupListener = logger ? ListenerLoggerMixin.mix(SighupListener) : SighupListener
    const sighupListeners = new LoggedSighupListener({ logger, emitter: process })

    const LeaderOnSteroids = LeaderRebootListenerMixin.mix(
      LeaderReforkListenerMixin.mix(
        LeaderRotateLogListenerMixin.mix(
          Leader
        )
      )
    )

    return new LeaderOnSteroids({
      sighupListeners,
      serverExitListeners,
      sigusr2Listeners,
      cluster,
      serverPoolSize
    })
  }

  static shouldCreate (clusterOn) {
    return Leader.is(clusterOn)
  }
}
