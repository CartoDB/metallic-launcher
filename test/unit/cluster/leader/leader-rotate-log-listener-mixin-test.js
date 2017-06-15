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

    this.emitter = new EventEmitter()
    const sigusr2Listener = this.sigusr2Listener = new Sigusr2Listener(this.emitter)
    const serverPoolSize = this.serverPoolSize = 2

    this.leader = new Leader({ sigusr2Listener, cluster, serverPoolSize })
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  it(`should implement ${LeaderInterface.name}`, function () {
    assert.ok(this.leader instanceof LeaderInterface)
  })

  it('.run() should attach listener', async function () {
    const sigusr2ListenerListenSpy = this.sandbox.spy(this.sigusr2Listener, 'listen')

    await this.leader.run()

    assert.ok(sigusr2ListenerListenSpy.calledOnce)
  })

  it('should refork when sigusr2 has been emitted', async function () {
    const launcherReforkSpy = this.sandbox.spy(this.leader, 'rotateLog')

    await this.leader.run()
    this.emitter.emit('SIGUSR2')
    await new Promise(resolve => resolve())

    assert.ok(launcherReforkSpy.calledOnce)
  })

  it('.close() should remove listener', async function () {
    const sigusr2ListenerRemoveStub = this.sandbox.stub(this.sigusr2Listener, 'remove')

    await this.leader.run()
    await this.leader.close()

    assert.ok(sigusr2ListenerRemoveStub.calledOnce)
  })

  it('.exit() should remove listener', async function () {
    const sigusr2ListenerRemoveStub = this.sandbox.stub(this.sigusr2Listener, 'remove')

    await this.leader.run()
    await this.leader.exit()

    assert.ok(sigusr2ListenerRemoveStub.calledOnce)
  })
})
