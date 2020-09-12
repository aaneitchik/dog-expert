import './app.css';

import React from 'react';

import ImageUpload from './components/image-upload';

const App = (): JSX.Element => {
  return (
    <div className="app">
      <ImageUpload />
    </div>
  );
};

export default App;
