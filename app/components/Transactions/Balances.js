// @flow
import React, { Component } from 'react';
import { Divider, Header, Icon, Segment, Statistic, Table } from 'semantic-ui-react';
import _ from 'lodash';
import NumericLabel from '../../utils/NumericLabel';
import AccountName from '../global/AccountName';

export default class Balances extends Component {
  getBalances(data) {
    const balances = {
      SCR: 0,
      SP: 0
    };
    if (!data) {
      return {
        SCR: <i className="fas fa-spinner"></i>,
        SP: <i className="fas fa-spinner"></i>
      };
    }
    const mapping = {
      SCR: ['balance'],
      SP: ['scorumpower']
    };
    _.forOwn(mapping, (fields: Array, assignment: string) => {
      _.forEach(fields, (field) => {
        const [value] = data[field].split(' ');
        balances[assignment] += parseFloat(value);
        if(field === 'scorumpower') {
          balances[assignment] += parseFloat(data["received_scorumpower"].split(' ')[0]);
          balances[assignment] -= parseFloat(data["delegated_scorumpower"].split(' ')[0]);
        }
      });
    });
    return balances;
  }
  render() {
    let display = false;
    if (true) {
      const accounts = this.props.account.accounts;
      const names = this.props.keys.names;
      const t = this;
      const balances = names.map((account) => {
        return (accounts && accounts[account]) ? t.getBalances(accounts[account]) : {};
      });
      const totals = {
        SCR: balances.reduce((SCR, balance) => SCR + parseFloat(balance.SCR), 0),
        SP: balances.reduce((SP, balance) => SP + parseFloat(balance.SP), 0),
      };
      const numberFormat = {
        shortFormat: true,
        shortFormatMinValue: 1000
      };
      display = (
        <Segment basic>
          <Header>
            Total Wallet Balance
          </Header>
          <Segment>
            <Statistic.Group size="tiny" widths="four">
              <Statistic
                value={<NumericLabel params={numberFormat}>{totals.SCR}</NumericLabel>}
                label="SCR"
              />
              <Statistic
                value={<NumericLabel params={numberFormat}>{totals.SP}</NumericLabel>}
                label="SP"
              />
            </Statistic.Group>
          </Segment>
          <Divider />
          <Header>
            Account Balances
          </Header>
          <Table celled unstackable attached color="blue">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="right">
                  Account
                </Table.HeaderCell>
                <Table.HeaderCell colSpan={2} textAlign="right">
                  Available to Spend
                </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell>
                  Name
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="right">
                  SCR
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="right">
                  SP
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {names.map((account, i) => (
                <Table.Row key={account}>
                  <Table.Cell>
                    <AccountName name={account} />
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <NumericLabel params={numberFormat}>{balances[i].SCR}</NumericLabel>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <NumericLabel params={numberFormat}>{balances[i].SP}</NumericLabel>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Segment>
      );
    }
    return display;
  }
}
