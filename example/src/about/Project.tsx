import React from 'react';
import { Button, Dialog, Pane, Tab, Tablist } from 'evergreen-ui';
import { Link, RouteFnProps, useRouter } from 'react-hookrouter';

const routes = {
  '/modal1': Modal1,
};
export function Project() {
  const match = useRouter(routes);
  return (
    <>
      <Pane>
        <Link to="modal1">
          <Button>Hello World</Button>
        </Link>
      </Pane>
      {match}
    </>
  );
}

function Modal1({ route }: RouteFnProps) {
  return (
    <Dialog isShown onCloseComplete={route.goBack}>
      asfssdfsd
    </Dialog>
  );
}
