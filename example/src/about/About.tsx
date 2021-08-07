import { Tab, Tablist } from 'evergreen-ui';
import React from 'react';
import { Link, redir, RouteObject, useRouter, useRouterEx } from 'react-hookrouter';
import { Project } from './Project';

const routes: RouteObject = {
  '': redir('me'),
  '/me': Me,
  '/project*': Project,
};

export function About() {
  const [route, match] = useRouterEx(routes);
  return (
    <>
      <Tablist>
        <Link to="me">
          <Tab isSelected={route?.segment === '/me'}>Me</Tab>
        </Link>
        <Link to="project">
          <Tab isSelected={route?.segment === '/project'}>Project</Tab>
        </Link>
      </Tablist>
      {match}
    </>
  );
}

function Me() {
  return <div>Meeee</div>;
}
