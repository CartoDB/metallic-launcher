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
    const Leader = LeaderRebootListenerMixin.mix(DummyLeader)

    this.sandbox = sinon.sandbox.create()

    this.emitter = new EventEmitter()
    this.listener = new SighupListener(this.emitter)

    this.leader = new Leader(this.listener, cluster, 2)
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  it(`should implement ${LeaderInterface.name}`, function () {
    assert.ok(this.leader instanceof LeaderInterface)
  })

  it('.run() should attach listener', async function () {
    const listernerListenSpy = this.sandbox.spy(this.listener, 'listen')

    await this.leader.run()

    assert.ok(listernerListenSpy.calledOnce)
  })

  it('should reboot when sighup has been emitted', async function () {
    const launcherRebootSpy = this.sandbox.spy(this.leader, 'reboot')

    await this.leader.run()
    this.emitter.emit('SIGHUP')
    await new Promise(resolve => process.nextTick(resolve))

    assert.ok(launcherRebootSpy.calledOnce)
  })

  it('.close() should remove listener', async function () {
    const listenerRemoveStub = this.sandbox.stub(this.listener, 'remove')

    await this.leader.run()
    await this.leader.close()

    assert.ok(listenerRemoveStub.calledOnce)
  })

  it('.exit() should remove listener', async function () {
    const listenerRemoveStub = this.sandbox.stub(this.listener, 'remove')

    await this.leader.run()
    await this.leader.exit()

    assert.ok(listenerRemoveStub.calledOnce)
  })
})
