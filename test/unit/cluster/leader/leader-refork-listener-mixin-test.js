import assert from 'assert'
import sinon from 'sinon'
import EventEmitter from 'events'
import LeaderInterface from '../../../../src/cluster/leader/leader-interface'
import DummyLeader from '../../../support/dummy-leader'
import LeaderReforkListenerMixin from '../../../../src/cluster/leader/leader-refork-listener-mixin'
import ServerExitListener from '../../../../src/cluster/leader/server-exit-listener'
import cluster from 'cluster'

describe('leader-refork-listener-mixin', function () {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create()

    const Leader = LeaderReforkListenerMixin.mix(DummyLeader)

    const emitter = this.emitter = new EventEmitter()
    const serverExitListeners = this.serverExitListeners = new ServerExitListener({ emitter })
    const serverPoolSize = this.serverPoolSize = 2

    this.leader = new Leader({ serverExitListeners, cluster, serverPoolSize })
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  it(`should implement ${LeaderInterface.name}`, function () {
    assert.ok(this.leader instanceof LeaderInterface)
  })

  it('.run() should attach listener', async function () {
    const serverExitListenersListenSpy = this.sandbox.spy(this.serverExitListeners, 'listen')

    await this.leader.run()

    assert.ok(serverExitListenersListenSpy.calledOnce)
  })

  it('should refork when exit has been emitted', async function () {
    const launcherReforkSpy = this.sandbox.spy(this.leader, 'refork')

    await this.leader.run()
    this.emitter.emit('exit')
    await new Promise(resolve => resolve())

    assert.ok(launcherReforkSpy.calledOnce)
  })

  it('.close() should remove listener', async function () {
    const serverExitListenersRemoveStub = this.sandbox.stub(this.serverExitListeners, 'remove')

    await this.leader.run()
    await this.leader.close()

    assert.ok(serverExitListenersRemoveStub.calledOnce)
  })

  it('.exit() should remove listener', async function () {
    const serverExitListenersRemoveStub = this.sandbox.stub(this.serverExitListeners, 'remove')

    await this.leader.run()
    await this.leader.exit()

    assert.ok(serverExitListenersRemoveStub.calledOnce)
  })
})
