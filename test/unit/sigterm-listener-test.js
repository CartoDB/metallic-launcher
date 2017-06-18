import assert from 'assert'
import sinon from 'sinon'
import EventEmitter from 'events'
import { ListenerInterface } from 'metallic-listeners'
import SigtermListener from '../../src/sigterm-listener'

describe('sigterm-listener', function () {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create()

    const emitter = this.emitter = new EventEmitter()
    this.sigtermListener = new SigtermListener({ emitter })
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  it(`should implement ${ListenerInterface.name}`, function () {
    assert.ok(this.sigtermListener instanceof ListenerInterface)
  })

  it('.listen() should attach listener to SIGTERM emitter', function () {
    const handlerSpy = this.sandbox.spy()

    this.sigtermListener.listen(handlerSpy)
    this.emitter.emit('SIGTERM')

    assert.ok(handlerSpy.calledOnce)
  })
})
