import React from "react";
import ReactDOM from "react-dom";
import { createEpicMiddleware } from "redux-observable";
import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducers";
import { rootEpic } from "./epics";
import { Provider } from "react-redux";
import Controls from "./features/answers";

const epicMiddleware = createEpicMiddleware();

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(epicMiddleware)));

epicMiddleware.run(rootEpic);

const appWithProvider = (
  <Provider store={store}>
    <Controls />
  </Provider>
);

ReactDOM.render(appWithProvider, document.getElementById("root"));
