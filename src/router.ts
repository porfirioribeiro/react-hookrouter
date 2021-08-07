import {
  createContext,
  createElement,
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { InterceptorFn, PathUpdater, RouteFn, RouteFnProps, RouteObject, RouterCtx } from './types';
import { matcher } from './matcher';
import { segmentize, urlSplitRE } from './utils';

let basePath = '';
let basePathReplacer = new RegExp(`^${basePath}`);
let currentPath = window.location.pathname;
let pathUpdaters: PathUpdater[] = [];
let interceptors: InterceptorFn[] = [];
let matchPathUpdaters: PathUpdater[] = [];

/**
 * Set the base for your app
 * By default it is an empty string for serving on root
 * To specify a diferent path use /base
 * Must include a / on start but not on end!
 * @param path /something
 */
export function setBasePath(path: string) {
  basePath = path;
  basePathReplacer = new RegExp(`^${path}`);
}

export const getBasepath = () => basePath;

export function getPath() {
  return currentPath.replace(basePathReplacer, '');
}

/** triggers a navigation resolved to root basePath */
export function navigate(to: string, replace = false, state: any = {}, noInterception?: boolean) {
  const currentHash = location.hash;
  const [, pathname, query = '', hash = ''] = urlSplitRE.exec(to) as string[];

  let next: string | void = basePathReplacer.test(pathname) ? pathname : basePath + pathname;
  next = noInterception ? next : interceptNavigation(currentPath, next, replace, state);

  if (next && next !== currentPath) {
    const _prev = (replace && history.state && history.state._prev) || getPath();
    currentPath = next;
    // @ts-ignore
    window.history[`${replace ? 'replace' : 'push'}State`](
      Object.assign({ _prev }, state),
      null,
      next + query + hash,
    );
    // trigger an hashchange event if it has changed with a navigation
    if (hash !== currentHash) window.dispatchEvent(new HashChangeEvent('hashchange'));

    updatePath(currentPath);
  } // if the location has not changed but the hash has, change it
  else if (hash && currentHash !== hash) window.location.hash = hash;

  return null;
}

/** resolve a path to root basePath */
export function resolve(to: string, base = '/') {
  // /foo/bar, /baz/qux => /foo/bar
  if (to.startsWith('/')) return basePath + to;
  // #baz, / => #baz
  if (to.startsWith('#')) return to;

  const toSegments = segmentize(to);
  const baseSegments = segmentize(base);

  // ?a=b, /users?b=c => /users?a=b
  if (toSegments[0] === '') return basePath + base;

  // userProfile, /users/789 => /users/789/userProfile
  if (!toSegments[0].startsWith('.'))
    return basePath + (base === '/' ? '' : '/') + baseSegments.concat(toSegments).join('/');

  // ./         /users/123  =>  /users/123
  // ../        /users/123  =>  /users
  // ../..      /users/123  =>  /
  // ../../one  /a/b/c/d    =>  /a/b/one
  // .././one   /a/b/c/d    =>  /a/b/c/one
  const allSegments = baseSegments.concat(toSegments);
  const segments = [];
  for (let i = 0, l = allSegments.length; i < l; i += 1) {
    const segment = allSegments[i];
    if (segment === '..') segments.pop();
    else if (segment !== '.') segments.push(segment);
  }

  return `${basePath}/${segments.join('/')}`;
}

/** Root router go back */
function goBack() {
  if (history.state && history.state._prev) history.back();
  else navigate(basePath, true);
}

/**
 * Creates a redirect component to use as a route
 * @param to
 */
export const redir =
  (to: string): RouteFn =>
  ({ navigate }: RouteFnProps) => {
    queueMicrotask(() => navigate(to, true));
    return null;
  };

export function Redirect({ to, replace, state }: { to: string; replace?: boolean; state?: any }) {
  const route = useContext(RouterContext);
  useEffect(() => {
    route.navigate(to, replace, state);
  }, [route]);
  return null;
}

export const RouterContext = createContext<RouterCtx>({
  basePath: '',
  segment: '',
  resolve,
  navigate,
  goBack,
  pathname: currentPath,
  params: {},
});

export function useMatch<P>() {
  return useContext(RouterContext) as RouterCtx<P>;
}

export function useRouterEx<P>(
  routes: RouteObject<P>,
  props?: P,
): [RouterCtx<P>, ReactElement] | [] {
  const parentRoute = useContext(RouterContext);
  const [uri, setUri] = useState(getPath);
  const isRoot = parentRoute.uri === undefined;

  useEffect(() => (!isRoot ? undefined : addPathListener(setUri)), [isRoot, setUri]);

  const routeKeys = Object.keys(routes);
  for (const key of routeKeys) {
    const matchPath = parentRoute.basePath + (key === '/' && parentRoute.basePath ? '' : key);
    const route = matcher(matchPath, (isRoot ? uri : parentRoute.uri!) || '/', parentRoute);

    if (route) {
      setMathPath(matchPath);
      return [
        route,
        createElement(
          RouterContext.Provider,
          { value: route },
          createElement(
            routes[key],
            Object.assign({}, props, route.params, {
              navigate: route.navigate,
              route,
            }),
          ),
        ),
      ];
    }
  }

  return [];
}

export function useRouter<P>(routes: RouteObject<P>, props?: P): ReactElement | null {
  return useRouterEx(routes, props)[1]!;
}

// Navigation Events
window.addEventListener('popstate', e => {
  const state = window.history.state;
  const next = interceptNavigation(currentPath, window.location.pathname, false, state);

  if (!next || next === currentPath) {
    e.preventDefault();
    e.stopPropagation();
    // @ts-ignore
    if (!next) window.history.pushState(state, null, currentPath);
    return;
  }
  currentPath = next;

  if (next !== location.pathname) {
    // @ts-ignore
    history.replaceState(null, null, next);
  }
  updatePath(currentPath);
});

// PathUpdaters
export function addPathListener(listener: PathUpdater) {
  pathUpdaters.push(listener);
  return () => {
    pathUpdaters = pathUpdaters.filter(l => l !== listener);
  };
}

function updatePath(path: string) {
  pathUpdaters.forEach(cb => cb(basePath ? path.replace(basePathReplacer, '') : path));
}

// PathUpdaters
export function addMatchPathListener(listener: PathUpdater) {
  matchPathUpdaters.push(listener);
  return () => {
    matchPathUpdaters = matchPathUpdaters.filter(l => l !== listener);
  };
}

let currentMatchPath = '';
function updateMatchPath(path: string) {
  if (path !== currentMatchPath) {
    matchPathUpdaters.forEach(cb => cb(path));
    currentMatchPath = path;
  }
}

/**
 * Subscribe to the current path being matched. Useful for analytics
 * This path is collected after all routers be rendered as we have no way to know
 * te match path before that, also it has a 500ms threshold
 */
export function useMatchPath() {
  const [match, setMatch] = useState(currentMatchPath);
  useEffect(() => addMatchPathListener(setMatch), []);
  return match;
}

let mpTimeout: number;

function setMathPath(matchPath: string) {
  if (mpTimeout) clearTimeout(mpTimeout);
  mpTimeout = setTimeout(updateMatchPath, 500, matchPath) as any;
}

// interceptors
function interceptNavigation(
  prevPathname: string,
  nextPathname: string,
  replace: boolean,
  state: any,
) {
  if (!interceptors.length) return nextPathname;

  const prev = prevPathname.replace(basePathReplacer, '');
  const uri = interceptors.reduceRight(
    (next, interceptor) =>
      next === prev
        ? next
        : interceptor(prev, next, () => navigate(basePath + next, replace, state, true)),
    nextPathname.replace(basePathReplacer, ''),
  );
  return uri && basePath + uri;
}

export function interceptRoute(fn: InterceptorFn) {
  interceptors.unshift(fn);
  return () => {
    interceptors = interceptors.filter(f => f !== fn);
  };
}

export function useInterceptor(fn: InterceptorFn) {
  const interceptor = useMemo(() => interceptRoute(fn), []);

  useEffect(() => interceptor, [interceptor]);
  return interceptor;
}
