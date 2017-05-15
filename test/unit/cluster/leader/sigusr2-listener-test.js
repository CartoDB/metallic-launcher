import assert from 'assert'
import sinon from 'sinon'
import EventEmitter from 'events'
import Sigusr2Listener from '../../../../src/cluster/leader/sigusr2-listener'

describe('sigusr2-listener', function () {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create()

    this.emitter = new EventEmitter()
    this.sigusr2Listener = new Sigusr2Listener(this.emitter)
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  it('.listen() should attach listener to SIGUSR2 process event', function () {
    var listenerStub = this.sandbox.stub().returns(Promise.resolve())

    this.sigusr2Listener.listen(listenerStub)
    this.emitter.emit('SIGUSR2')

    assert.ok(listenerStub.calledOnce)
  })
})
