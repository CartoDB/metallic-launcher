import assert from 'assert'
import LoggerFactory from 'metallic-logger'
import MetricsFactory from 'metallic-metrics'
import { RunnerInterface } from 'metallic-interfaces'
import ClusterFactory from '../../../src/cluster/cluster-factory'

describe('cluster-factory', function () {
  it('.create() should return a Runner instance', function () {
    const logger = LoggerFactory.create({ name: 'wadus', enabled: false })
    const metrics = MetricsFactory.create(logger)
    const cluster = ClusterFactory.create(metrics, logger, { enabled: false })

    assert.ok(cluster instanceof RunnerInterface)
  })
})
