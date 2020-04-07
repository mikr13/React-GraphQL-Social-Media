import React, { useContext } from 'react';
import { Grid } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';

function Home() {
  const { user } = useContext(AuthContext);

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>{{ user }}</h1>
      </Grid.Row>
    </Grid>
  );
}

export default Home;
