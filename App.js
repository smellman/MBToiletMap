import React, {Component} from 'react';
// 1: 省略していたStyleSheetなどを追加
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import MapboxGL from '@mapbox/react-native-mapbox-gl';

export default class App extends Component<Props> {

  // 2: MapboxGL.MapViewへの参照
  mapView = null

  constructor(props) {
    super(props)
    this.state = {
      elements: [],
    }
  }

  async componentWillMount () {
    MapboxGL.setAccessToken("アクセストークン");
  }

  // 3: 8章のトイレマップから関数をコピー
  fetchToilet = async () => {
    // 4: 範囲だけはMapboxGL.MapViewの関数から直接取得するようにする
    const bounds = await this.mapView.getVisibleBounds()
    const south = bounds[1][1]
    const west = bounds[1][0]
    const north = bounds[0][1]
    const east = bounds[0][0]
    const body = `
    [out:json];
    (
      node
        [amenity=toilets]
        (${south},${west},${north},${east});
      node
        ["toilets:wheelchair"=yes]
        (${south},${west},${north},${east});
    );
    out;
    `
    const options = {
      method: 'POST',
      body: body
    }
    try {
      const response = await fetch('https://overpass-api.de/api/interpreter', options)
      const json = await response.json()
      this.setState({elements: json.elements})
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    // 5: トイレマップ同様の実装を行う
    return (
      <View style={styles.container}>
        { /* 6: refとstyleを追加 */}
        <MapboxGL.MapView
          ref={mapView => this.mapView = mapView}
          zoomLevel={14}
          centerCoordinate={[139.766403, 35.681262]}
          styleURL="mapbox://styles/mapbox/streets-v10"
          style={styles.mapview}
        >
          {
            this.state.elements.map((element) => {
              let title = "トイレ"
              if (element.tags["name"] !== undefined) {
                title = element.tags["name"]
              }
              // 7: マーカーの代わりにPointAnnotationを利用
              return (
                <MapboxGL.PointAnnotation
                  coordinate={[element.lon, element.lat]}
                  title=""
                  key={"id_" + element.id}
                  id={"id_" + element.id}
                >
                  { /* 8: マーカーに相当するものがないのでViewでポイントを表示する */ }
                  <View style={styles.annotationContainer}>
                    <View style={styles.annotationFill} />
                  </View>
                  { /* 9: PointAnnotationをタップした時のCalloutを指定する */ }
                  <MapboxGL.Callout title={title} />
                </MapboxGL.PointAnnotation>
              )
            })
          }
        </MapboxGL.MapView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.fetchToilet()}
            style={styles.button}
          >
            <Text style={styles.buttonItem}>トイレ取得</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

// 10: スタイルは元のトイレマップからコピー
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  mapview: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  button: {
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  buttonItem: {
    textAlign: 'center'
  },
  // 11: annotation用のスタイルを定義
  annotationContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  annotationFill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'orange',
    transform: [{ scale: 0.6 }],
  },
});
