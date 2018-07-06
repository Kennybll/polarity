// @flow
import React, { Component } from 'react';

const { shell } = require('electron');

export default class AccountName extends Component {

  handleLink = () => {
    const { name } = this.props;
    shell.openExternal(`https://scorum.com/en-us/profile/@${name}`);
  }

  render() {
    const { name } = this.props;
    return (
      <a
        onClick={this.handleLink}
        >
        {name}
      </a>
    );
  }
}
