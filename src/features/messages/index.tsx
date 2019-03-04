import React, { Component } from "react";
import { connect } from "react-redux";
import { RootState } from "../../typedefs/types";
import { bindActionCreators, Dispatch } from "redux";
import { messagesActions } from "./actions";

type Props = {
  list: Array<string>;
  visible: boolean;
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
      <div className="MessageList">
        <button onClick={this.props.start1}>Start 1</button>
        <button onClick={this.props.stop1}>Stop 1</button>
        <button onClick={this.props.start2}>Start 2</button>
        <button onClick={this.props.stop2}>Stop 2</button>
        <button onClick={this.props.stopall}>Stop all</button>
        <button onClick={this.props.show}>Show</button>
        <button onClick={this.props.hide}>Hide</button>
        <button onClick={this.props.foo}>Foo</button>
        <button onClick={this.props.sequence}>Sequence</button>
        <button onClick={this.props.error1}>Error1</button>
        <button onClick={this.props.error2}>Error2</button>
        <button onClick={this.props.error3}>Timeout</button>
        <button onClick={this.props.async}>Async</button>
        <div>
          {this.props.visible && (
            <p>message is displayed, click [STOP] to hide</p>
          )}
        </div>
        {this.props.list.map((s, ix) => (
          <p key={ix}>{s}</p>
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => state.messages;
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(messagesActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageList);
