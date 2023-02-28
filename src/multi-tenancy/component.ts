import {Binding, Component, createBindingFromClass, extensionFor} from '@loopback/core';
import {MultiTenancyBindings} from './keys';
import {MultiTenancyMiddlewareProvider} from './middleware/multi-tenancy-middleware.provider';
import {HeaderStrategy} from './strategies/header-strategy';

export class MultiTenancyComponent implements Component {
  bindings?: Binding<any>[] | undefined = [
    createBindingFromClass(MultiTenancyMiddlewareProvider, {
      key: MultiTenancyBindings.MIDDLEWARE
    }),
    createBindingFromClass(HeaderStrategy).apply(
      extensionFor(MultiTenancyBindings.STRATEGIES)
    )

  ]
}
