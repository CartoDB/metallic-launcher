import assert from 'assert'
import sinon from 'sinon'
import { RunnerInterface } from 'metallic-interfaces'
import Server from '../../../../src/cluster/server/server'
import { SERVER } from '../../../../src/cluster/role'

class HttpServer extends RunnerInterface {}

describe('worker', function () {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create()

    const httpServer = this.httpServer = new HttpServer()
    this.server = new Server({ httpServer })
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  it('should be a runner instance', function () {
    assert.ok(this.server instanceof RunnerInterface)
  })

  it('.role should be SERVER', function () {
    assert.equal(this.server.role, SERVER)
  })

  it('.run() should run server successfully', async function () {
    const httpServerRunStub = this.sandbox.stub(this.httpServer, 'run').returns(Promise.resolve())

    await this.server.run()

    assert.ok(httpServerRunStub.calledOnce)
  })

  it('.run() should exit with error when server fails on running', async function () {
    const serverExitStub = this.sandbox.stub(this.server, 'exit')
    const error = new Error('wadus')
    const httpServerRunStub = this.sandbox.stub(this.httpServer, 'run').returns(Promise.reject(error))

    try {
      await this.server.run()
    } catch (err) {
      assert.equal(err, error)
      assert.ok(!serverExitStub.called)
      assert.ok(httpServerRunStub.calledOnce)
    }
  })

  it('.close() should terminate the process', async function () {
    const httpServerCloseStub = this.sandbox.stub(this.httpServer, 'close').returns(Promise.resolve())

    await this.server.close()

    assert.ok(httpServerCloseStub.calledOnce)
  })

  it('.exit() should stop server and exit successfully', async function () {
    const httpServerRunStub = this.sandbox.stub(this.httpServer, 'close').returns(Promise.resolve())
    const processExitStub = this.sandbox.stub(process, 'exit')

    await this.server.exit()

    assert.ok(processExitStub.calledWithExactly(0))
    assert.ok(httpServerRunStub.calledOnce)
  })

  it('.exit(1) should stop server and exit succesfully with error', async function () {
    const httpServerCloseStub = this.sandbox.stub(this.httpServer, 'close').returns(Promise.resolve())
    const processExitStub = this.sandbox.stub(process, 'exit')

    await this.server.exit(1)

    assert.ok(processExitStub.calledWithExactly(1))
    assert.ok(httpServerCloseStub.calledOnce)
  })

  it('.exit() should throw error when server fails while closing', async function () {
    const error = new Error('wadus')
    const httpServerCloseStub = this.sandbox.stub(this.httpServer, 'close').returns(Promise.reject(error))
    const processExitStub = this.sandbox.stub(process, 'exit')

    try {
      await this.server.exit()
    } catch (err) {
      assert.equal(err, error)
      assert.ok(httpServerCloseStub.calledOnce)
      assert.ok(!processExitStub.called)
    }
  })
})
