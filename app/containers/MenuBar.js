// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import * as AccountActions from '../actions/account';
import * as SteemActions from '../actions/steem';

const src = require('../img/steem.png');

class MenuBar extends Component {

  state = {
    intervalId: 0
  };

  componentDidMount() {
    this.interval = setInterval(this.timer.bind(this), 10000);
    this.timer();
    // this.props.actions.getTransactions(this.props.keys.names);
  }

  componentWillUnmount() {
    // console.log('unmounting');
    clearInterval(this.interval);
  }

  interval = 0;

  timer = () => {
    // console.log('tick');
    this.props.actions.refreshAccountData(this.props.keys.names);
    this.props.actions.refreshGlobalProps();
    // this.props.actions.getTransactions(this.props.account.names);
  }

  render() {
    let height = 'Loading'
    if (this.props.steem.props) {
      height = this.props.steem.props.head_block_number;
    }
    return (
      <Menu vertical fixed="left" color="violet" inverted icon="labeled">
        <Menu.Item header>
          <img
            alt="Polarity"
            className="ui tiny image"
            src={src}
            style={{
              width: '50px',
              height: '50px',
              margin: '0 auto 1em',
            }}
          />
          Polarity
        </Menu.Item>
        <Link className="link item" to="/transactions">
          Overview
        </Link>
        <Link className="link item" to="/send">
          Send
        </Link>
        <Link className="link item" to="/accounts">
          Accounts
        </Link>
        <Link className="link item" to="/settings">
          Settings
        </Link>
        <Menu.Item
          className="link"
          style={{
            position: 'absolute',
            bottom: 0
          }}
        >
          <p>
            Height
          </p>
          {height}
        </Menu.Item>
      </Menu>
    );
  }
}

function mapStateToProps(state) {
  return {
    keys: state.keys,
    steem: state.steem
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...AccountActions,
      ...SteemActions
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);
