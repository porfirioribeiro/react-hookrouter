import { FunctionComponent } from 'react';

/**
 * Matched route context
 * Contains information about the match
 */
export interface RouterCtx<P extends any = any> {
  /** current uri */
  uri?: string;
  /** matched pathname */
  pathname: string;
  /** base path to match */
  basePath: string;
  /** segment matched */
  segment: string;
  /** matched params */
  params: P;
  /** The parent route match */
  parent?: RouterCtx<P>;
  /** navigate to a path resolved to this route match */
  navigate(to: string, replace?: boolean, state?: any, noInterception?: boolean): null;
  /** resolve a path to this route match */
  resolve(to: string): string;
  /** go back to the root of the match, using `history` if possible */
  goBack(): void;
}

export type RouteFnProps<P extends any = {}> = {
  /** matched route */
  route: RouterCtx<P>;
  /** navigate to a path resolved to this route match */
  navigate(to: string, replace?: boolean, state?: any, noInterception?: boolean): null;
} & P;

export type RouteFn<P extends any = {}> = FunctionComponent<RouteFnProps<P>>;
export type RouteObject<P extends any = {}> = Record<string, RouteFn<P & any>>;

// PathUpdaters
export type PathUpdater = (pathname: string) => void;

// Interceptors
export type InterceptorFn = (prevPathname: string, nextPathname: string, go: () => void) => string;
