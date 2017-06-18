import assert from 'assert'
import sinon from 'sinon'
import EventEmitter from 'events'
import Leader from '../../../../src/cluster/leader/leader'
import { LEADER } from '../../../../src/cluster/role'

class Cluster extends EventEmitter {
  fork () {}
}

describe('leader', function () {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create()

    this.cluster = new Cluster()
    this.serverPoolSize = 2

    this.leader = new Leader(this.cluster, this.serverPoolSize)
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  it('.role should be LEADER', function () {
    assert.equal(this.leader.role, LEADER)
  })

  it('.run() should create as many workers as CPUs there are in the machine', async function () {
    const clusterForkStub = this.sandbox.stub(this.cluster, 'fork').returns(undefined)

    await this.leader.run()

    assert.equal(clusterForkStub.callCount, this.serverPoolSize)
  })

  it('.close() should terminate the process', async function () {
    const processExitStub = this.sandbox.stub(process, 'exit')

    await this.leader.close()

    assert.ok(processExitStub.calledWithExactly(0))
  })

  it('.exit() should exit successfully', function () {
    const processExitStub = this.sandbox.stub(process, 'exit').returns(undefined)

    this.leader.exit()

    assert.ok(processExitStub.calledOnce)
  })

  it('.exit(0) should exit successfully', function () {
    const processExitStub = this.sandbox.stub(process, 'exit').returns(undefined)

    this.leader.exit(0)

    assert.ok(processExitStub.calledWithExactly(0))
  })

  it('.exit(1) should stop server and exit succesfully with error', function () {
    const processExitStub = this.sandbox.stub(process, 'exit').returns(undefined)

    this.leader.exit(1)

    assert.ok(processExitStub.calledWithExactly(1))
  })

  it('.refork() should create a new worker if the previous one crashed', function () {
    const clusterForkStub = this.sandbox.stub(this.cluster, 'fork').returns(undefined)
    var serverStub = {
      exitedAfterDisconnect: false,
      process: {
        pid: 1
      }
    }

    this.leader.refork(serverStub, 1)

    assert.ok(clusterForkStub.calledOnce)
  })

  it('.refork() should not create a new worker if the previous one made away with itself', function () {
    const clusterForkStub = this.sandbox.stub(this.cluster, 'fork').returns(undefined)
    var serverStub = {
      exitedAfterDisconnect: true,
      process: {
        pid: 1
      }
    }

    this.leader.refork(serverStub, 1)

    assert.ok(!clusterForkStub.calledOnce)
  })

  it('.refork() should not create a new worker if the previous one exited', function () {
    const clusterForkStub = this.sandbox.stub(this.cluster, 'fork').returns(undefined)
    var serverStub = {
      exitedAfterDisconnect: true,
      process: {
        pid: 1
      }
    }

    this.leader.refork(serverStub, 0)

    assert.ok(!clusterForkStub.calledOnce)
  })

  it('.reboot() should restart all workers', async function () {
    this.cluster.workers = {
      '1': {},
      '2': {}
    }

    const leaderRebootServerStub = this.sandbox.stub(this.leader, 'rebootServer').returns(Promise.resolve())

    await this.leader.reboot()
    assert.ok(!leaderRebootServerStub.calledOnce)
  })

  it('.rebootServer() should restart one worker', async function () {
    const newServerFake = new EventEmitter()
    const clusterForkStub = this.sandbox.stub(this.cluster, 'fork').returns(newServerFake)

    var serverFake = new EventEmitter()
    serverFake.exitedAfterDisconnect = true
    serverFake.disconnect = function () {
      process.nextTick(function () {
        serverFake.emit('exit')
        newServerFake.emit('listening')
      })
    }
    this.cluster.workers = {
      '1': serverFake
    }

    await this.leader.rebootServer('1')
    assert.ok(clusterForkStub.calledOnce)
  })

  it('.rebootServer() should fail due to worker did not fork successfully', async function () {
    const newServerFake = new EventEmitter()
    const clusterForkStub = this.sandbox.stub(this.cluster, 'fork').returns(newServerFake)

    var serverFake = new EventEmitter()
    serverFake.exitedAfterDisconnect = true
    serverFake.disconnect = function () {
      process.nextTick(function () {
        serverFake.emit('exit')
        newServerFake.emit('error', new Error('wadus error'))
      })
    }
    this.cluster.workers = {
      '1': serverFake
    }

    try {
      await this.leader.rebootServer('1')
    } catch (err) {
      assert.ok(clusterForkStub.calledOnce)
      assert.equal(err.message, 'wadus error')
    }
  })

  it('.rebootServer() should fail due to worker did not make away with itself', async function () {
    var serverFake = new EventEmitter()
    serverFake.exitedAfterDisconnect = false
    serverFake.disconnect = function () {
      process.nextTick(function () {
        serverFake.emit('exit')
      })
    }
    this.cluster.workers = {
      '1': serverFake
    }

    try {
      await this.leader.rebootServer('1')
    } catch (err) {
      // assert.ok(clusterForkStub.calledOnce)
      assert.equal(err.message, 'Server exited accidentaly')
    }
  })

  it('.rotateLog() should rotate logs for all server', async function () {
    this.cluster.workers = {
      '1': {},
      '2': {}
    }

    const leaderRotateLogStub = this.sandbox.stub(this.leader, 'sendSignalToRotateLog').returns(Promise.resolve())

    await this.leader.rotateLog()

    assert.ok(leaderRotateLogStub.calledTwice)
  })

  it('.sendSignalToRotateLog(server) should send signal to rotate log', async function () {
    const server = {
      send: function (command, callback) {
        callback()
      }
    }
    const serverSendSpy = this.sandbox.spy(server, 'send')

    await this.leader.sendSignalToRotateLog(server)

    assert.ok(serverSendSpy.calledOnce)
    assert.ok(serverSendSpy.calledWith('logger:reopen-file-streams'))
  })

  it('.sendSignalToRotateLog(server) should fail while sending signal to rotate log', async function () {
    const error = new Error('wadus')
    const server = {
      send: function (command, callback) {
        callback(error)
      }
    }
    const serverSendSpy = this.sandbox.spy(server, 'send')

    try {
      await this.leader.sendSignalToRotateLog(server)
    } catch (err) {
      assert.ok(serverSendSpy.calledOnce)
      assert.ok(serverSendSpy.calledWith('logger:reopen-file-streams'))
    }
  })
})
