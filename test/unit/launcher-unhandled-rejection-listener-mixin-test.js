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
  constructor ({ logger }) {
    super()
    this.logger = logger
  }
}

describe('launcher-unhandled-rejection-listener-mixin', function () {
  beforeEach(function () {
    const EventedLauncher = LauncherUnhandledRejectionListenerMixin.mix(Launcher)

    this.sandbox = sinon.sandbox.create()

    this.emitter = new EventEmitter()
    const unhandledRejectionListener = this.unhandledRejectionListener = new UnhandledRejectionListener(this.emitter)
    const logger = this.logger = new Logger()

    this.launcher = new EventedLauncher({ unhandledRejectionListener, logger })
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  it(`should implement ${LauncherInterface.name}`, function () {
    assert.ok(this.launcher instanceof LauncherInterface)
  })

  it('.run() should attach listener', async function () {
    const unhandledRejectionListenerListenSpy = this.sandbox.spy(this.unhandledRejectionListener, 'listen')

    await this.launcher.run()

    assert.ok(unhandledRejectionListenerListenSpy.calledOnce)
  })

  it('.run() should exit the process when "unhandledRejection" has been emitted', async function () {
    const EventedLauncher = LauncherUnhandledRejectionListenerMixin.mix(Launcher)

    const launcher = new EventedLauncher({ unhandledRejectionListener: this.unhandledRejectionListener })
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
    const unhandledRejectionListenerRemoveStub = this.sandbox.stub(this.unhandledRejectionListener, 'remove')

    await this.launcher.run()
    await this.launcher.close()

    assert.ok(unhandledRejectionListenerRemoveStub.calledOnce)
  })

  it('.exit() should remove listener', async function () {
    const unhandledRejectionListenerRemoveStub = this.sandbox.stub(this.unhandledRejectionListener, 'remove')

    await this.launcher.run()
    await this.launcher.exit()

    assert.ok(unhandledRejectionListenerRemoveStub.calledOnce)
  })
})
