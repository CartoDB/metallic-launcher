import LauncherInterface from '../../src/launcher-interface'

export default class DummyLauncher extends LauncherInterface {
  async run () {}
  async close () {}
  async exit () {}
}
