import { SlugPolicyRouter } from './routers/slug-policy-router';
import { AuthRequest, AuthResponse, Policy, PolicyRouteHandler, PolicyRouter } from './types';

export class Lucifer {
  constructor(private policyRouter: PolicyRouter = new SlugPolicyRouter()) {
    //
  }

  public async authorize(request: AuthRequest): Promise<AuthResponse> {
    const { subject, action, resource, context } = request;

    const resolvedPolicy = this.policyRouter.resolve({
      subject,
      action,
      resource,
    });

    if (!resolvedPolicy) {
      throw new Error('Policy not registered.');
    }

    const { handler } = resolvedPolicy;

    // Enrich the subject
    const enrichedSubject = handler.enrich?.subject
      ? await handler.enrich.subject(subject)
      : subject;

    // Enrich the resource
    const enrichedResource = handler.enrich?.resource
      ? await handler.enrich.resource(resource)
      : resource;

    // Atleast one policy should return true
    const result = handler.policies.some((policy: Policy) => {
      return policy(enrichedSubject, enrichedResource, action, context);
    });

    if (result) {
      return {
        success: true,
        message: 'Authorized',
      };
    }

    return {
      success: false,
      message: 'UnAuthorized',
    };
  }

  public router(): PolicyRouter {
    return this.policyRouter;
  }
}
