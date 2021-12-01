import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'sitedb',
  connector: 'postgresql',
  url: `${process.env.POSTGRES_URL}`,
  host: `${process.env.POSTGRES_HOST}`,
  port: 5432,
  user: `${process.env.POSTGRES_USERNAME}`,
  password: `${process.env.POSTGRES_PASSWORD}`,
  database: `${process.env.POSTGRES_DATABASE}`
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class SitedbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'sitedb';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.sitedb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
