import assert from 'assert'
import LeaderInterface from '../../../../src/cluster/leader/leader-interface'
import { AbstractClassError, UnimplementedError } from 'metallic-errors'

class Leader extends LeaderInterface {}

describe('leader-interface', function () {
  it('create interface directly with "new" should throw error', function () {
    assert.throws(() => new LeaderInterface(), AbstractClassError)
  })

  it('.refork() should throw "Unimplemented method" error', function () {
    const leader = new Leader()
    try {
      leader.refork()
    } catch (err) {
      assert.ok(err instanceof UnimplementedError)
    }
  })

  it('.reboot() should throw "Unimplemented method" error', async function () {
    const leader = new Leader()
    try {
      await leader.reboot()
    } catch (err) {
      assert.ok(err instanceof UnimplementedError)
    }
  })

  it('.rotateLog() should throw "Unimplemented method" error', async function () {
    const leader = new Leader()
    try {
      await leader.rotateLog()
    } catch (err) {
      assert.ok(err instanceof UnimplementedError)
    }
  })
})
