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

    const listenerArgs = logger ? [ logger, process ] : [ process ]
    const Sigint = logger ? ListenerLoggerMixin.mix(SigintListener) : SigintListener
    const Sigterm = logger ? ListenerLoggerMixin.mix(SigtermListener) : SigtermListener

    const exitSignalListeners = new Listeners()
      .add(new Sigint(...listenerArgs))
      .add(new Sigterm(...listenerArgs))

    const UncaughtException = logger ? ListenerLoggerMixin.mix(UncaughtExceptionListener) : UncaughtExceptionListener
    const uncaughtExceptionListeners = new Listeners()
      .add(new UncaughtException(...listenerArgs))

    const UnhandledRejection = logger ? ListenerLoggerMixin.mix(UnhandledRejectionListener) : UnhandledRejectionListener
    const unhandledRejectionListeners = new Listeners()
      .add(new UnhandledRejection(...listenerArgs))

    const EventedLauncher = LauncherExitOnErrorMixin.mix(
      LauncherUncaughtExceptionListenerMixin.mix(
        LauncherExitSignalListenerMixin.mix(
          LauncherUnhandledRejectionListenerMixin.mix(
            Launcher
          )
        )
      )
    )

    const LauncherOnSteroids = logger ? LauncherLoggerMixin.mix(EventedLauncher) : EventedLauncher
    const launcherArgs = [
      uncaughtExceptionListeners,
      exitSignalListeners,
      unhandledRejectionListeners,
      target
    ]

    if (logger) {
      launcherArgs.unshift(logger)
    }

    return new LauncherOnSteroids(...launcherArgs)
  }
}
