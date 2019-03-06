import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../typedefs/types';
import { bindActionCreators, Dispatch } from 'redux';
import { messagesActions } from './actions';
import './messages.css';

type Props = {
  list: Array<string>;
  visible: boolean;
  instructions: string;
  start1: any;
  stop1: any;
  start2: any;
  stop2: any;
  stopall: any;
  show: any;
  hide: any;
  foo: any;
  sequence: any;
  async: any;
  error1: any;
  error2: any;
  error3: any;
};

class MessageList extends Component<Props, any> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div className="messages" style={{ display: 'flex' }}>
        <div key="actions">
          <p>Show message for 3 seconds or until Stop is clicked </p>
          <p>
            <i>showMessage3Sec</i>
          </p>
          <button onClick={this.props.start1}>Start 1</button>
          <button onClick={this.props.stop1}>Stop 1</button>
          <p>Show message until Stop is clicked but at least 3 seconds</p>
          <p>
            <i>showMessageAtLeast3SecEpic</i>
          </p>
          <button onClick={this.props.start2}>Start 2</button>
          <button onClick={this.props.stop2}>Stop 2</button>
          <button onClick={this.props.stopall}>Stop all</button>
          <p>Run a sequence of 3 asynchronous actions.</p>
          <p>
            <i>showMessageAtLeast3SecEpic</i>
          </p>
          <button onClick={this.props.sequence}>Sequence</button>
          <button onClick={this.props.async}>Async</button>
          <button onClick={this.props.error1}>Error1</button>
          <button onClick={this.props.error2}>Error2</button>
          {this.props.visible && <p style={{ color: 'red' }}>Message shown</p>}
          <p key="instructions">{this.props.instructions}</p>
        </div>
        <div key="messages">
          <p>Dispatched actions</p>
          <div key="list" style={{ overflow: 'auto' }}>
            {this.props.list.map((s, ix) => (
              <p key={ix}>{s}</p>
            ))}
          </div>
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
