import assert from 'assert'
import LoggerFactory from 'metallic-logger'
import MetricsFactory from 'metallic-metrics'
import HttpServerFactory from 'metallic-app'
import { RunnerInterface } from 'metallic-interfaces'
import ClusterFactory from '../../../src/cluster'

describe('cluster-factory', function () {
  it('.create() should return a Runner instance', function () {
    const logger = LoggerFactory.create()
    const metrics = MetricsFactory.create({ logger })
    const httpServer = HttpServerFactory.create({ logger, metrics })
    const cluster = ClusterFactory.create({ httpServer, metrics, logger })

    assert.ok(cluster instanceof RunnerInterface)
  })
})
