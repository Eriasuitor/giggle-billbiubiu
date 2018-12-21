/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  ScrollView,
  PanResponder
} from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  G,
  Text,
  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,
  Image,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
} from 'react-native-svg';
import { range } from 'lodash'

export default class BillBiuBiu2 extends Component {

  static defaultProps = {
    radius: 50,
    width: 120,
    height: 120,
    widthHalf: 60,
    heightHalf: 60,
    touchRadius: 7,
    scale: 100
  }

  constructor(props) {
    super(props);
    this.state = {
      position: {
        charge: {
          startX: 0,
          startY: 0,
          yuan: {
            value: 0,
            addition: 0
          },
          cent: {
            value: 0,
            addition: 0
          },
          x: this.props.widthHalf,
          y: this.props.heightHalf - this.props.radius,
          trigger: false
        }
      }
    };
    this.moveListener = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {

        this.state.position.charge.trigger = true

        let angle = Math.atan2(evt.nativeEvent.locationY - this.props.heightHalf, evt.nativeEvent.locationX - this.props.widthHalf)
        angle += Math.PI / 2
        angle < 0 ? angle += Math.PI * 2 : undefined
        this.state.position.charge.angle = angle


      },
      onPanResponderMove: (evt, gestureState) => {

        let angle = Math.atan2(evt.nativeEvent.locationY - this.props.heightHalf, evt.nativeEvent.locationX - this.props.widthHalf)
        angle += Math.PI / 2
        angle < 0 ? angle += Math.PI * 2 : undefined

        if (this.state.position.charge.trigger) {
          this.state.position.charge.trigger = false
          if (this.state.position.charge.angle < angle) this.state.position.charge.operate = this.state.position.charge.yuan
          else this.state.position.charge.operate = this.state.position.charge.cent
        }
        if (this.state.position.charge.operate === this.state.position.charge.yuan)
          if (this.state.position.charge.angle > Math.PI * 7 / 8 && angle < Math.PI / 8) this.state.position.charge.operate.addition++
          else if (this.state.position.charge.angle < Math.PI / 8 && angle > Math.PI * 7 / 8) this.state.position.charge.operate.addition--

        this.state.position.charge.angle = angle  

        this.state.position.charge.operate.value = Math.floor(angle / Math.PI / 2 * this.props.scale) + this.state.position.charge.operate.addition * this.props.scale
        this.state.position.charge.x = Math.sin(angle) * this.props.radius + this.props.widthHalf
        this.state.position.charge.y = this.props.heightHalf - Math.cos(angle) * this.props.radius
        this.setState(this.state)
      }
    })
  }

  componentWillMount() {

  }



  render() {
    return (
      <View style={{ padding: 100 }}>
        <Svg width={this.props.width} height={this.props.height}>
          <Text>{this.state.position.charge.yuan.value} -- {this.state.position.charge.cent.value} -- {this.state.position.charge.angle}</Text>
          <Circle cx={this.props.widthHalf} cy={this.props.heightHalf} r={this.props.radius} fill="none" stroke="pink" strokeWidth="10" strokeOpacity="0.3" />
          <Circle cx={this.state.position.charge.x} cy={this.state.position.charge.y} r={this.props.touchRadius} fill="pink" {...this.moveListener.panHandlers} />
        </Svg>
      </View>
      /**   
      <View
        style={styles.container}
        onStartShouldSetResponder={(evt) => true}
        onMoveShouldSetResponder={(evt) => true}
        onResponderMove={evt => {
          let x = evt.nativeEvent.locationX - 50,
            y = evt.nativeEvent.locationY - 50,
            sc = 45 / Math.pow(Math.pow(x, 2) + Math.pow(y, 2), 0.5),
            na = Math.atan(y / x)

          this.state.value2 = na

          if (x > 0 && y > 0) this.state.value1 = na / 2 / Math.PI * 100
          if (x < 0 && y > 0) this.state.value1 = (Math.PI + na) / 2 / Math.PI * 100
          if (x < 0 && y < 0) this.state.value1 = (Math.PI + na) / 2 / Math.PI * 100
          if (x > 0 && y < 0) this.state.value1 = (na) / 2 / Math.PI * 100

          this.state.value1 = Math.floor(this.state.value1) + 25
          this.state.a = x * sc + 50
          this.state.b = y * sc + 50
          if (this.state.a < 50) this.state.big = 1
          else this.state.big = 0
          this.setState(this.state)
        }}
      >
        <Svg
          height="105"
          width="105"
        >
          <Text>{this.state.value1}</Text>
          <Text y="20">{this.state.value2}</Text>

          <Circle cx="50" cy="50" r="45" fill="none" stroke="pink" strokeWidth="10" strokeOpacity="0.3" />
          <Path d={"M50 5 A45 45 0 " + this.state.big + " 1 " + this.state.a + " " + this.state.b} fill="none" stroke="pink" strokeWidth="9" strokeLinecap="round" />
          <Circle cx={this.state.a} cy={this.state.b} r="7" fill="pink" onPress={(s) => alert('a?' + Object.keys(s))} />
        </Svg>
      </View>**/
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('BillBiuBiu2', () => BillBiuBiu2);
