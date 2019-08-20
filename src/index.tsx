import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { createEpicMiddleware } from "redux-observable";
import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducers/root";
import { rootEpic } from "./epics";
import { Provider } from "react-redux";
import MessageList from "./features/answers";

const epicMiddleware = createEpicMiddleware();
const logger = (store: any) => (next: any) => (action: any) => {
  console.groupCollapsed("dispatching", action.type);
  console.log("previous state:", store.getState());
  console.log("action: ", action);
  console.log("next state", store.getState());
  console.groupEnd();
  return next(action);
};

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(epicMiddleware/*, logger*/)));

epicMiddleware.run(rootEpic);

const appWithProvider = (
  <Provider store={store}>
    <MessageList />
  </Provider>
);

ReactDOM.render(appWithProvider, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
