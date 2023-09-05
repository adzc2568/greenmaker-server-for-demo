import { ExecutionContext } from '@nestjs/common';

const cachedRoutes = new Map();

export const trackBy = function (
  context: ExecutionContext,
  baseUrl: string | string[],
): string | undefined {
  const request = context.switchToHttp().getRequest();

  if (!request) {
    return undefined;
  }

  const isGetRequest = request.method === 'GET';

  if (isGetRequest) {
    const key = request.url.split('?')[0];
    if (cachedRoutes.has(key)) {
      if (!cachedRoutes.get(key).includes(request.url)) {
        cachedRoutes.set(key, [...cachedRoutes.get(key), request.url]);
      }
      return request.url;
    }
    cachedRoutes.set(key, [request.url]);
    return request.url;
  } else {
    const key = baseUrl;
    const keyIsArray = Array.isArray(key);

    const cacheManagerDel = async function (key) {
      for (const value of cachedRoutes.get(key)) {
        await this.cacheManager.del(value);
      }
    };

    const checkRoutes = function (key) {
      if (cachedRoutes.has(key)) {
        cacheManagerDel(key);
      }

      const params = Object.values(request.params);

      params.forEach((param) => {
        if (cachedRoutes.has(key + '/' + param)) {
          cacheManagerDel(key);
        }
      });

      if (cachedRoutes.has(key + '/' + request.body._id)) {
        cacheManagerDel(key);
      }
    };

    if (keyIsArray) {
      key.forEach((key) => checkRoutes(key));
    } else {
      checkRoutes(key);
    }

    return undefined;
  }
};
