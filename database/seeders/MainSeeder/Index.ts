import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Application from '@ioc:Adonis/Core/Application'

export default class extends BaseSeeder {
  private async runSeeder(Seeder: { default: typeof BaseSeeder }) {
    if (Seeder.default.developmentOnly && !Application.inDev) {
      return
    }

    await new Seeder.default(this.client).run()
  }

  public async run () {
    await this.runSeeder(await import('../Substation'))
    await this.runSeeder(await import('../DefectType'))
    await this.runSeeder(await import('../Staff'))
    await this.runSeeder(await import('../Defect'))
    await this.runSeeder(await import('../IntermediateCheck'))
  }
}
