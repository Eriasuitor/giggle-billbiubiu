import React, { Component } from 'react';
import PropTypes from 'prop-types'
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
  Text as TextOrigin,
  TextInput,
  PickerIOS,
  ListView
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
import CircularSlider from './circularSlider'

export default class AmountPad extends Component {

  static propTypes = {
    onUpdate: PropTypes.func,
    balance: PropTypes.number.isRequired,
    strokeWidthHalf: PropTypes.number,
    sideLengthHalf: PropTypes.number,
    radius: PropTypes.number,
    target: PropTypes.string,
    integer: PropTypes.number,
    decimal: PropTypes.number
  }

  static defaultProps = {
    strokeWidth: 10,
    sideLength: 110,
    touchRadius: 7,
    scaleInteger: 100,
    scaleDecimal: 100,
  }

  componentWillMount() {
    this.state = {
      sideLengthHalf: this.props.sideLength / 2,
      radius: this.props.sideLength / 2 - this.props.touchRadius,
      showDetail: true,
      integer: 0,
      decimal: 0
    }
    this.setState(this.state)
  }

  get addRotateListener() {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        alert('123')

        this.state.retateStart = evt.nativeEvent.locationX
      },
      onPanResponderRelease: (evt, gestureState) => {
        alert(this.state.retateStar)
        if (Math.abs(this.state.retateStart, evt.nativeEvent.locationX) > 5) {
          this.setState({
            showDetail: !this.state.showDetail
          })
        }
      },
    })
  }

  render() {
    return (
      <Svg width={this.props.sideLength} height={this.props.sideLength} style={styles.pad}>
        <G x={this.state.sideLengthHalf} y={this.state.sideLengthHalf} {...this.addRotateListener.panHandlers}>
          <Circle r={this.state.radius - 10} opacity='1' ></Circle>
          {
            this.state.showDetail ? (<G>
              <Text textAnchor='middle' y='-30' fontSize='24'>{this.state.integer}.{this.state.decimal}</Text>
              <Text textAnchor='middle' fontSize='10'>Balance</Text>
              <Text textAnchor='middle' y='10'>{this.props.balance}</Text>
            </G>) : (<G></G>)
          }
        </G>
        <CircularSlider onUpdate={(integer, decimal) => { }}></CircularSlider>
      </Svg>
    )
  }
}

const styles = StyleSheet.create({
  pad: {
    margin: 2
  }
})