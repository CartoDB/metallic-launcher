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

    this.emitter = new EventEmitter()
    const sigintListener = this.sigintListener = new SigintListener(this.emitter)

    this.launcher = new EventedLauncher({ sigintListener })
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  it(`should implement ${LauncherInterface.name}`, function () {
    assert.ok(this.launcher instanceof LauncherInterface)
  })

  it('.run() should attach listener', async function () {
    const sigintListenerListenSpy = this.sandbox.spy(this.sigintListener, 'listen')

    await this.launcher.run()

    assert.ok(sigintListenerListenSpy.calledOnce)
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
    const sigintListenerRemoveStub = this.sandbox.stub(this.sigintListener, 'remove')

    await this.launcher.run()
    await this.launcher.close()

    assert.ok(sigintListenerRemoveStub.calledOnce)
  })

  it('.exit() should remove listener', async function () {
    const sigintListenerRemoveStub = this.sandbox.stub(this.sigintListener, 'remove')

    await this.launcher.run()
    await this.launcher.exit()

    assert.ok(sigintListenerRemoveStub.calledOnce)
  })
})
