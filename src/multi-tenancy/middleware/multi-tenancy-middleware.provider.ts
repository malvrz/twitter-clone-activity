import {ContextTags, extensionPoint, extensions, Getter, Provider, ValueOrPromise} from '@loopback/core';
import {asMiddleware, Middleware, RequestContext} from '@loopback/rest';
import {MultiTenancyBindings} from '../keys';
import {MultiTenancyStrategy} from '../types';

@extensionPoint(
  MultiTenancyBindings.STRATEGIES,
  {
    tags: {
      [ContextTags.KEY]: MultiTenancyBindings.MIDDLEWARE,
    },
  },
  asMiddleware({
    group: 'tenancy',
    downstreamGroups: 'findRoute',
  }),
)
export class MultiTenancyMiddlewareProvider implements Provider<Middleware> {

  constructor(
    @extensions()
    private readonly getMultiTenancyStrategies: Getter<MultiTenancyStrategy[]>
  ) { }

  value(): ValueOrPromise<Middleware> {
    return async (ctx, next) => {
      await this.action(ctx as RequestContext)
      return next()
    }
  }

  async action(requestContext: RequestContext) {
    const tenancy = await this.identifyTenancy(requestContext)
    if (tenancy?.tenant == null) {return }
    requestContext.bind(MultiTenancyBindings.CURRENT_TENANT).to(tenancy.tenant)
    await tenancy.strategy.bindResources(requestContext, tenancy.tenant)
    return tenancy.tenant
  }

  private async identifyTenancy(requestContext: RequestContext) {
    let strategies = await this.getMultiTenancyStrategies()
    for (const strategy of strategies) {
      const tenant = strategy.identifyTenant(requestContext)
      if (tenant !== null) {
        return {tenant, strategy}
      }
    }
    return undefined
  }
}
