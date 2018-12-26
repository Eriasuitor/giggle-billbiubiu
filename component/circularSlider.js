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
    sideLength: 120,
    touchRadius: 7,
    scaleInteger: 100,
    scaleDecimal: 100
  }

  constructor(props) {
    super(props)
    
  }

  componentWillMount(){
    this.props.strokeWidthHalf = this.props.strokeWidth / 2
    this.props.sideLengthHalf = this.props.strokeWidthHalf
    this.props.strokeWidth =1000
    alert(JSON.stringify(this.props))
    this.state = {
      x: this.props.sideLengthHalf,
      y: this.props.strokeWidthHalf
    }
  }

  get addMoveListener() {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.props.trigger = true
      },
      onPanResponderMove: (evt, gestureState) => {
        let angle = Math.atan2(evt.nativeEvent.locationY - this.props.sideLengthHalf, evt.nativeEvent.locationX - this.props.sideLengthHalf)
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
          x: Math.sin(angle) * this.props.radius + this.props.sideLengthHalf,
          y: this.props.sideLengthHalf - Math.cos(angle) * this.props.radius
        })

        this.props.onUpdate(this.props.integer, this.props.decimal)
      }
    })
  }

  render() {
    return (
      <Svg width={this.props.sideLength} height={this.props.sideLength}>
        <Circle cx={this.props.sideLengthHalf} cy={this.props.sideLengthHalf} r={this.props.radius} fill="none" stroke="pink" strokeWidth={this.props.strokeWidth} strokeOpacity="0.3" />
        <Circle cx={this.props.x} cy={this.props.y} r={this.props.touchRadius} fill="black" {...this.addMoveListener.panHandlers} />
        {/* <G x={this.props.sideLengthHalf} y={this.props.sideLengthHalf} {...this.addRotateListener(this.props._walletName).panHandlers}>
                    <Circle r={this.props.radius - 10} opacity='0' ></Circle>
                    {
                        this.props.wallet[this.props._walletName].detail ? (<G>
                            <Text textAnchor='middle' y='-30' fontSize='24'>{this.props.wallet[this.props._walletName].yuan.value}.{this.props.wallet[this.props._walletName].cent.value}</Text>
                            <Text textAnchor='middle' fontSize='10'>Balance</Text>
                            <Text textAnchor='middle' y='10'>{this.props.wallet[this.props._walletName].yuan.value || 1023}.{this.props.wallet[this.props._walletName].cent.value || 49}</Text>
                        </G>) : (<G></G>)
                    }
                </G> */}
      </Svg>
    )
  }
}