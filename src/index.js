import { FactoryInterface } from 'metallic-interfaces'
import ClusterFactory from './cluster/cluster-factory'
import { Listeners } from 'metallic-listeners'
import SigintListener from './sigint-listener'
import SigtermListener from './sigterm-listener'
import UncaughtExceptionListener from './uncaught-exception-listener'
import UnhandledRejectionListener from './unhandled-rejection-listener'
import Launcher from './launcher'

export { LEADER, SERVER } from './cluster/role'

export default class LauncherFactory extends FactoryInterface {
  static create (metrics, logger, options) {
    const target = ClusterFactory.create(metrics, logger, options)

    const processExitListeners = new Listeners()
      .add(new SigintListener(process, logger))
      .add(new SigtermListener(process, logger))
      .add(new UncaughtExceptionListener(process, logger))
      .add(new UnhandledRejectionListener(process, logger))

    return new Launcher(target, processExitListeners)
  }
}
