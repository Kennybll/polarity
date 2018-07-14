// @flow
import React, { Component } from 'react';
import { Dropdown, Form, Input } from 'semantic-ui-react'

export default class OperationsPromptFieldVests extends Component {

  state = {
    assetType: 'SP',
    assetAmount: 0,
  }

  updateVests = () => {
    const { field } = this.props
    const { assetAmount, assetType } = this.state
    let vests = [assetAmount, 'SP'].join(" ")
    this.props.modifyOpsPrompt(null, {
      index: 0,
      name: field,
      value: vests
    })
  }

  modifyAssetAmount = (e, { value, name }) => {
    let amount = parseFloat(value).toFixed(9)
    this.setState({
      assetAmount: amount
    }, this.updateVests)
  }

  render() {
    const { field, meta, opData } = this.props
    const defaultValue = (opData[field]) ? parseFloat(opData[field].split(" ")[0]) : 0
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
          label='SP'
          labelPosition='left'
        />
      </Form.Field>
    )
  }

}
