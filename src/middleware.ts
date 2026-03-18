import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const forwardedHost = context.request.headers.get('x-forwarded-host');
  const forwardedProto = context.request.headers.get('x-forwarded-proto') || 'https';

  if (forwardedHost) {
    const url = new URL(context.request.url);
    url.hostname = forwardedHost;
    url.protocol = forwardedProto;
    url.port = '';

    const init: RequestInit = {
      method: context.request.method,
      headers: context.request.headers,
    };

    if (context.request.method !== 'GET' && context.request.method !== 'HEAD') {
      init.body = context.request.body;
      // @ts-ignore duplex required by Node for streams
      init.duplex = 'half';
    }

    context.request = new Request(url.toString(), init);
  }

  return next();
});
