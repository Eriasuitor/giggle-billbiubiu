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
  PanResponder,
  MaskedViewIOS,
  Modal,
  Image,
  TouchableHighlight,
  Text as TextOrigin
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
  // Image,
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

export default class BillBiuBiu extends Component {

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
      modalVisible: true,
      wallet: {
        charge2: {
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
          trigger: false,
          detail: false

        },
        charge3: {
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
          trigger: false,
          detail: true

        },
        charge4: {
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
          trigger: false,
          detail: false

        },
        charge5: {
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
          trigger: false,
          detail: false

        },
        charge6: {
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
          trigger: false,
          detail: false
        }
      }
    };
  }

  componentWillMount() {

  }

  addRotateListener(walletName) {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.state.wallet[walletName].retateStart = evt.nativeEvent.locationX
      },
      onPanResponderRelease: (evt, gestureState) => {
        alert(1)
        if (Math.abs(this.state.wallet[walletName].retateStart, evt.nativeEvent.locationX) > 5) {
          this.state.wallet[walletName].detail = !this.state.wallet[walletName].detail
        }
      },
    })
  }

  addMoveListener(walletName) {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {

        this.state.wallet[walletName].trigger = true

        let angle = Math.atan2(evt.nativeEvent.locationY - this.props.heightHalf, evt.nativeEvent.locationX - this.props.widthHalf)
        angle += Math.PI / 2
        angle < 0 ? angle += Math.PI * 2 : undefined
        this.state.wallet[walletName].angle = angle
      },
      onPanResponderMove: (evt, gestureState) => {

        let angle = Math.atan2(evt.nativeEvent.locationY - this.props.heightHalf, evt.nativeEvent.locationX - this.props.widthHalf)
        angle += Math.PI / 2
        angle < 0 ? angle += Math.PI * 2 : undefined

        if (this.state.wallet[walletName].trigger) {
          this.state.wallet[walletName].trigger = false
          if (this.state.wallet[walletName].angle < angle) this.state.wallet[walletName].operate = this.state.wallet[walletName].yuan
          else this.state.wallet[walletName].operate = this.state.wallet[walletName].cent
        }
        if (this.state.wallet[walletName].operate === this.state.wallet[walletName].yuan)
          if (this.state.wallet[walletName].angle > Math.PI * 7 / 8 && angle < Math.PI / 8) this.state.wallet[walletName].operate.addition++
          else if (this.state.wallet[walletName].angle < Math.PI / 8 && angle > Math.PI * 7 / 8) this.state.wallet[walletName].operate.addition--

        this.state.wallet[walletName].angle = angle

        this.state.wallet[walletName].operate.value = Math.floor(angle / Math.PI / 2 * this.props.scale) + this.state.wallet[walletName].operate.addition * this.props.scale
        this.state.wallet[walletName].x = Math.sin(angle) * this.props.radius + this.props.widthHalf
        this.state.wallet[walletName].y = this.props.heightHalf - Math.cos(angle) * this.props.radius
        this.setState(this.state)

      }
    })
  }

  render() {
    return (
      <View style={{ marginTop: 40, flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
        {
          Object.keys(this.state.wallet).map(_w => {
            return (
              <Svg key={_w} width={this.props.width} height={this.props.height}>
                <Circle cx={this.props.widthHalf} cy={this.props.heightHalf} r={this.props.radius} fill="none" stroke="pink" strokeWidth="10" strokeOpacity="0.3" />
                <Circle cx={this.state.wallet[_w].x} cy={this.state.wallet[_w].y} r={this.props.touchRadius} fill="pink" {...this.addMoveListener(_w).panHandlers} />
                <G x={this.props.widthHalf} y={this.props.heightHalf} {...this.addRotateListener(_w).panHandlers}>
                  <Circle r={this.props.radius - 10} opacity='0' ></Circle>
                  <G>
                    <Text textAnchor='middle' y='-30' fontSize='24'>{this.state.wallet[_w].yuan.value}.{this.state.wallet[_w].cent.value}</Text>
                    <Text textAnchor='middle' fontSize='10'>Balance</Text>
                    <Text textAnchor='middle' y='10'>{this.state.wallet[_w].yuan.value || 1023}.{this.state.wallet[_w].cent.value || 49}</Text>
                  </G>
                </G>
              </Svg>
            )
          })
        }
        <View style={styles.menu}>
          <View style={styles.button}>
            <TextOrigin style={styles.option}>Bill</TextOrigin>
          </View>
          <View style={styles.button}>
            <TextOrigin style={styles.option}>Wallet</TextOrigin>
          </View>
          <View style={styles.button}>
            <TextOrigin style={styles.option}>Resume</TextOrigin>
          </View>
        </View>
      </View>
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
  option: {
    fontSize: 12
  },
  menu: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'black',
    bottom: 0,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    //  justifyContent: 'space-between',
    paddingBottom: 30
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'pink',
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

AppRegistry.registerComponent('BillBiuBiu', () => BillBiuBiu);
