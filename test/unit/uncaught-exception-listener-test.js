import assert from 'assert'
import sinon from 'sinon'
import EventEmitter from 'events'
import { ListenerInterface } from 'metallic-listeners'
import UncaughtExceptionListener from '../../src/uncaught-exception-listener'

describe('uncaught-exception-listener', function () {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create()

    this.emitter = new EventEmitter()
    this.uncaughtExceptionListener = new UncaughtExceptionListener(this.emitter)
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  it(`should implement ${ListenerInterface.name}`, function () {
    assert.ok(this.uncaughtExceptionListener instanceof ListenerInterface)
  })

  it('.listen() should attach listener to uncaughtException emitter', function () {
    const handlerSpy = this.sandbox.spy()
    const error = new Error('wadus error')

    this.uncaughtExceptionListener.listen(handlerSpy)
    this.emitter.emit('uncaughtException', error)

    assert.ok(handlerSpy.withArgs(error).calledOnce)
  })
})
