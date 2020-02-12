import {
  Action,
  PolicyRoute,
  PolicyRouteHandler,
  PolicyRouter,
  ResolvePolicyInput,
  Resource,
  Subject,
} from '../types';

/**
 * The SlugPolicyRouter stores routes in a key-value map.
 *
 * The key is generated like this:
 * `${subject.type}_${resource.type}_${action.type}`
 */
export class SlugPolicyRouter implements PolicyRouter {
  constructor(
    private routes: {
      [key: string]: PolicyRoute;
    } = {},
  ) {}

  public route(subject: Subject, action: Action, resource: Resource, handler: PolicyRouteHandler) {
    const key = `${subject.type}_${resource.type}_${action.type}`;
    this.routes[key] = {
      subject,
      resource,
      action,
      handler,
    };
  }

  public resolve({ subject, action, resource }: ResolvePolicyInput): PolicyRoute | null {
    const key = this.getKey(subject.type, action.type, resource.type);

    // Resolve policy mapping
    return this.routes[key] || null;
  }

  private getKey(subject: string, action: string, resource: string): string {
    return `${subject}_${resource}_${action}`;
  }
}
