import assert from 'assert'
import sinon from 'sinon'
import EventEmitter from 'events'
import { LoggerInterface } from 'metallic-logger'
import { ListenerInterface } from 'metallic-listeners'
import UnhandledRejectionListener from '../../src/unhandled-rejection-listener'

class Logger extends LoggerInterface {}

describe('unhandled-rejection-listener', function () {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create()

    const emitter = this.emitter = new EventEmitter()
    const logger = this.logger = new Logger()
    this.unhandledRejectionListener = new UnhandledRejectionListener({ emitter, logger })
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  it(`should implement ${ListenerInterface.name}`, function () {
    assert.ok(this.unhandledRejectionListener instanceof ListenerInterface)
  })

  it('.listen() should attach listener to uncaughtException to emitter', function () {
    const handlerSpy = this.sandbox.spy()

    var error = new Error('wadus error')
    var rejectedPromise = Promise.reject(error)

    this.unhandledRejectionListener.listen(handlerSpy)
    this.emitter.emit('unhandledRejection', error, rejectedPromise)

    assert.ok(handlerSpy.withArgs(error, rejectedPromise).calledOnce)
  })
})
