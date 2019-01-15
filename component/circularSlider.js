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

export default class CircularSlider extends Component {

  static propTypes = {
    strokeWidth: PropTypes.number,
    sideLength: PropTypes.number,
    touchRadius: PropTypes.number,
    scaleInteger: PropTypes.number,
    scaleDecimal: PropTypes.number,
    color: PropTypes.string,
    onUpdate: PropTypes.func
  }

  static defaultProps = {
    strokeWidth: 10,
    sideLength: 110,
    touchRadius: 7,
    scaleInteger: 100,
    scaleDecimal: 100,
    color: 'pink',
    onUpdate: () => { }
  }

  componentWillMount() {
    this.state = {
      x: this.props.sideLength / 2,
      y: this.props.touchRadius
    }
    this.state.integer = 0
    this.state.decimal = 0
    this.state.integerHundred = 0
    this.state.angle = 0
    this.state.sideLengthHalf = this.state.x
    this.state.radius = this.state.x - this.state.y
    this.setState(this.state)
  }

  get addMoveListener() {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.state.trigger = true
      },
      onPanResponderMove: (evt, gestureState) => {
        let angle = Math.atan2(evt.nativeEvent.locationY - this.state.sideLengthHalf, evt.nativeEvent.locationX - this.state.sideLengthHalf)
        angle += Math.PI / 2
        angle < 0 ? angle += Math.PI * 2 : undefined
        if (this.state.trigger) {
          this.state.trigger = false
          if (this.state.angle < angle) this.state.target = 'integer'
          else this.state.target = 'decimal'
        }
        if (this.state.target === 'integer') {
          this.state.integer = Math.floor(angle / Math.PI / 2 * this.props.scaleInteger)

          if (this.state.angle > Math.PI * 7 / 4 && angle < Math.PI / 4) this.state.integerHundred += 100
          else if (this.state.angle < Math.PI / 4 && angle > Math.PI * 7 / 4) this.state.integerHundred -= 100
        }
        else {
          this.state.decimal = Math.floor(angle / Math.PI / 2 * this.props.scaleDecimal)
        }

        this.setState({
          x: Math.sin(angle) * this.state.radius + this.state.sideLengthHalf,
          y: this.state.sideLengthHalf - Math.cos(angle) * this.state.radius,
        })
        this.state.angle = angle
        this.props.onUpdate(this.state.integer + this.state.integerHundred, this.state.decimal)
      }
    })
  }

  render() {
    return (
      <G width={this.props.sideLength} height={this.props.sideLength}>
        <Circle cx={this.state.sideLengthHalf} cy={this.state.sideLengthHalf} r={this.state.radius} fill="none" stroke={this.props.color} strokeWidth={this.props.strokeWidth} strokeOpacity="0.3" />
        <Circle cx={this.state.x} cy={this.state.y} r={this.props.touchRadius} fill={this.props.color} {...this.addMoveListener.panHandlers} />
      </G>
    )
  }
}