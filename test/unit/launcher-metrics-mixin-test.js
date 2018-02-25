import assert from 'assert'
import sinon from 'sinon'
import LauncherInterface from '../../src/launcher-interface'
import DummyLauncher from '../support/dummy-launcher'
import LauncherMetricsMixin from '../../src/launcher-metrics-mixin'
import { MetricsInterface } from 'metallic-metrics'

class Metrics extends MetricsInterface {}

describe('launcher-metrics-mixin', function () {
  beforeEach(function () {
    const MetricsLauncher = LauncherMetricsMixin.mix(DummyLauncher)

    this.sandbox = sinon.sandbox.create()
    const metrics = this.metrics = new Metrics()
    this.launcher = new MetricsLauncher({ metrics })
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  it(`should implement a ${LauncherMetricsMixin.name}`, function () {
    assert.ok(this.launcher instanceof LauncherInterface)
  })

  it('.run() should call `run` super method', async function () {
    const metricsRunStub = this.sandbox.stub(this.metrics, 'run')

    await this.launcher.run()

    assert.ok(metricsRunStub.calledOnce)
  })

  it('.run() should not catch error', async function () {
    const error = new Error('wadus')
    const metricsRunStub = this.sandbox.stub(this.metrics, 'run').throws(error)

    try {
      await this.launcher.run()
    } catch (err) {
      assert.equal(error, err)
      assert.ok(metricsRunStub.calledOnce)
    }
  })

  it('.close() should call `close` super method', async function () {
    const loggerCloseStub = this.sandbox.stub(this.metrics, 'close')

    await this.launcher.close()

    assert.ok(loggerCloseStub.calledOnce)
  })

  it('.close() should not catch error', async function () {
    const error = new Error('wadus')
    const metricsCloseStub = this.sandbox.stub(this.metrics, 'close').throws(error)

    try {
      await this.launcher.close()
    } catch (err) {
      assert.equal(error, err)
      assert.ok(metricsCloseStub.calledOnce)
    }
  })
})
