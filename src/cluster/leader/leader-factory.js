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
  static create (metrics, logger) {
    const serverPoolSize = os.cpus().length

    const LoggedSigusr2Listener = ListenerLoggerMixin.mix(Sigusr2Listener)
    const sigusr2Listener = new LoggedSigusr2Listener(logger, process)

    const LoggedServerExitListener = ListenerLoggerMixin.mix(ServerExitListener)
    const serverExitListener = new LoggedServerExitListener(logger, process)

    const LoggedSighupListener = ListenerLoggerMixin.mix(SighupListener)
    const sighupListener = new LoggedSighupListener(logger, process)

    const LeaderOnSteroids = LeaderRebootListenerMixin.mix(
      LeaderReforkListenerMixin.mix(
        LeaderRotateLogListenerMixin.mix(
          Leader
        )
      )
    )

    return new LeaderOnSteroids(sighupListener, serverExitListener, sigusr2Listener, cluster, serverPoolSize)
  }

  static shouldCreate (clusterOn) {
    return Leader.is(clusterOn)
  }
}
