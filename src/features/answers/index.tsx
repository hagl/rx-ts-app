import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../reducers'
import { answerActions } from './redux';

type Actions = typeof answerActions;

interface Props extends Actions {
};

class Controls extends Component<Props, any> {
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

export default connect(
  (state: RootState) => state.answers,
  answerActions
)(Controls);
