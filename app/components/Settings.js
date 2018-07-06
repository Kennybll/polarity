// @flow
import React, { Component } from 'react';

import PreferredNode from './global/PreferredNode'
import { Form, Input } from 'formsy-semantic-ui-react'
import { Divider, Grid, Header, Label, Segment, Select } from 'semantic-ui-react';

export default class Settings extends Component {

   handleChange = (
    e: SyntheticEvent, { name, value }: { name: string, value: string }
  ) => {
     const { setPreference } = this.props.actions;
     setPreference(name, value);
  }

  onValidSubmit = (
   e: SyntheticEvent
 ) => {
    const { setPreference } = this.props.actions;
    setPreference('steemd_node', e.steemd_node);
 }

  render() {
    return (
      <Segment basic padded>

        <PreferredNode {...this.props} />

      </Segment>
    );
  }
}
