import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../typedefs/types';
import { bindActionCreators, Dispatch } from 'redux';
import { messagesActions } from './actions';

type Actions = typeof messagesActions;

interface Props extends Actions {
  list: Array<string>;
  visible: boolean;
  instructions: string;
};

class MessageList extends Component<Props, any> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div className="messages" style={{ display: 'flex' }}>
        <div key="actions">
          <button onClick={this.props.startArraySpread}>ARRAY_SPREAD</button>
          <button onClick={this.props.startArrayConcat}>ARRAY_CONCAT</button>
          <button onClick={this.props.startArrayPush}>ARRAY_PUSH</button>
          <button onClick={this.props.startObjectSpread}>OBJECT_SPREAD</button>
          <p></p>
          <button onClick={this.props.sequence}>RUN</button>
          <button onClick={this.props.reset}>RESET</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => state.messages;
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(messagesActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageList);
