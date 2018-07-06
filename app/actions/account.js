// @flow
import scorum from '../utils/scorum';
import { accountStateType } from '../reducers/account';
import * as ProcessingActions from './processing';

export const ACCOUNT_CUSTOM_OPS_STARTED = 'ACCOUNT_CUSTOM_OPS_STARTED';
export const ACCOUNT_CUSTOM_OPS_RESOLVED = 'ACCOUNT_CUSTOM_OPS_RESOLVED';
export const ACCOUNT_CUSTOM_OPS_FAILED = 'ACCOUNT_CUSTOM_OPS_FAILED';
export const ACCOUNT_CUSTOM_OPS_COMPLETED = 'ACCOUNT_CUSTOM_OPS_COMPLETED';
export const ACCOUNT_DATA_UPDATE = 'ACCOUNT_DATA_UPDATE';
export const ACCOUNT_DATA_UPDATE_FAILED = 'ACCOUNT_DATA_UPDATE_FAILED';
export const ACCOUNT_DATA_UPDATE_PENDING = 'ACCOUNT_DATA_UPDATE_PENDING';
export const ACCOUNT_GET_TRANSACTIONS = 'ACCOUNT_GET_TRANSACTIONS';
export const ACCOUNT_GET_TRANSACTIONS_RESOLVED = 'ACCOUNT_GET_TRANSACTIONS_RESOLVED';
export const ACCOUNT_DELEGATE_VESTING_SHARES_STARTED = 'ACCOUNT_DELEGATE_VESTING_SHARES_STARTED';
export const ACCOUNT_DELEGATE_VESTING_SHARES_RESOLVED = 'ACCOUNT_DELEGATE_VESTING_SHARES_RESOLVED';
export const ACCOUNT_DELEGATE_VESTING_SHARES_FAILED = 'ACCOUNT_DELEGATE_VESTING_SHARES_FAILED';
export const ACCOUNT_DELEGATE_VESTING_SHARES_COMPLETED = 'ACCOUNT_DELEGATE_VESTING_SHARES_COMPLETED';
export const ACCOUNT_SET_VOTING_PROXY_STARTED = 'ACCOUNT_SET_VOTING_PROXY_STARTED';
export const ACCOUNT_SET_VOTING_PROXY_FAILED = 'ACCOUNT_SET_VOTING_PROXY_FAILED';
export const ACCOUNT_SET_VOTING_PROXY_RESOLVED = 'ACCOUNT_SET_VOTING_PROXY_RESOLVED';
export const ACCOUNT_SET_VOTING_PROXY_COMPLETED = 'ACCOUNT_SET_VOTING_PROXY_COMPLETED';
export const ACCOUNT_VOTE_WITNESS_STARTED = 'ACCOUNT_VOTE_WITNESS_STARTED';
export const ACCOUNT_VOTE_WITNESS_FAILED = 'ACCOUNT_VOTE_WITNESS_FAILED';
export const ACCOUNT_VOTE_WITNESS_RESOLVED = 'ACCOUNT_VOTE_WITNESS_RESOLVED';
export const ACCOUNT_VOTE_WITNESS_COMPLETED = 'ACCOUNT_VOTE_WITNESS_COMPLETED';
export const ACCOUNT_TRANSFER_STARTED = 'ACCOUNT_TRANSFER_STARTED';
export const ACCOUNT_TRANSFER_FAILED = 'ACCOUNT_TRANSFER_FAILED';
export const ACCOUNT_TRANSFER_RESOLVED = 'ACCOUNT_TRANSFER_RESOLVED';
export const ACCOUNT_TRANSFER_COMPLETED = 'ACCOUNT_TRANSFER_COMPLETED';

export function refreshAccountData(accounts: Array) {
  return (dispatch: () => void) => {
    dispatch({
      type: ACCOUNT_DATA_UPDATE_PENDING
    });
    scorum.api.getAccounts(accounts, (err, results) => {
      if (err) {
        dispatch({
          type: ACCOUNT_DATA_UPDATE_FAILED,
          payload: err
        });
      } else {
        const payload = {};
        results.forEach((data) => {
          payload[data.name] = data;
        });
        dispatch({
          type: ACCOUNT_DATA_UPDATE,
          payload
        });
      }
    });
  };
}

export function transfer(wif, params) {
  return (dispatch: () => void) => {
    const { from, to, amount, memo } = params;
    dispatch({
      type: ACCOUNT_TRANSFER_STARTED
    });
    scorum.broadcast.transfer(wif, from, to, amount, memo, (err, result) => {
      if (err) {
        dispatch({
          type: ACCOUNT_TRANSFER_FAILED,
          payload: err
        });
      } else {
        refreshAccountData([from, to]);
        dispatch({
          type: ACCOUNT_TRANSFER_RESOLVED
        });
      }
    });
  };
}

export function transferCompleted() {
  return {
    type: ACCOUNT_TRANSFER_COMPLETED,
  }
}

export function setDelegateVestingShares(wif, params) {
  return (dispatch: () => void) => {
    const { delegator, delegatee, vestingShares } = params;
    dispatch({
      type: ACCOUNT_DELEGATE_VESTING_SHARES_STARTED
    });
    const formattedVestingShares = [parseFloat(vestingShares).toFixed(9), 'SP'].join(' ');
    scorum.broadcast.delegate_Scorumpower(wif, delegator, delegatee, formattedVestingShares, (err, result) => {
      if (err) {
        dispatch({
          type: ACCOUNT_DELEGATE_VESTING_SHARES_FAILED,
          payload: err
        });
      } else {
        dispatch(refreshAccountData([delegator]));
        dispatch({
          type: ACCOUNT_DELEGATE_VESTING_SHARES_RESOLVED
        });
      }
    });
  };
}

export function setDelegateVestingSharesCompleted() {
  return {
    type: ACCOUNT_DELEGATE_VESTING_SHARES_COMPLETED,
  }
}

export function setVotingProxy(wif, params) {
  return (dispatch: () => void) => {
    const { account, proxy } = params;
    dispatch({
      type: ACCOUNT_SET_VOTING_PROXY_STARTED
    });
    scorum.broadcast.accountWitnessProxy(wif, account, proxy, (err, result) => {
      if (err) {
        dispatch({
          type: ACCOUNT_SET_VOTING_PROXY_FAILED,
          payload: err
        });
      } else {
        dispatch(refreshAccountData([account]));
        dispatch({
          type: ACCOUNT_SET_VOTING_PROXY_RESOLVED
        });
      }
    });
  };
}

export function setVotingProxyCompleted() {
  return {
    type: ACCOUNT_SET_VOTING_PROXY_COMPLETED,
  }
}

export function voteWitness(wif, params) {
  return (dispatch: () => void) => {
    const { account, witness, approve } = params;
    dispatch({
      type: ACCOUNT_VOTE_WITNESS_STARTED
    });
    scorum.broadcast.accountWitnessVote(wif, account, witness, approve, (err, result) => {
      if (err) {
        dispatch({
          type: ACCOUNT_VOTE_WITNESS_FAILED,
          payload: err
        });
      } else {
        dispatch(refreshAccountData([account]));
        dispatch({
          type: ACCOUNT_VOTE_WITNESS_RESOLVED
        });
      }
    });
  }
}

export function voteWitnessCompleted() {
  return {
    type: ACCOUNT_VOTE_WITNESS_COMPLETED,
  }
}

export function send(wif, params) {
  return (dispatch: () => void) => {
    const { operations, extensions } = params
    console.log(operations, extensions)
    dispatch({
      type: ACCOUNT_CUSTOM_OPS_STARTED
    })
    scorum.broadcast.send({ operations, extensions }, { posting: wif }, function(err, result) {
      if(result) {
        dispatch({
          type: ACCOUNT_CUSTOM_OPS_RESOLVED
        })
      }
      if(err) {
        dispatch({
          type: ACCOUNT_CUSTOM_OPS_FAILED,
          payload: err
        })
      }
    });
  };
}
