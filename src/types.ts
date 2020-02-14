export interface Attribute {
  id: string;
  type: string;
  label: string;
}

export interface AttributeObject {
  [key: string]: Attribute;
}

export interface Entity {
  attributes?: AttributeObject;
}

export interface Subject extends Entity {
  id: string;
  type: string;
}

export interface Resource extends Entity {
  id: string;
  type: string;
}

export interface Action extends Entity {
  id: string;
  type: string;
}

export interface Context extends Entity {
  attributes?: AttributeObject;
}

export interface AuthRequest {
  subject: Subject;
  resource: Resource;
  action: Action;
  context: Context;
}

export interface AuthResponse {
  success: boolean;
  message: string;
}

// Enrich a User (Subject)
// with its roles
export type EnrichedUser<U> = U & {
  roles: string[];
};

// Enrich a Product (Resource)
// with its owner
export type EnrichedProduct<P> = P & {
  owner: { id: string; associates: { id: string }[] };
};

export interface PolicyRoute {
  subject: Subject;
  resource: Resource;
  action: Action;
  handler: PolicyRouteHandler;
}

export type EnrichedObject<O> = O & { [key: string]: any };

export type Enricher<S> = (obj: S) => Promise<EnrichedObject<S>>;

export type Policy = (
  subject: EnrichedObject<Subject>,
  resource: EnrichedObject<Resource>,
  action: Action,
  context: any,
) => boolean;

export interface PolicyRouteHandler {
  enrich: {
    subject?: Enricher<Subject>;
    resource?: Enricher<Resource>;
  };
  policies: Policy[];
}

export interface PolicyRouter {
  /**
   * Registers a route into your router.
   *
   * @param subject Subject
   * @param action Action
   * @param resource Resource
   * @param handler Handler to call/evaluate
   */
  route(subject: Subject, action: Action, resource: Resource, handler: PolicyRouteHandler): void;

  /**
   * Resolves the handler for the given combination of subject, action, and resource.
   *
   * @param input {ResolvePolicyInput} Input to resolve a policy
   * @returns {PolicyRoute|null} Policy Route definition
   */
  resolve(input: ResolvePolicyInput): PolicyRoute | null;
}

export interface ResolvePolicyInput {
  subject: Subject;
  action: Action;
  resource: Resource;
}

export interface AuthToken {
  token: string;
}
