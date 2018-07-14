// @flow
import React, { Component } from 'react';
import { Dropdown, Form, Input } from 'semantic-ui-react'

export default class OperationsPromptFieldAsset extends Component {

  constructor(props) {
    super(props)
    this.state = {
      assetType: 'SCR',
      assetAmount: 0
    }
  }

  modifyAssetAmount = (e, { value, name }) => {
    const amount = parseFloat(value).toFixed(9)
    this.setState({
      assetAmount: amount
    })
    this.props.modifyOpsPrompt(null, {
      index: 0,
      name,
      value: [amount, this.state.assetType].join(' ')
    })
  }

  modifyAssetType = (e, { value, name }) => {
    this.setState({
      assetType: value
    })
    this.props.modifyOpsPrompt(null, {
      index: 0,
      name,
      value: [this.state.assetAmount, value].join(' ')
    })
  }

  render() {
    const { field, meta, opData } = this.props
    const defaultValue = (opData[field]) ? parseFloat(opData[field].split(" ")[0]) : 0
    let options = []
    const option_scr = { key: 'SCR', text: 'SCR', value: 'SCR' }
    switch(meta.type) {
      case "asset":
        options.push(option_scr)
        break;
      case "scr":
        options.push(option_scr)
        break;
    }
    return (
      <Form.Field>
        <label>
          {meta.label}
        </label>
        <Input
          fluid
          key={field}
          required
          index={0}
          name={field}
          defaultValue={defaultValue}
          onChange={this.modifyAssetAmount}
          label='SCR'
          labelPosition='left'
        />
      </Form.Field>
    )
  }

}
