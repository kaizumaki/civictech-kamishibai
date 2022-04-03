import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import defaultKeywords from './data/keywords.json';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import {TextField} from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 'auto',
    },
  },
};

const getRandomNumber = (max: number, min: number = 0): number => {
  return Math.floor(Math.random() * (max - min) + min)
};

function App() {
  const [keyword, setKeyword] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [itemSrc, setItemSrc] = useState('');
  const [itemAttribution, setItemAttribution] = useState('');

  const handleChangeKeyword = (e: SelectChangeEvent<typeof selectedKeywords>) => {
    const {
      target: { value },
    } = e;
    setSelectedKeywords(
      typeof value === 'string' ? value.split(',') : value,
    );
  }

  const handleChangeItem = async () => {
    const keywordArray = [...selectedKeywords, ...keyword.split(',')].filter(v => v);
    const targetKeyword = keywordArray[getRandomNumber(keywordArray.length)].trim();
    const response: any = await axios.get(`https://api.openverse.engineering/v1/images/?q="${targetKeyword}"&license=by,cc0&page_size=50`);
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
          <FormControl sx={{ m: 2, width: '100%', maxWidth: 600 }}>
            <InputLabel id="default-keyword-label">Keyword</InputLabel>
            <Select
              labelId="default-keyword-label"
              id="default-keyword"
              multiple
              value={selectedKeywords}
              onChange={handleChangeKeyword}
              input={<OutlinedInput id="select-default-keyword" label="Keyword" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {defaultKeywords.map((item, index) => (
                <MenuItem
                  key={index}
                  value={item['keyword-en']}
                >
                  {`${item['keyword-ja']}（${item['keyword-en']}）`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 2, width: '100%', maxWidth: 600 }}>
            <TextField
              fullWidth
              label="Additional keywords"
              placeholder="e.g. cat, dog, blue sky"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </FormControl>
        </div>
        <div className="form-item">
          <button
            className="next-button"
            type="button"
            disabled={selectedKeywords.length === 0 && keyword === ''}
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
