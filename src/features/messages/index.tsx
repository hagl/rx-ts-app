import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../typedefs/types';

type Props = {
  list: Array<string>
}

class MessageList extends Component<Props, any> {

  constructor(props: Props) {
    super(props)
  }

  render() {
    return (
      <div className="MessageList">
        {this.props.list.map((s, ix) => (<p key={ix}>{s}</p>))}
      </div>
    );
  }
}

const mapStateToProps = ({messages} : RootState)  => messages

export default connect(mapStateToProps)(MessageList);
// export default MessageList
