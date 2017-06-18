import assert from 'assert'
import sinon from 'sinon'
import EventEmitter from 'events'
import LauncherInterface from '../../src/launcher-interface'
import DummyLauncher from '../support/dummy-launcher'
import LauncherExitSignalListenerMixin from '../../src/launcher-exit-signal-listener-mixin'
import SigintListener from '../../src/sigint-listener'

describe('launcher-exit-signal-listener-mixin', function () {
  beforeEach(function () {
    const EventedLauncher = LauncherExitSignalListenerMixin.mix(DummyLauncher)

    this.sandbox = sinon.sandbox.create()

    const emitter = this.emitter = new EventEmitter()
    const exitSignalListeners = this.exitSignalListeners = new SigintListener({ emitter })

    this.launcher = new EventedLauncher({ exitSignalListeners })
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  it(`should implement ${LauncherInterface.name}`, function () {
    assert.ok(this.launcher instanceof LauncherInterface)
  })

  it('.run() should attach listener', async function () {
    const exitSignalListenersListenSpy = this.sandbox.spy(this.exitSignalListeners, 'listen')

    await this.launcher.run()

    assert.ok(exitSignalListenersListenSpy.calledOnce)
  })

  it('should exit when exit signal has been emitted', async function () {
    const error = new Error('wadus')
    const launcherExitSpy = this.sandbox.spy(this.launcher, 'exit')

    await this.launcher.run()
    this.emitter.emit('SIGINT', error)
    await new Promise(resolve => resolve())

    assert.ok(launcherExitSpy.calledOnce)
  })

  it('.close() should remove listener', async function () {
    const exitSignalListenersRemoveStub = this.sandbox.stub(this.exitSignalListeners, 'remove')

    await this.launcher.run()
    await this.launcher.close()

    assert.ok(exitSignalListenersRemoveStub.calledOnce)
  })

  it('.exit() should remove listener', async function () {
    const exitSignalListenersRemoveStub = this.sandbox.stub(this.exitSignalListeners, 'remove')

    await this.launcher.run()
    await this.launcher.exit()

    assert.ok(exitSignalListenersRemoveStub.calledOnce)
  })
})
