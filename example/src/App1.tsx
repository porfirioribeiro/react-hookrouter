import React from 'react';
import { Link, RouteObject, useRouter } from 'react-hookrouter';
import { About } from './about/About';

const routes: RouteObject = {
  '': Home,
  '/about*': About,
};

export function App1() {
  const match = useRouter(routes);
  return (
    <>
      <header>
        My app 1
        <nav>
          <Link to="">Home</Link>
          <Link to="about">About</Link>
        </nav>
      </header>
      <main>{match ?? <div>404</div>}</main>
    </>
  );
}

function Home() {
  return <div>Homesweet home</div>;
}
