import React, { Component } from 'react';
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, Security, SecureRoute } from '@okta/okta-react';
import Home from './Home';
import Profile from './Profile';
import Cart from './Cart';
import Checkout from './Checkout';

const oktaAuth = new OktaAuth({
  issuer: `https://${process.env.REACT_APP_DOMAIN}/oauth2/default`,
  clientId: process.env.REACT_APP_CLIENT_ID,
  redirectUri: window.location.origin + '/login/callback'
});

class App extends Component {

  constructor(props) {
    super(props);
    this.restoreOriginalUri = async (_oktaAuth, originalUri) => {
      props.history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
    };
  }

  render() {
    return (
      <Security oktaAuth={oktaAuth} restoreOriginalUri={this.restoreOriginalUri}>
        <Route path="/" exact={true} component={Home}/>
        <Route path="/cart" component={Cart} />
        <SecureRoute path="/checkout" component={Checkout} />
        <Route path="/login/callback" component={LoginCallback}/>
        <SecureRoute path="/profile" component={Profile}/>
      </Security>
    );
  }
}

const AppWithRouterAccess = withRouter(App);

class RouterApp extends Component {
  render() {
    return (<Router><AppWithRouterAccess/></Router>);
  }
}

export default RouterApp;