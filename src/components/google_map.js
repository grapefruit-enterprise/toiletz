import React from 'react';
import {Component} from 'react';
import ReactDOM from 'react-dom';
import {Gmaps, Marker, InfoWindow, Circle} from 'react-gmaps';
import axios from 'axios';
import { selectToiletFromMap } from '../actions/index.js';
import { bindActionCreators } from 'redux';
// import API_KEY from '../../keys.js';

import {connect} from 'react-redux';

const image = '../src/assets/toilet_icon.png';

export default class SimpleMap extends Component{
  constructor(props) {
    super(props);
    this.state = { hide: true,
                  current: null,
                  currentAddress: null
                };
  }

  onMapCreated(map) {
    map.setOptions({
      disableDefaultUI: false,
      streetViewControl: true,
      streetViewControlOptions:true,
      zoomControl:true,
      zoomControlOptions: true,
      panControl:true,
      panControlOptions: true
    });
  }

  onDragEnd(e) {
    console.log('onDragEnd', e);
  }

  onCloseClick(index) {
    this.setState({
      ['marker' + index]: false,
      current: null
    });
  }

  onClick(e) {
    let curr = this.state.current;
    if (curr) {
      this.setState({ ['marker' + curr]: false, current: null });
    }
    this.props.selectToiletFromMap(this.props.toilets[e])
    .then( (data) => {
      this.setState({
        ['marker' + e]: true,
        current: e,
        currentAddress: data.payload.address
      })
    })
    .catch( (err) => {
      console.log('error:', err);
    });
  }


  renderMarkers() {
    return this.props.toilets.map((toilet, index) => {
      return (
        <Marker
          key={index}
          lat={toilet.latitude}
          lng={toilet.longitude}
          title={toilet.description}
          draggable={false}
          icon = {image}
          onClick={this.onClick.bind(this, index)}
        />
      )
    })
  }

  renderInfoWindows() {
    return this.props.toilets.map((toilet, index) => {
      if (!this.state['marker' + index]) {
        return (null);
      } else {
        let addy = toilet.address;
        let loc = `${toilet.latitude},${toilet.longitude}`;
        let url = `https://maps.googleapis.com/maps/api/streetview?size=300x200&location=${addy}&pitch=-0.90&key=${API_KEY.maps}`
        return (
          <InfoWindow
            style={{'border':'1px black solid'}}
            className='testclass'
            key={index}
            lat={toilet.latitude}
            lng={toilet.longitude}
            content={'<div class="infowindow"><img src="' + url + '" style="border:1px black solid"/><div>' + toilet.name+' -- '+toilet.description+' -- '+toilet.address + '</div></div>' }
            onCloseClick={this.onCloseClick.bind(this, index)}
          />
        )
      }
    });
  }


  render() {
    if(!this.props.toilets){
      return null;
    }
    if(typeof this.props.toilets === "string"){
      console.log("inside if")
      return (
        <div>
        <h3>{this.props.toilets}</h3>
        </div>
      )
    }

    return (
        <Gmaps
          width={'1200px'}
          height={'600px'}
          lat={this.props.origin.latitude}
          lng={this.props.origin.longitude}
          zoom={13}
          loadingMessage={'Loading...'}
          params={{v: '3.exp', key: 'AIzaSyB85KqmtnH-PdxoaFTRZRWZJLI6H48oa-Q'}}
          onMapCreated={this.onMapCreated}
        >
          {this.renderMarkers()}
          {this.renderInfoWindows()}
        </Gmaps>
    );
  }
};


function mapStateToProps(state){
  return{
    toilets:state.toilets,
    origin: state.search //from rootReducer (index.js in reducers)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ selectToiletFromMap }, dispatch);
}


export default connect (mapStateToProps, mapDispatchToProps)(SimpleMap);
