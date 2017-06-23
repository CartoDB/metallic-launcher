import assert from 'assert'
import sinon from 'sinon'
import EventEmitter from 'events'
import ServerExitListener from '../../../../src/cluster/leader/server-exit-listener'

describe('server-exit-listener', function () {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create()

    const emitter = this.emitter = new EventEmitter()
    this.serverExitListener = new ServerExitListener({ emitter })
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  it('.listen() should attach listener to cluster event', function () {
    var listenerSpy = this.sandbox.spy()

    this.serverExitListener.listen(listenerSpy)
    this.emitter.emit('exit', 1, 1)

    assert.ok(listenerSpy.calledOnce)
    assert.ok(listenerSpy.calledWithExactly(1, 1))
  })
})
