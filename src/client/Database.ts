import 'reflect-metadata';

import { DataSource } from 'typeorm';
import { Logger } from '../utils/logger';

import sync from '../utils/sync';

import type { DatabaseConfiguration_t as Config } from '../types/interface/database';

export default class Database extends DataSource {
  public constructor(_config: object) {
    const config: Config = _config as any;

    super({
      type: config?.driver ?? 'postgres',
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      synchronize: config.synchronize,
      logging: config.logging,
      entities: sync('@types/database/*.ts'),
      subscribers: sync('@types/database/subscribers/*.ts'),
      migrations: sync('@types/database/migrations/*.ts'),
    })
  };

  public async initialize(): Promise<this> {
    await super.initialize().then(() => Logger('info', 'Database initialized')).catch((err: unknown) => Logger('error', err as string));

    return this;
  }
}

export { Database };