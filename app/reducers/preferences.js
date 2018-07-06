// @flow
import {
  SET_PREFERENCE
} from '../actions/preferences';

const defaultState = {
  steemd_node: 'https://prodnet.scorum.com'
};

export type preferencesStateType = {};

export default function processing(state = defaultState, action) {
  // console.log('>>> reducers/preferences', state, action);
  switch (action.type) {
    case SET_PREFERENCE:
      return Object.assign({}, state, {
        [action.payload.key]: action.payload.value
      })
    default: {
      return state;
    }
  }
}
