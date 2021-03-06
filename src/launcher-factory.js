import { FactoryInterface } from 'metallic-interfaces'
import { default as ClusterFactory } from './cluster'
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
import LauncherMetricsMixin from './launcher-metrics-mixin'
import Launcher from './launcher'

export default class LauncherFactory extends FactoryInterface {
  static create ({ httpServer, metrics, logger, options } = {}) {
    const target = ClusterFactory.create({ httpServer, metrics, logger, options })

    const Sigint = logger ? ListenerLoggerMixin.mix(SigintListener) : SigintListener
    const Sigterm = logger ? ListenerLoggerMixin.mix(SigtermListener) : SigtermListener

    const exitSignalListeners = new Listeners()
      .add(new Sigint({ logger, emitter: process }))
      .add(new Sigterm({ logger, emitter: process }))

    const UncaughtException = logger ? ListenerLoggerMixin.mix(UncaughtExceptionListener) : UncaughtExceptionListener
    const uncaughtExceptionListeners = new Listeners()
      .add(new UncaughtException({ logger, emitter: process }))

    const UnhandledRejection = logger ? ListenerLoggerMixin.mix(UnhandledRejectionListener) : UnhandledRejectionListener
    const unhandledRejectionListeners = new Listeners()
      .add(new UnhandledRejection({ logger, emitter: process }))

    let FeaturedLauncher = logger ? LauncherLoggerMixin.mix(Launcher) : Launcher
    FeaturedLauncher = metrics ? LauncherMetricsMixin.mix(Launcher) : FeaturedLauncher

    FeaturedLauncher = LauncherExitOnErrorMixin.mix(
      LauncherExitSignalListenerMixin.mix(
        LauncherUncaughtExceptionListenerMixin.mix(
          LauncherUnhandledRejectionListenerMixin.mix(
            FeaturedLauncher
          )
        )
      )
    )

    return new FeaturedLauncher({
      logger,
      metrics,
      uncaughtExceptionListeners,
      exitSignalListeners,
      unhandledRejectionListeners,
      target
    })
  }
}
