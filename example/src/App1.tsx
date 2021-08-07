import { Pane, Paragraph, SidebarTab, Tab, Tablist } from 'evergreen-ui';
import React from 'react';
import { Link, RouteObject, useLink, useRouter, useRouterEx } from 'react-hookrouter';
import { About } from './about/About';

const routes: RouteObject = {
  '': Home,
  '/about*': About,
};

export function App1_() {
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

export function App1() {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [tabs] = React.useState(['Traits', 'Event History', 'Identities']);

  const [route, match] = useRouterEx(routes);

  return (
    <Pane display="flex" height={240}>
      <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
        <Link to="">
          <Tab direction="vertical" isSelected={route?.segment === ''}>
            Home
          </Tab>
        </Link>
        <Link to="about">
          <Tab direction="vertical" isSelected={route?.segment === '/about'}>
            About
          </Tab>
        </Link>
      </Tablist>
      <Pane padding={16} background="tint1" flex="1">
        {match}
      </Pane>
    </Pane>
  );
}

function Home() {
  return <div>Homesweet home</div>;
}
