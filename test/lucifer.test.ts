import { Lucifer } from '../src/lucifer';
import { SlugPolicyRouter } from '../src/routers/slug-policy-router';
import { AuthRequest, EnrichedObject, PolicyRouteHandler, Resource, Subject } from '../src/types';

/**
 * Dummy test
 */
describe('Lucifer', () => {
  it('is instantiable', () => {
    expect(new Lucifer()).toBeInstanceOf(Lucifer);
  });

  it('throws error if policy is not registered', async () => {
    const lucifer = new Lucifer();
    const request: AuthRequest = {
      subject: {
        id: '1',
        type: 'user',
      },
      action: {
        id: 'delete-photo',
        type: 'delete',
      },
      resource: {
        id: '1',
        type: 'photo',
      },
      context: {
        attributes: {
          albumId: {
            id: '2',
            type: 'album',
            label: 'Album ID',
          },
        },
      },
    };
    await expect(lucifer.authorize(request)).rejects.toThrow();
  });

  it('can authorize a request', async () => {
    const lucifer = new Lucifer();
    const request: AuthRequest = {
      subject: {
        id: '1',
        type: 'user',
      },
      action: {
        id: 'delete-photo',
        type: 'delete',
      },
      resource: {
        id: '1',
        type: 'photo',
      },
      context: {
        attributes: {
          albumId: {
            id: '2',
            type: 'album',
            label: 'Album ID',
          },
        },
      },
    };

    const handler: PolicyRouteHandler = {
      policies: [
        (subject, resource, action, context) => {
          return true;
        },
      ],
    };

    lucifer.router().route(request.subject, request.action, request.resource, handler);

    expect(await (await lucifer.authorize(request)).success).toBeTruthy();
  });

  it('can enrich a request', async () => {
    const lucifer = new Lucifer();
    const request: AuthRequest = {
      subject: {
        id: '1',
        type: 'user',
      },
      action: {
        id: 'delete-photo',
        type: 'delete',
      },
      resource: {
        id: '1',
        type: 'photo',
      },
      context: {
        attributes: {
          albumId: {
            id: '2',
            type: 'album',
            label: 'Album ID',
          },
        },
      },
    };

    const handler: PolicyRouteHandler = {
      enrich: {
        subject: async (subject: Subject) => ({ ...subject, enriched: true }),
        resource: async (resource: Resource) => ({ ...resource, enriched: true }),
      },
      policies: [
        (subject: EnrichedObject<Subject>, resource: EnrichedObject<Resource>, action, context) => {
          return subject.enriched && resource.enriched;
        },
      ],
    };

    lucifer.router().route(request.subject, request.action, request.resource, handler);

    expect(await (await lucifer.authorize(request)).success).toBeTruthy();
  });

  it('can unauthorize a request', async () => {
    const lucifer = new Lucifer();
    const request: AuthRequest = {
      subject: {
        id: '1',
        type: 'user',
      },
      action: {
        id: 'delete-photo',
        type: 'delete',
      },
      resource: {
        id: '1',
        type: 'photo',
      },
      context: {
        attributes: {
          albumId: {
            id: '2',
            type: 'album',
            label: 'Album ID',
          },
        },
      },
    };

    const handler: PolicyRouteHandler = {
      policies: [
        (subject, resource, action, context) => {
          return false;
        },
      ],
    };

    lucifer.router().route(request.subject, request.action, request.resource, handler);

    expect(await (await lucifer.authorize(request)).success).toBeFalsy();
  });

  it('can use an injected provider', async () => {
    const lucifer = new Lucifer(new SlugPolicyRouter({}));
    const request: AuthRequest = {
      subject: {
        id: '1',
        type: 'user',
      },
      action: {
        id: 'delete-photo',
        type: 'delete',
      },
      resource: {
        id: '1',
        type: 'photo',
      },
      context: {
        attributes: {
          albumId: {
            id: '2',
            type: 'album',
            label: 'Album ID',
          },
        },
      },
    };

    const handler: PolicyRouteHandler = {
      policies: [
        (subject, resource, action, context) => {
          return true;
        },
      ],
    };

    lucifer.router().route(request.subject, request.action, request.resource, handler);

    expect(await (await lucifer.authorize(request)).success).toBeTruthy();
  });
});
