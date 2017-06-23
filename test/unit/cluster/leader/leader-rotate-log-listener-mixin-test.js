import assert from 'assert'
import sinon from 'sinon'
import EventEmitter from 'events'
import LeaderInterface from '../../../../src/cluster/leader/leader-interface'
import DummyLeader from '../../../support/dummy-leader'
import LeaderRotateLogListenerMixin from '../../../../src/cluster/leader/leader-rotate-log-listener-mixin'
import Sigusr2Listener from '../../../../src/cluster/leader/sigusr2-listener'
import cluster from 'cluster'

describe('leader-rotate-log-listener-mixin', function () {
  beforeEach(function () {
    const Leader = LeaderRotateLogListenerMixin.mix(DummyLeader)

    this.sandbox = sinon.sandbox.create()

    const emitter = this.emitter = new EventEmitter()
    const sigusr2Listeners = this.sigusr2Listeners = new Sigusr2Listener({ emitter })
    const serverPoolSize = this.serverPoolSize = 2

    this.leader = new Leader({ sigusr2Listeners, cluster, serverPoolSize })
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  it(`should implement ${LeaderInterface.name}`, function () {
    assert.ok(this.leader instanceof LeaderInterface)
  })

  it('.run() should attach listener', async function () {
    const sigusr2ListenersListenSpy = this.sandbox.spy(this.sigusr2Listeners, 'listen')

    await this.leader.run()

    assert.ok(sigusr2ListenersListenSpy.calledOnce)
  })

  it('should refork when sigusr2 has been emitted', async function () {
    const launcherReforkSpy = this.sandbox.spy(this.leader, 'rotateLog')

    await this.leader.run()
    this.emitter.emit('SIGUSR2')
    await new Promise(resolve => resolve())

    assert.ok(launcherReforkSpy.calledOnce)
  })

  it('.close() should remove listener', async function () {
    const sigusr2ListenersRemoveStub = this.sandbox.stub(this.sigusr2Listeners, 'remove')

    await this.leader.run()
    await this.leader.close()

    assert.ok(sigusr2ListenersRemoveStub.calledOnce)
  })

  it('.exit() should remove listener', async function () {
    const sigusr2ListenersRemoveStub = this.sandbox.stub(this.sigusr2Listeners, 'remove')

    await this.leader.run()
    await this.leader.exit()

    assert.ok(sigusr2ListenersRemoveStub.calledOnce)
  })
})
