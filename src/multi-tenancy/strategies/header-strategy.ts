import {RequestContext} from '@loopback/rest';
import {MultiTenancyStrategy, Tenant} from '../types';

export class HeaderStrategy implements MultiTenancyStrategy {
  name: 'header';
  identifyTenant(requestContext: RequestContext): Tenant | undefined {
    const tenantId = requestContext.request.headers['x-tenant-id'] as string;
    return tenantId == null ? undefined : {id: tenantId};
  }
  bindResources(requestContext: RequestContext, tenant: Tenant): void {
    requestContext
      .bind('datasources.db')
      .toAlias(`datasources.${tenant.id}`)

  }

}
