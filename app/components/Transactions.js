// @flow
import React, { Component } from 'react';
import { Header, Segment } from 'semantic-ui-react';
import Balances from './Transactions/Balances';

export default class Transactions extends Component {

  render() {
    return (
      <div>
        <Segment color="blue" inverted attached data-tid="container">
          <Header textAlign="center">
            Account History
          </Header>
        </Segment>
        <Segment basic>
          <Segment>
            <Balances {...this.props} />
          </Segment>
        </Segment>
      </div>
    );
  }
}
