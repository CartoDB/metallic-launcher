import assert from 'assert'
import sinon from 'sinon'
import ClusterInterface from '../../src/cluster/cluster-interface'
import LauncherInterface from '../../src/launcher-interface'
import Launcher from '../../src/launcher'

class Target extends ClusterInterface {
  get app () {
    return 'app'
  }
  get role () {
    return 'role'
  }
}

describe('launcher', function () {
  beforeEach(function () {
    this.sandbox = sinon.sandbox.create()

    this.target = new Target()

    this.launcher = new Launcher(this.target)
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  it(`should implement a ${LauncherInterface.name}`, function () {
    assert.ok(this.launcher instanceof LauncherInterface)
  })

  it('.app should get target\'s app', function () {
    assert.equal(this.launcher.app, 'app')
  })

  it('.role should get target\'s role', function () {
    assert.equal(this.launcher.role, 'role')
  })

  it('.run() should init successfully', async function () {
    const targetRunStub = this.sandbox.stub(this.target, 'run').returns(Promise.resolve())

    await this.launcher.run()

    assert.ok(targetRunStub.calledOnce)
  })

  it('.run() should throw error', async function () {
    const error = new Error('wadus')
    const targetRunStub = this.sandbox.stub(this.target, 'run').returns(Promise.reject(error))

    try {
      await this.launcher.run()
    } catch (err) {
      assert.ok(targetRunStub.calledOnce)
      assert.equal(err, error)
    }
  })

  it('.close() should stop successfully', async function () {
    const targetRunStub = this.sandbox.stub(this.target, 'close').returns(Promise.resolve())

    await this.launcher.close()

    assert.ok(targetRunStub.calledOnce)
  })

  it('.close() should throw error', async function () {
    const error = new Error('wadus')
    const targetCloseStub = this.sandbox.stub(this.target, 'close').returns(Promise.reject(error))

    try {
      await this.launcher.close()
    } catch (err) {
      assert.ok(targetCloseStub.calledOnce)
      assert.equal(err, error)
    }
  })

  it('.exit() should exit successfully', async function () {
    const targetExitStub = this.sandbox.stub(this.target, 'exit').returns(Promise.resolve())

    await this.launcher.exit()

    assert.ok(targetExitStub.calledWithExactly(undefined))
  })

  it('.exit() should throw error', async function () {
    const error = new Error('wadus')
    const targetExitStub = this.sandbox.stub(this.target, 'exit').returns(Promise.reject(error))

    try {
      await this.launcher.exit()
    } catch (err) {
      assert.ok(targetExitStub.calledWithExactly(undefined))
      assert.equal(err, error)
    }
  })

  it('.exit(1) should exit with code 1', async function () {
    const targetExitStub = this.sandbox.stub(this.target, 'exit').returns(Promise.resolve())

    await this.launcher.exit(1)

    assert.ok(targetExitStub.calledWithExactly(1))
  })

  it('.exit(1) should throw error', async function () {
    const error = new Error('wadus')
    const targetExitStub = this.sandbox.stub(this.target, 'exit').returns(Promise.reject(error))

    try {
      await this.launcher.exit(1)
    } catch (err) {
      assert.ok(targetExitStub.calledWithExactly(1))
      assert.equal(err, error)
    }
  })
})
