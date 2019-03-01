import React, { Component } from 'react';
import './App.css';
import MessageList from './features/messages'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        {/* <MessageList list={['abc']} ></MessageList> */}
        {/* <MessageList list={['abc']} ></MessageList> */}
        <MessageList />
      </div>
    );
  }
}

export default App;
