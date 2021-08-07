import { pathToRe } from './pathToRe';
import { navigate, resolve } from './router';
import { RouterCtx } from './types';

export const cachedMatches: Record<string, RouterCtx<any> | null> = {};

export function doMatch<P extends any>(
  path: string,
  currentUri: string,
  parent?: RouterCtx<P>,
): RouterCtx<P> | null {
  const [re, props, basePath] = pathToRe(path);

  const uriMatch = re.exec(currentUri);
  if (!uriMatch) return null;

  const uri = uriMatch.shift()!;
  const pathname = uriMatch.shift() || '/';

  return {
    basePath,
    uri, // matched uri
    pathname,
    parent,
    params: props.reduce((acc, p) => Object.assign(acc, { [p]: uriMatch.shift() }), {}) as P,
    resolve: to => resolve(to, pathname),
    navigate: (to, replace, state, noInterception) =>
      navigate(resolve(to, pathname), replace, state, noInterception),
    goBack: () =>
      history.state && history.state._prev === parent!.pathname
        ? history.back()
        : navigate(parent!.pathname, true),
  };
}

export function matcher<P extends any>(
  path: string,
  uri: string,
  parent?: RouterCtx<P>,
): RouterCtx<P> | null {
  const key = `${path}__${uri}`;
  return key in cachedMatches
    ? cachedMatches[key]
    : (cachedMatches[key] = doMatch<P>(path, uri, parent));
}
