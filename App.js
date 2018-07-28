import React, {Component} from 'react';
import {View} from 'react-native';
// 1: MapboxGL をimportする
import MapboxGL from '@mapbox/react-native-mapbox-gl';

export default class App extends Component<Props> {

  // 2: componentWillMountでアクセストークンを指定する
  async componentWillMount () {
    MapboxGL.setAccessToken("アクセストークン");
  }

  render() {
    // 3: 地図を東京駅を中心に描画する
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
