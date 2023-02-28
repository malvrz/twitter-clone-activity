import {ValueOrPromise} from '@loopback/core'
import {RequestContext} from '@loopback/rest'

export interface Tenant {
  id: string,
  [attribute: string]: unknown
}

export interface MultiTenancyStrategy {
  name: string
  identifyTenant(
    requestContext: RequestContext
  ): Tenant | undefined
  bindResources(
    requestContext: RequestContext,
    tenant: Tenant | undefined
  ): ValueOrPromise<void>
}
