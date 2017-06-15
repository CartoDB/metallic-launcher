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

    this.emitter = new EventEmitter()
    const serverExitListener = this.serverExitListener = new ServerExitListener(this.emitter)
    const serverPoolSize = this.serverPoolSize = 2

    this.leader = new Leader({ serverExitListener, cluster, serverPoolSize })
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  it(`should implement ${LeaderInterface.name}`, function () {
    assert.ok(this.leader instanceof LeaderInterface)
  })

  it('.run() should attach listener', async function () {
    const serverExitListenerListenSpy = this.sandbox.spy(this.serverExitListener, 'listen')

    await this.leader.run()

    assert.ok(serverExitListenerListenSpy.calledOnce)
  })

  it('should refork when exit has been emitted', async function () {
    const launcherReforkSpy = this.sandbox.spy(this.leader, 'refork')

    await this.leader.run()
    this.emitter.emit('exit')
    await new Promise(resolve => resolve())

    assert.ok(launcherReforkSpy.calledOnce)
  })

  it('.close() should remove listener', async function () {
    const serverExitListenerRemoveStub = this.sandbox.stub(this.serverExitListener, 'remove')

    await this.leader.run()
    await this.leader.close()

    assert.ok(serverExitListenerRemoveStub.calledOnce)
  })

  it('.exit() should remove listener', async function () {
    const serverExitListenerRemoveStub = this.sandbox.stub(this.serverExitListener, 'remove')

    await this.leader.run()
    await this.leader.exit()

    assert.ok(serverExitListenerRemoveStub.calledOnce)
  })
})
