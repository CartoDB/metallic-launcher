import assert from 'assert'
import sinon from 'sinon'
import EventEmitter from 'events'
import SighupListener from '../../../../src/cluster/leader/sighup-listener'

describe('sigterm-listener', function () {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create()

    this.emitter = new EventEmitter()
    this.sighupListener = new SighupListener(this.emitter)
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  it('.listen() should attach listener to SIGTERM process event', function () {
    const listenerStub = this.sandbox.stub().returns(Promise.resolve())

    this.sighupListener.listen(listenerStub)
    this.emitter.emit('SIGHUP')

    assert.ok(listenerStub.calledOnce)
  })
})
