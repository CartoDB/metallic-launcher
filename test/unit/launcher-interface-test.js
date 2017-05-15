import assert from 'assert'
import LauncherInterface from '../../src/launcher-interface'
import { AbstractClassError, UnimplementedError } from 'metallic-errors'

class Launcher extends LauncherInterface {}

describe('launcher-interface', function () {
  it('create interface directly with "new" should throw error', function () {
    assert.throws(() => new LauncherInterface(), AbstractClassError)
  })

  it('.close() should throw "Unimplemented method" error', async function () {
    const launcher = new Launcher()
    try {
      await launcher.close()
    } catch (err) {
      assert.ok(err instanceof UnimplementedError)
    }
  })
})
