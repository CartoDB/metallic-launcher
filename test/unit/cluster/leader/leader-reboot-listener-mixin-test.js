import assert from 'assert'
import sinon from 'sinon'
import EventEmitter from 'events'
import LeaderInterface from '../../../../src/cluster/leader/leader-interface'
import DummyLeader from '../../../support/dummy-leader'
import LeaderRebootListenerMixin from '../../../../src/cluster/leader/leader-reboot-listener-mixin'
import SighupListener from '../../../../src/cluster/leader/sighup-listener'
import cluster from 'cluster'

describe('leader-exit-signal-listener-mixin', function () {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create()

    const Leader = LeaderRebootListenerMixin.mix(DummyLeader)

    this.emitter = new EventEmitter()
    const rebootListeners = new SighupListener(this.emitter)
    this.rebootListeners = rebootListeners

    const serverPoolSize = 2

    this.leader = new Leader({ rebootListeners, cluster, serverPoolSize })
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  it(`should implement ${LeaderInterface.name}`, function () {
    assert.ok(this.leader instanceof LeaderInterface)
  })

  it('.run() should attach listener', async function () {
    const rebootListenersListenSpy = this.sandbox.spy(this.rebootListeners, 'listen')

    await this.leader.run()

    assert.ok(rebootListenersListenSpy.calledOnce)
  })

  it('should reboot when sighup has been emitted', async function () {
    const launcherRebootSpy = this.sandbox.spy(this.leader, 'reboot')

    await this.leader.run()
    this.emitter.emit('SIGHUP')
    await new Promise(resolve => resolve())

    assert.ok(launcherRebootSpy.calledOnce)
  })

  it('.close() should remove listener', async function () {
    const rebootListenersRemoveStub = this.sandbox.stub(this.rebootListeners, 'remove')

    await this.leader.run()
    await this.leader.close()

    assert.ok(rebootListenersRemoveStub.calledOnce)
  })

  it('.exit() should remove listener', async function () {
    const rebootListenersRemoveStub = this.sandbox.stub(this.rebootListeners, 'remove')

    await this.leader.run()
    await this.leader.exit()

    assert.ok(rebootListenersRemoveStub.calledOnce)
  })
})
