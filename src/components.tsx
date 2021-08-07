import React from 'react';
import { navigate, RouterContext } from './router';

interface LinkProps<S = {}> {
  to: -1 | string;
  replace?: boolean;
  state?: S;
}

export const Link = React.forwardRef(
  <S extends any = {}>(
    {
      to,
      replace,
      state,
      children,
      ...props
    }: React.PropsWithChildren<LinkProps<S> & React.HTMLProps<HTMLAnchorElement>>,
    ref: React.Ref<HTMLAnchorElement>,
  ) => {
    const { href, onClick, isActive } = useLink({ to, replace, state });

    return React.createElement(
      'a',
      Object.assign({}, { props, ref, href, onClick, ['data-active']: isActive }),
      children,
    );
  },
);

export function useLink<S = {}>({ to, replace, state }: LinkProps<S>) {
  const router = React.useContext(RouterContext);
  const href = to === -1 ? router.parent?.pathname ?? '' : router.resolve(to);

  return {
    href,
    isActive: location.pathname === href,
    isPartlyActive: location.pathname.startsWith(href),
    onClick(e: React.MouseEvent) {
      if (!e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        to === -1 ? router.goBack() : navigate(href, replace, state);
      }
    },
  };
}
