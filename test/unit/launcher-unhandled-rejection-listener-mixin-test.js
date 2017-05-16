import assert from 'assert'
import sinon from 'sinon'
import EventEmitter from 'events'
import { LoggerInterface } from 'metallic-logger'
import LauncherInterface from '../../src/launcher-interface'
import DummyLauncher from '../support/dummy-launcher'
import LauncherUnhandledRejectionListenerMixin from '../../src/launcher-unhandled-rejection-listener-mixin'
import UnhandledRejectionListener from '../../src/unhandled-rejection-listener'

class Logger extends LoggerInterface {}

class Launcher extends DummyLauncher {
  constructor (logger) {
    super()
    this.logger = logger
  }
}

describe('launcher-unhandled-rejection-listener-mixin', function () {
  beforeEach(function () {
    const EventedLauncher = LauncherUnhandledRejectionListenerMixin.mix(Launcher)

    this.sandbox = sinon.sandbox.create()

    this.emitter = new EventEmitter()
    this.listener = new UnhandledRejectionListener(this.emitter)
    this.logger = new Logger()

    this.launcher = new EventedLauncher(this.listener, this.logger)
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

  it('.run() should exit the process when "unhandledRejection" has been emitted', async function () {
    const EventedLauncher = LauncherUnhandledRejectionListenerMixin.mix(Launcher)

    const launcher = new EventedLauncher(this.listener)
    const launcherExitStub = this.sandbox.stub(launcher, 'exit')

    const error = new Error('wadus')
    const rejectedPromise = new Promise((resolve, reject) => reject(error))

    await launcher.run()
    this.emitter.emit('unhandledRejection', error, rejectedPromise)
    await new Promise(resolve => resolve())

    assert.ok(launcherExitStub.calledWithExactly(1))
  })

  it('.run() should log the error when "unhandledRejection" has been emitted', async function () {
    const loggerErrorStub = this.sandbox.stub(this.logger, 'error')
    const error = new Error('wadus')
    const rejectedPromise = new Promise((resolve, reject) => reject(error))

    await this.launcher.run()
    this.emitter.emit('unhandledRejection', error, rejectedPromise)
    await new Promise(resolve => resolve())

    assert.ok(loggerErrorStub.calledOnce)
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
