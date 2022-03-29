import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const getRandomNumber = (max: number, min: number = 0): number => {
  return Math.floor(Math.random() * (max - min) + min)
};

function App() {
  const [keyword, setKeyword] = useState('');
  const [itemSrc, setItemSrc] = useState('');
  const [itemAttribution, setItemAttribution] = useState('');

  async function handleChangeItem() {
    const keywordArray = keyword.split(',');
    const selectedKeyword = keywordArray[getRandomNumber(keywordArray.length)].trim();
    const response: any = await axios.get(`https://api.openverse.engineering/v1/images/?q="${selectedKeyword}"&license=by,cc0&page_size=50`);
    const results = response.data.results;
    const url = results[getRandomNumber(results.length)].detail_url;
    const updatedURL = url.replace(/^http:\/\//i, 'https://');
    const targetItem: any = await axios.get(updatedURL);
    setItemSrc(targetItem.data.url);
    setItemAttribution(targetItem.data.attribution);
  }

  return (
    <div className="App">
      <div className="presentation">
        <div className="presentation__image__outer">
          <img className="presentation__image" src={itemSrc} alt="" />
        </div>
        <p className="presentation__text">
          {itemAttribution}
        </p>
      </div>
      <div className="form-container">
        <div className="form-item">
          <input
            className="keyword-field"
            type="text"
            placeholder="e.g. democracy, open source, blue sky"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="form-item">
          <button
            className="next-button"
            type="button"
            disabled={keyword === ''}
            onClick={() => handleChangeItem()}
          >
            Next!
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
