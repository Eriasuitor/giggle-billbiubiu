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
    onUpdate: PropTypes.func.isRequired,
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
    scaleDecimal: 100
  }

  componentWillMount() {
    this.state = {
      x: this.props.sideLength / 2,
      y: this.props.touchRadius
    }
    this.state.sideLengthHalf = this.state.x
    this.state.radius = this.state.x - this.state.y
    this.setState(this.state)
  }

  get addMoveListener() {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.props.trigger = true
      },
      onPanResponderMove: (evt, gestureState) => {
        let angle = Math.atan2(evt.nativeEvent.locationY - this.state.sideLengthHalf, evt.nativeEvent.locationX - this.state.sideLengthHalf)
        angle += Math.PI / 2
        angle < 0 ? angle += Math.PI * 2 : undefined

        if (this.props.trigger) {
          this.props.trigger = false
          if (this.props.angle < angle) this.props.targer = 'integer'
          else this.props.targer = 'decimal'
        }
        if (this.props.targer === 'integer') {
          this.props.integer = Math.floor(angle / Math.PI / 2 * this.props.scaleInteger)

          if (this.props.angle > Math.PI * 7 / 8 && angle < Math.PI / 8) this.props.integer += 100
          else if (this.props.angle < Math.PI / 8 && angle > Math.PI * 7 / 8) this.props.integer -= 100

          return
        }

        this.props.decimal = Math.floor(angle / Math.PI / 2 * this.props.scaleDecimal)

        this.setState({
          x: Math.sin(angle) * this.state.radius + this.state.sideLengthHalf,
          y: this.state.sideLengthHalf - Math.cos(angle) * this.state.radius
        })

        this.props.onUpdate(this.props.integer, this.props.decimal)
      }
    })
  }

  render() {
    return (
      <G width={this.props.sideLength} height={this.props.sideLength}>
        <Circle cx={this.state.sideLengthHalf} cy={this.state.sideLengthHalf} r={this.state.radius} fill="none" stroke="pink" strokeWidth={this.props.strokeWidth} strokeOpacity="0.3" />
        <Circle cx={this.state.x} cy={this.state.y} r={this.props.touchRadius} fill="pink" {...this.addMoveListener.panHandlers} />
       
      </G>
    )
  }
}