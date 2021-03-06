// @flow
import React, { Component } from 'react';
import { Button, Checkbox, Grid, Label, Message, Modal, Radio, Segment, Select, Table } from 'semantic-ui-react';
import { Form, Input } from 'formsy-semantic-ui-react';
import scorum from '../utils/scorum';

const { shell } = require('electron');

const defaultState = {
  from: '',
  to: '',
  amount: '',
  symbol: 'SCR',
  memo: '',
  memoEncrypted: false,
  encryptMemo: false,
  destination: 'account',
  modalPreview: false,
};

export default class Send extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, defaultState, {
      from: props.keys.names[0]
    });
  }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps.processing.account_transfer_resolved) {
      nextProps.actions.transferCompleted();
      this.resetState();
    }
  }
  resetState() {
    const props = this.props;
    this.setState({
      to: '',
      amount: '',
      memo: '',
      memoEncrypted: false,
      encryptMemo: false,
      modalPreview: false,
      memoDetected: false
    });
  }
  handleDestinationChange = (e: SyntheticEvent, { value }: { value: any }) => {
    this.setState({
      to: '',
      memo: '',
      destination: value,
      encryptMemo: false,
      memoEncrypted: false
    });
  }
  handleSymbolChange = (e: SyntheticEvent, { value }: { value: any }) => {
    const detectMemo = this.detectMemo(this.state.to, value);
    const newState = {
      amount: '',
      symbol: value,
      memo: detectMemo || '',
      memoDetected: (detectMemo)
    };
    this.setState(newState);
  }

  handleMemoEncryptChange = (e: SyntheticEvent, { value }: { value: any }) => {
    if(this.state.encryptMemo === false) {
      this.setState({
        encryptMemo: true,
        memoEncrypted: false
      })
    } else {
      this.setState({
        encryptMemo: false,
        memoEncrypted: false
      })
    }
  }

  detectMemo = (to: string, symbol: string) => {
    const { preferences } = this.props;
    const preferenceKey = [to, symbol].join("_").toLowerCase();
    if (
      preferences.hasOwnProperty(preferenceKey)
      && preferences[preferenceKey].trim !== ''
    ) {
      return preferences[preferenceKey];
    }
    return false;
  }

  handleToChange = (e: SyntheticEvent, { value }: { value: string }) => {
    const cleaned = value.replace('@', '').trim();
    const newState = {
      encryptMemo: false,
      to: cleaned,
      memo: this.detectMemo(cleaned, this.state.symbol) || '',
      memoDetected: (this.detectMemo(cleaned, this.state.symbol)),
      memoEncrypted: false
    }
    // Set state
    this.setState(newState);
  }

  handleMemoChange = (e: SyntheticEvent, { value }: { value: string }) => {
    const cleaned = value.replace(/\s+/gim, ' ');
    this.setState({
      memo: cleaned,
      encryptMemo: false,
      memoEncrypted: false
    });
  }

  handleAmountChange = (e: SyntheticEvent, { value }: { value: any }) => {
    const cleaned = value.replace(/[a-z\s]+/gim, '');
    this.setState({ amount: cleaned });
  }

  setAmountMaximum = (e: SyntheticEvent) => {
    const accounts = this.props.account.accounts;
    const { from, symbol } = this.state;
    const field = 'balance';
    const amount = accounts[from][field].split(' ')[0];
    this.setState({ amount });
  }

  handleExternalLink = (e: SyntheticEvent) => {
  }

  handleFromChange = (e: SyntheticEvent, { value }: { value: any }) => {
    this.setState({
      from: value,
      encryptMemo: false,
      memoEncrypted: false
    })
  }

  isFormValid = () => {
    return true;
  }

  handlePreview = (e: SyntheticEvent) => {
    if(this.isFormValid()) {
      const cleaned = this.state.memo.trim();
      if(this.state.encryptMemo) {
        const from = this.state.from;
        const to = this.state.to;
        const memoKey = this.props.keys.permissions[from].memo
        // Make sure we have a memoKey set and it's a valid WIF
        if(memoKey && scorum.auth.isWif(memoKey)) {
          // Ensure it's the current memo key on file to prevent a user from using an invalid key
          const derivedKey = scorum.auth.wifToPublic(memoKey);
          const memoPublic = this.props.account.accounts[from].memo_key;
          if (derivedKey === memoPublic) {
            // Load the account we're sending to
            scorum.api.getAccounts([to], (err, result) => {
              if(result.length > 0) {
                const toAccount = result[0];
                const toMemoPublic = toAccount.memo_key;
                // Generate encrypted memo based on their public memo key + our private memo key
                const memoEncrypted = scorum.memo.encode(memoKey, toMemoPublic, `#${cleaned}`);
                // Set the state to reflect
                this.setState({
                  memo: cleaned,
                  memoEncrypted: memoEncrypted,
                  modalPreview: true
                });
              } else {
                // no account found
              }
            });
          } else {
            // memo key saved on account doesn't match blockchain
          }
        } else {
          // memo key is not saved or is not valid wif
        }
      } else {
        this.setState({
          memo: cleaned,
          modalPreview: true
        });
      }
    }
    e.preventDefault();
  }

  handleCancel = (e: SyntheticEvent) => {
    this.setState({
      modalPreview: false
    });
    e.preventDefault();
  }

  handleConfirm = (e: SyntheticEvent) => {
    const { from, to, memo, memoEncrypted } = this.state;
    const usedMemo = memoEncrypted || memo;
    const amount = parseFloat(this.state.amount).toFixed(9);
    const amountFormat = [amount, 'SCR'].join(' ');
    this.props.actions.useKey('transfer', { from, to, amount: amountFormat, memo: usedMemo }, this.props.keys.permissions[from]);
    this.setState({
      modalPreview: false
    });
    e.preventDefault();
  }

  render() {
    const accounts = this.props.account.accounts;
    const keys = this.props.keys;
    const availableFrom = keys.names.map((name) => {
      const hasPermission = (keys.permissions[name].type === 'active' || keys.permissions[name].type === 'owner');
      return hasPermission ? {
        key: name,
        text: name,
        value: name
      } : {
        key: name,
        disabled: true,
        text: name + ' (unavailable - active/owner key not loaded)'
      };
    });
    const field = 'balance';
    const availableAmount = accounts[this.state.from][field];
    const errorLabel = <Label color="red" pointing/>;
    let modal = false;
    let toField = (
      <Form.Field
        control={Input}
        name="to"
        label="Enter the to account name"
        placeholder="Enter the account name to send to..."
        value={this.state.to}
        onChange={this.handleToChange}
        // validationErrors={{
          // accountName: 'Invalid account name'
        // }}
        errorLabel={errorLabel}
      />
    );
    if (this.state.modalPreview) {
      modal = (
        <Modal
          open
          header="Please confirm the details of this transaction"
          content={
            <Segment basic padded>
              <p>
                Ensure that all of the data below looks correct before continuing.
                If you mistakenly send to the wrong accout (or with the wrong memo)
                you may lose funds.
              </p>
              <Table
                definition
                collapsing
                style={{ minWidth: '300px', margin: '0 auto' }}
              >
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell textAlign="right">Field</Table.HeaderCell>
                    <Table.HeaderCell>Value</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell textAlign="right">
                      From:
                    </Table.Cell>
                    <Table.Cell>
                      {this.state.from}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell textAlign="right">
                      To:
                    </Table.Cell>
                    <Table.Cell>
                      {this.state.to}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell textAlign="right">
                      Amount:
                    </Table.Cell>
                    <Table.Cell>
                      {this.state.amount}
                      {' SCR'}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell textAlign="right">
                      Memo:
                    </Table.Cell>
                    <Table.Cell>
                      <code>{(this.state.memoEncrypted) ? this.state.memoEncrypted : this.state.memo}</code>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Segment>
          }
          actions={[
            {
              key: 'no',
              icon: <i className="fas fa-times"></i>,
              content: 'Cancel',
              color: 'red',
              floated: 'left',
              onClick: this.handleCancel,
              disabled: this.props.processing.account_transfer_pending
            },
            {
              key: 'yes',
              icon: <i className="fas fa-check"></i>,
              content: 'Confirmed - this is correct',
              color: 'green',
              onClick: this.handleConfirm,
              disabled: this.props.processing.account_transfer_pending
            }
          ]}
        />
      );
    }
    return (
      <Form
        error={!!this.props.processing.account_transfer_error}
        loading={this.props.processing.account_transfer_pending}
      >
        {modal}
        <Grid divided centered>
          <Grid.Row>
            <Grid.Column width={12}>
              <Form.Field
                control={Select}
                value={this.state.from}
                name="from"
                label="Select a loaded account"
                options={availableFrom}
                placeholder="Sending Account..."
                onChange={this.handleFromChange}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={12}>
              {toField}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={12}>
              <div className="field">
                <label htmlFor="amount">Total SCR to Send</label>
              </div>
              <Form.Field
                control={Input}
                name="amount"
                placeholder="Enter the amount to transfer..."
                value={this.state.amount}
                onChange={this.handleAmountChange}
                validationErrors={{
                  isNumeric: 'The amount must be a number'
                }}
                errorLabel={errorLabel}
              />
              <p>
                <a
                  onClick={this.setAmountMaximum}
                  style={{
                    color: 'black',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    textDecoration: 'underline'
                  }}
                >
                  {availableAmount}
                </a>
                {' '}
                available to send.
              </p>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16} textAlign="center">
              <Message
                error
                header="Operation Error"
                content={this.props.processing.account_transfer_error}
              />
              <Form.Field
                control={Button}
                color="purple"
                content="Preview Transaction"
                onClick={this.handlePreview}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }
}
