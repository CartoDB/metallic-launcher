import { FactoryInterface } from 'metallic-interfaces'
import ClusterFactory from './cluster/cluster-factory'
import { Listeners } from 'metallic-listeners'
import ListenerLoggerMixin from './listener-logger-mixin'
import SigintListener from './sigint-listener'
import SigtermListener from './sigterm-listener'
import UncaughtExceptionListener from './uncaught-exception-listener'
import UnhandledRejectionListener from './unhandled-rejection-listener'
import LauncherExitOnErrorMixin from './launcher-exit-on-error-mixin'
import LauncherUncaughtExceptionListenerMixin from './launcher-uncaught-exception-listener-mixin'
import LauncherExitSignalListenerMixin from './launcher-exit-signal-listener-mixin'
import LauncherUnhandledRejectionListenerMixin from './launcher-unhandled-rejection-listener-mixin'
import LauncherLoggerMixin from './launcher-logger-mixin'
import Launcher from './launcher'

export { default as Role, LEADER, SERVER } from './cluster/role'

export default class LauncherFactory extends FactoryInterface {
  static create (metrics, logger, options) {
    const target = ClusterFactory.create(metrics, logger, options)

    const LoggedSigintListener = ListenerLoggerMixin.mix(SigintListener)
    const LoggedSigtermListener = ListenerLoggerMixin.mix(SigtermListener)
    const exitSignalListeners = new Listeners()
      .add(new LoggedSigintListener(logger, process))
      .add(new LoggedSigtermListener(logger, process))

    const LoggedUncaughtExceptionListener = ListenerLoggerMixin.mix(UncaughtExceptionListener)
    const uncaughtExceptionListeners = new Listeners()
      .add(new LoggedUncaughtExceptionListener(logger, process))

    const LoggedUnhandledRejectionListener = ListenerLoggerMixin.mix(UnhandledRejectionListener)
    const unhandledRejectionListeners = new Listeners()
      .add(new LoggedUnhandledRejectionListener(logger, process))

    const LauncherOnSteroids = LauncherExitOnErrorMixin.mix(
      LauncherUncaughtExceptionListenerMixin.mix(
        LauncherExitSignalListenerMixin.mix(
          LauncherUnhandledRejectionListenerMixin.mix(
            LauncherLoggerMixin.mix(Launcher)
          )
        )
      )
    )
    return new LauncherOnSteroids(
      uncaughtExceptionListeners,
      exitSignalListeners,
      unhandledRejectionListeners,
      logger,
      target
    )
  }
}
