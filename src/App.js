import React, { Component } from 'react';
import logo from './logo.svg';
import { Grommet, Box, Button } from 'grommet';
import theme from './theme';
import './App.css';

class App extends Component {
  render() {
    return (
      <Grommet theme={theme}>
        <Box align="center" background="neutral-2">
          <img src={logo} className="App-logo" alt="logo" />
          <Button
            label="hello world"
            primary
            onClick={() => alert('hello, world')}
          />
        </Box>
      </Grommet>
    );
  }
}

export default App;
