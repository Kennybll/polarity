// @flow
import React, { Component } from 'react';
import { Button, Divider, Header, List, Segment, Table } from 'semantic-ui-react';

export default class KeysConfirm extends Component {
  render() {
    const confirmAccount = this.props.keys.confirm;
    const encryptWallet = this.props.encryptWallet;
    const handleConfirmAction = this.props.handleConfirmAction;
    return (
      <Segment basic padded>
        <Header>
          Confirm Account Information
          <Header.Subheader>
            The key entered corresponds to the following account and permissions
            to perform the following actions:
          </Header.Subheader>
        </Header>
        <Table unstackable definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell width={6} textAlign="right">
                Account Name
              </Table.Cell>
              <Table.Cell>
                {confirmAccount.account}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell textAlign="right">
                Password Encrypted Wallet
              </Table.Cell>
              <Table.Cell>
                {
                  encryptWallet ? <i className="fas fa-check"></i> : <i className="fas fa-times"></i>
                }
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell textAlign="right">
                <List>
                  <List.Item>
                    Vote
                  </List.Item>
                  <List.Item>
                    Create Posts
                  </List.Item>
                </List>
              </Table.Cell>
              <Table.Cell>
                {
                  confirmAccount.posting ? <i className="fas fa-check"></i> : <i className="fas fa-times"></i>
                }
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell textAlign="right">
                <List>
                  <List.Item>
                    Transfer Funds
                  </List.Item>
                  <List.Item>
                    Witness Voting
                  </List.Item>
                </List>
              </Table.Cell>
              <Table.Cell>
              {
                  confirmAccount.active ? <i className="fas fa-check"></i> : <i className="fas fa-times"></i>
                }
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell textAlign="right">
                <List>
                  <List.Item>
                    Change Account Keys
                  </List.Item>
                  <List.Item>
                    Transfer Ownership
                  </List.Item>
                </List>
              </Table.Cell>
              <Table.Cell>
                {
                  confirmAccount.owner ? <i className="fas fa-check"></i> : <i className="fas fa-times"></i>
                }
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
        <Divider hidden />
        <p>
          Please confirm you would like to save this account
          with these permissions to this wallet.
        </p>
        <Segment basic>
          <Button
            content="Cancel"
            color="red"
            onClick={handleConfirmAction}
            value={false}
          />
          <Button
            floated="right"
            content="Confirm Save"
            color="green"
            onClick={handleConfirmAction}
            value
          />
        </Segment>
      </Segment>
    );

  }
}
