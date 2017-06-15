import assert from 'assert'
import sinon from 'sinon'
import EventEmitter from 'events'
import { ListenerInterface, ListenerAbstract } from 'metallic-listeners'
import { LoggerInterface } from 'metallic-logger'
import ListenerLoggerMixin from '../../src/listener-logger-mixin'

class Listener extends ListenerAbstract {
  constructor ({ emitter }) {
    super(emitter, 'wadus')
  }
}
class Logger extends LoggerInterface {}

describe('listener-logger-mixin', function () {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create()

    const logger = this.logger = new Logger()
    const emitter = this.emitter = new EventEmitter()

    const LoggedListener = ListenerLoggerMixin.mix(Listener)

    this.loggedListener = new LoggedListener({ logger, emitter })
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  it(`should implement a ${ListenerInterface.name}`, function () {
    assert.ok(this.loggedListener instanceof ListenerInterface)
  })

  it('.listen() should attach listener to emitter', function () {
    const loggerDebugStub = this.sandbox.stub(this.logger, 'debug')
    const handlerSpy = this.sandbox.spy()

    this.loggedListener.listen(handlerSpy)

    assert.ok(loggerDebugStub.calledOnce)
  })

  it('should log whenever a event is emitted', function () {
    const loggerDebugStub = this.sandbox.stub(this.logger, 'debug')
    const handlerSpy = this.sandbox.spy()

    this.loggedListener.listen(handlerSpy)

    this.emitter.emit('wadus')
    this.emitter.emit('wadus')

    assert.ok(loggerDebugStub.calledThrice)
  })
})
