import {BindingKey} from '@loopback/core'
import {Middleware} from '@loopback/rest'
import {Tenant} from './types'

export namespace MultiTenancyBindings {
  export const MIDDLEWARE = BindingKey.create<Middleware>(
    'multi-tenancy.middleware'
  )
  export const CURRENT_TENANT = BindingKey.create<Tenant | undefined>(
    'multi-tenancy.currentTenant'
  )
  export const STRATEGIES = 'multi-tenancy.strategies'
}
