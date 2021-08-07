import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Link, RouteFnProps, RouteObject, useRouter } from 'react-hookrouter';
import { App1 } from './App1';

const router: RouteObject = {
  '/': AppChooser,
  '/app1*': App1,
  '/app2': App2,
};

function AppChooser() {
  return (
    <div>
      <Link to="app1">App 1</Link>
      <Link to="app2">App 2</Link>
    </div>
  );
}
function App() {
  return useRouter(router) ?? <div>Hey nothing to see here</div>;
}

function App2({ route }: RouteFnProps) {
  const [count, setCount] = useState(0);
  console.log(route);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        {route.parent && <Link to={-1}>Go back</Link>}
        <p>
          <button type="button" onClick={() => setCount(count => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
