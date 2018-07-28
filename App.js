import React, {Component} from 'react';
import {View} from 'react-native';
import MapboxGL from '@mapbox/react-native-mapbox-gl';

export default class App extends Component<Props> {

  async componentWillMount () {
    MapboxGL.setAccessToken("あなたのキー");
  }

  render() {
    return (
      <MapboxGL.MapView
        zoomLevel={14}
        centerCoordinate={[139.766403, 35.681262]}
        styleURL="mapbox://styles/mapbox/streets-v10"
        style={{flex: 1}}
      />
    )
  }
}
