import React from 'react';
import { Link, redir, RouteObject, useRouter } from 'react-hookrouter';
import { Project } from './Project';

const routes: RouteObject = {
  '': redir('me'),
  '/me': Me,
  '/project*': Project,
};

export function About() {
  const match = useRouter(routes);
  return (
    <>
      <div>
        <Link to="me">Me</Link>
        <Link to="project">Project</Link>
      </div>
      {match}
    </>
  );
}

function Me() {
  return <div>Meeee</div>;
}
