import assert from 'assert'
import sinon from 'sinon'
import EventEmitter from 'events'
import LauncherInterface from '../../src/launcher-interface'
import DummyLauncher from '../support/dummy-launcher'
import LauncherUncaughtExceptionListenerMixin from '../../src/launcher-uncaught-exception-listener-mixin'
import UncaughtExceptionListener from '../../src/uncaught-exception-listener'

describe('launcher-uncaught-exception-listener-mixin', function () {
  beforeEach(function () {
    const EventedLauncher = LauncherUncaughtExceptionListenerMixin.mix(DummyLauncher)

    this.sandbox = sinon.sandbox.create()

    this.emitter = new EventEmitter()
    this.listener = new UncaughtExceptionListener(this.emitter)

    this.launcher = new EventedLauncher(this.listener)
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  it(`should implement ${LauncherInterface.name}`, function () {
    assert.ok(this.launcher instanceof LauncherInterface)
  })

  it('.run() should attach listener', async function () {
    const listernerListenSpy = this.sandbox.spy(this.listener, 'listen')

    await this.launcher.run()

    assert.ok(listernerListenSpy.calledOnce)
  })

  it('should exit when uncaughtException has been emitted', async function () {
    const error = new Error('wadus')
    const launcherExitSpy = this.sandbox.spy(this.launcher, 'exit')

    await this.launcher.run()
    this.emitter.emit('uncaughtException', error)
    await new Promise(resolve => resolve())

    assert.ok(launcherExitSpy.calledOnce)
  })

  it('.close() should remove listener', async function () {
    const listenerRemoveStub = this.sandbox.stub(this.listener, 'remove')

    await this.launcher.run()
    await this.launcher.close()

    assert.ok(listenerRemoveStub.calledOnce)
  })

  it('.exit() should remove listener', async function () {
    const listenerRemoveStub = this.sandbox.stub(this.listener, 'remove')

    await this.launcher.run()
    await this.launcher.exit()

    assert.ok(listenerRemoveStub.calledOnce)
  })
})
