import assert from 'assert'
import Role, { LEADER, SERVER } from '../../../src/cluster/role'

describe('role', function () {
  it('should fail when creates an instance of Role', function () {
    assert.throws(() => new Role())
  })

  it('.isLeader(!clusterOn) should return false', function () {
    const clusterOn = false
    const isLeader = Role.isLeader(clusterOn)

    assert.equal(isLeader, false)
  })

  it('Role.get() should return SERVER', function () {
    const clusterOff = false
    assert.equal(Role.get(clusterOff), SERVER)
  })

  it('Role.get() should return LEADER', function () {
    const clusterOn = true
    assert.equal(Role.get(clusterOn), LEADER)
  })

  it('Role.getName() should return \'server\'', function () {
    const clusterOff = false
    assert.equal(Role.getName(clusterOff), 'server')
  })

  it('Role.getName() should return \'leader\'', function () {
    const clusterOn = true
    assert.equal(Role.getName(clusterOn), 'leader')
  })

  it('create Role directly with "new" should throw error', function () {
    assert.throws(() => new Role(), 'Role cannot be directly constructed')
  })

  it('.isLeader(clusterOn) should return true', function () {
    const clusterOn = true
    const isLeader = Role.isLeader(clusterOn)

    assert.equal(isLeader, true)
  })

  it('.isServer(!clusterOn) should return true', function () {
    const clusterOn = false
    const isServer = Role.isServer(clusterOn)

    assert.equal(isServer, true)
  })

  it('.isServer(clusterOn) should return false', function () {
    const clusterOn = true
    const isServer = Role.isServer(clusterOn)

    assert.equal(isServer, false)
  })
})
