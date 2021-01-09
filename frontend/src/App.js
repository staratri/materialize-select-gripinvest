import React from 'react'

import { getEntities } from './api'

import './App.css';

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

class App extends React.Component {
  state = {
    isActive: false,
    searchText: '',
    chips: [],
    options: []
  }

  fetchEntities = async (query = '') => {
    const res = await getEntities({
      search: query
    })
    this.setState({ options: res.data.items })
  }

  activateFocus = () => {
    this.setState({ isActive: true })
    this.fetchEntities()
  }

  deactivateFocus = () => {
    if (!this.state.chips.length &&  !this.state.searchText) {
      this.setState({ isActive : false })
    }
  }
  
  searchTextChange = str => {
    this.setState({ searchText: str })
    debounce(() => {
      str && this.fetchEntities(this.state.searchText)
    }, 250)()
  }

  addChip = async chip => {
    const chips = [...this.state.chips]
    !chips.some(el => el === chip) && chips.push(chip)
    this.setState({ chips, options: [], searchText: '' })
  }

  removeChip = async chip => {
    const remainingChips = this.state.chips.filter(el => el !== chip)
    await this.setState({ chips: remainingChips })
    if (this.state.chips.length === 0 && !this.state.searchText) this.deactivateFocus()
  }

  render() {
    return (
      <div className="container">
        <div className="wrapper">
          <div className={`input ${this.state.isActive ? 'active' : ''}`}>
            <label htmlFor="text-input">New Fruit...</label>
            { this.state.chips.map((chip, index) => {
              return (
                <span key={`chip--${chip}--${index}`} className="chip">
                  { chip }
                  <img
                    onClick={() => this.removeChip(chip)} 
                    src="./assets/cancel.png"
                    alt="remove icon"
                    className="icon"
                  />
                </span>
              )
            }) }
            { 
              this.state.options.length ?
              <ul className="options">
                {
                  this.state.options.map((option, index) => (
                    <li
                      key={`option--${option}--${index}`} 
                      onClick={() => this.addChip(option)} 
                      className="item"
                    >
                      {option}
                    </li>
                  ))
                }
              </ul>
              : undefined
            }
            
            <input
              onChange={el => this.searchTextChange(el.target.value)}
              value={this.state.searchText}
              onFocus={this.activateFocus} 
              onBlur={() => this.deactivateFocus()} 
              type="text"
              id="text-input"
            />
          </div>
        </div>
      </div>
    )
  }
}

export default App
