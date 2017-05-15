import assert from 'assert'
import sinon from 'sinon'
import LauncherInterface from '../../src/launcher-interface'
import DummyLauncher from '../support/dummy-launcher'
import LauncherExitOnErrorMixin from '../../src/launcher-exit-on-error-mixin'

class FaultyLauncher extends DummyLauncher {
  run () {
    throw new Error('Ooops')
  }
}

describe('launcher-exit-on-error-mixin', function () {
  beforeEach(function () {
    const ExitOnErrorLauncher = LauncherExitOnErrorMixin.mix(FaultyLauncher)

    this.sandbox = sinon.sandbox.create()

    this.launcher = new ExitOnErrorLauncher()
  })

  afterEach(function () {
    this.sandbox.restore()
  })

  it(`should implement ${LauncherInterface.name}`, function () {
    assert.ok(this.launcher instanceof LauncherInterface)
  })

  it('.run() should attach listener', async function () {
    const launcherExitSpy = this.sandbox.spy(this.launcher, 'exit')

    await this.launcher.run()

    assert.ok(launcherExitSpy.calledWithExactly(1))
  })
})
