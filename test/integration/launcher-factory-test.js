import assert from 'assert'
import { RunnerInterface } from 'metallic-interfaces'
import LoggerFactory from 'metallic-logger'
import MetricsFactory from 'metallic-metrics'
import LauncherFactory from '../../src'

describe('launcher-factory', function () {
  it('.create() should return a Runner instance', function () {
    const logger = LoggerFactory.create({ name: 'wadus', enabled: false })
    const metrics = MetricsFactory.create(logger)
    const launcher = LauncherFactory.create(metrics, logger)

    assert.ok(launcher instanceof RunnerInterface)
  })
})
