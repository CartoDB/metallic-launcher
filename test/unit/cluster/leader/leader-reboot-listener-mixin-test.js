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

    const emitter = this.emitter = new EventEmitter()
    const sighupListeners = new SighupListener({ emitter })
    this.sighupListeners = sighupListeners

    const serverPoolSize = 2

    this.leader = new Leader({ sighupListeners, cluster, serverPoolSize })
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  it(`should implement ${LeaderInterface.name}`, function () {
    assert.ok(this.leader instanceof LeaderInterface)
  })

  it('.run() should attach listener', async function () {
    const sighupListenersListenSpy = this.sandbox.spy(this.sighupListeners, 'listen')

    await this.leader.run()

    assert.ok(sighupListenersListenSpy.calledOnce)
  })

  it('should reboot when sighup has been emitted', async function () {
    const launcherRebootSpy = this.sandbox.spy(this.leader, 'reboot')

    await this.leader.run()
    this.emitter.emit('SIGHUP')
    await new Promise(resolve => resolve())

    assert.ok(launcherRebootSpy.calledOnce)
  })

  it('.close() should remove listener', async function () {
    const sighupListenersRemoveStub = this.sandbox.stub(this.sighupListeners, 'remove')

    await this.leader.run()
    await this.leader.close()

    assert.ok(sighupListenersRemoveStub.calledOnce)
  })

  it('.exit() should remove listener', async function () {
    const sighupListenersRemoveStub = this.sandbox.stub(this.sighupListeners, 'remove')

    await this.leader.run()
    await this.leader.exit()

    assert.ok(sighupListenersRemoveStub.calledOnce)
  })
})
