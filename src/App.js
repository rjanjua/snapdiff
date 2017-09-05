import React, { Component } from 'react';
import logo from './logo.svg';
import ImageDiff from 'react-image-diff';
import './App.css';

const bigRed = {
  background: 'red',
  height: '100px',
  width: '100px'
}

const bigGreen = {
  background: 'green',
  height: '100px',
  width: '100px'
}

class App extends Component {

  constructor() {
    super();
    function importAll(r) {
      let images = {};
      r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
      return images;
    }
    const imgs = importAll(require.context('./snapshots', false, /\.(png)$/));
    const imgs1 = importAll(require.context('./snapshots/tmp', false, /\.(png)$/));
    const keys = Object.keys(imgs);
    this.state = {
      baselineImages: imgs,
      newImages: imgs1,
      imageKeys: keys,
      imageIndex: 0,
      type: 'fade',
      value: .5,
      approveStyle: bigRed
    };
  }

  handleNext = (e) => {
    console.log('next');
    const imgIndex = this.state.imageIndex >= this.state.imageKeys.length-1 ? 0 : this.state.imageIndex+1;
    this.setState({
      imageIndex: imgIndex
    })
  }

  handleInputChange = (e) => {
    this.setState({
      value: parseFloat(e.target.value)
    });
  }

  handleButtonEnter = (e) => {
    this.setState({
      approveStyle: bigGreen
    });
  }

  handleButtonLeave = (e) => {
    this.setState({
      approveStyle: bigRed
    });
  }

  handleRadioChange = (e) => {
    console.log(e.target.value)
    this.setState({type: e.target.value});
  }

  handleApprove = (e) => {
    console.log('approve!!!')
  }


  render() {
    const key = this.state.imageKeys[this.state.imageIndex];
    const images = {
      before: this.state.baselineImages[key],
      after: this.state.newImages[key] 
    };

    return (
      <div>
        <h1>{key.replace('.png', "")}</h1>
          <input style={this.state.approveStyle} name='approve' type='button' value='approve' onClick={this.handleApprove} onMouseEnter={this.handleButtonEnter} onMouseLeave={this.handleButtonLeave}/>
            <br />
          <input name='next' type='button' value='next' onClick={this.handleNext} />
          <br />
          <label>
            <input checked={this.state.type === 'swipe'} name='type' type='radio' value='swipe' onChange={this.handleRadioChange} />
            swipe
          </label>
          <label>
            <input checked={this.state.type === 'fade'} name='type' type='radio' value='fade' onChange={this.handleRadioChange} defaultChecked />
            fade
          </label>
          <label>
            <input checked={this.state.type === 'difference'} name='type' type='radio' value='difference' onChange={this.handleRadioChange} />
            difference
          </label>
          <br/>
          <input
            type='range'
            defaultValue={this.state.value}
            min={0}
            max={1}
            step={.01}
            onChange={this.handleInputChange}
            disabled={this.state.type === 'difference' ? true : false}
          />
        <div>
          <ImageDiff
            {...images}
            type={this.state.type}
            value={this.state.value}
          />
        </div>
      </div>
    );
  }
}

export default App;
