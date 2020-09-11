// CSS imported here will be bundled by webpack
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './app';

ReactDOM.render(<App />, document.querySelector('#root'));
