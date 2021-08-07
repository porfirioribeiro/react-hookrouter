import React from 'react';
import { navigate, RouterContext } from './router';

interface LinkProps<S = {}> {
  to: string;
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
  const href = router.resolve(to);

  return {
    href,
    isActive: location.pathname === href,
    isPartlyActive: location.pathname.startsWith(href),
    onClick(e: React.MouseEvent) {
      if (!e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        navigate(href, replace, state);
      }
    },
  };
}
