import React, { Component } from 'react';
import { Grommet, Box, Button } from 'grommet';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import logo from './logo.svg';
import theme from './theme';
import { Home, News } from './pages';

class App extends Component {
  render() {
    return (
      <Router>
        <Grommet theme={theme}>
          <Box align="center" background="neutral-2">
            <img src={logo} className="App-logo" alt="logo" />
            <Button
              label="hello world"
              primary
              onClick={() => alert('hello, world')}
            />
          </Box>
          <Route exact path="/" component={Home} />
          <Route path="/news" component={News} />
        </Grommet>
      </Router>
    );
  }
}

export default App;
