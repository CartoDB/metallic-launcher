import assert from 'assert'
import LoggerFactory from 'metallic-logger'
import MetricsFactory from 'metallic-metrics'
import { RunnerInterface } from 'metallic-interfaces'
import ServerFactory from '../../../../src/cluster/server'

describe('server-factory', function () {
  it('.create() should return a Runner instance', function () {
    const logger = LoggerFactory.create({ options: { enabled: false } })
    const metrics = MetricsFactory.create({ logger, options: { interval: 0 } })
    const server = ServerFactory.create({ metrics, logger })

    assert.ok(server instanceof RunnerInterface)
  })
})
