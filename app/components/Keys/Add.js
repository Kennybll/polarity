// @flow
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Button, Divider, Grid, Header, Segment } from 'semantic-ui-react';

import KeysImport from './Import';

export default class Welcome extends Component {

  state = {
    importMethod: false
  }
  handleMethodChange = (e, props) => this.setState({ importMethod: props.value })
  handleMethodReset = (e, props) => this.setState({ importMethod: false })

  render() {
    let display = (
      <Segment.Group>
        <Segment padded>
          <Header>
            Import a private key
            <Header.Subheader>
              Any type of private key can be imported into your wallet,
              granting different levels of permission based on the key used.
            </Header.Subheader>
          </Header>
          <Button
            color="green"
            size="large"
            onClick={this.handleMethodChange}
            value="import-private-key"
          >
            Import a private key
          </Button>
        </Segment>
      </Segment.Group>
    );
    switch (this.state.importMethod) {
      case 'import-private-key':
        display = (
          <KeysImport
            handleMethodReset={this.handleMethodReset}
            {...this.props}
          />
        );
        break;
      default: {
        break;
      }
    }
    return display;
  }
}
