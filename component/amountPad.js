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
    onClick: PropTypes.func,
    balance: PropTypes.number,
    name: PropTypes.string,
    touchRadius: PropTypes.number,
    colors: PropTypes.array,
    strokeWidth: PropTypes.number,
    sideLength: PropTypes.number,
    scaleInteger: PropTypes.number,
    scaleDecimal: PropTypes.number,
    color: PropTypes.object
  }

  static defaultProps = {
    onClick: () => { },
    strokeWidth: 10,
    sideLength: 110,
    touchRadius: 7,
    scaleInteger: 100,
    scaleDecimal: 100,
    colors: [
      { value: '粉', rgba: 'pink' },
      { value: '灰', rgba: 'grey' },
      { value: '紫', rgba: 'purple' },
      { value: '红', rgba: 'red' },
      { value: '绿', rgba: 'green' }
    ],
    color: { value: '绿', rgba: 'green' }
  }

  componentWillMount() {
    this.state = {
      sideLengthHalf: this.props.sideLength / 2,
      radius: this.props.sideLength / 2 - this.props.touchRadius,
      showDetail: true,
      integer: 0,
      decimal: 0,
      color: this.props.color
    }
    this.setState(this.state)
  }

  get addRotateListener() {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.state.rotateStart = evt.nativeEvent.locationX
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (Math.abs(this.state.rotateStart - evt.nativeEvent.locationX) > 30) {
          return this.setState({
            showDetail: !this.state.showDetail
          })
        }
        this.state.showDetail && this.props.onClick(this.state.integer, this.state.decimal, this.state.color.value)
      },
    })
  }

  render() {
    return (
      <Svg width={this.props.sideLength} height={this.props.sideLength} style={styles.pad}>
        <CircularSlider
          strokeWidth={this.props.strokeWidth}
          sideLength={this.props.sideLength}
          touchRadius={this.props.touchRadius}
          scaleInteger={this.props.scaleInteger}
          scaleDecimal={this.state.scaleDecimal}
          color={this.state.color.rgba} onUpdate={(integer, decimal) => { this.setState({ integer, decimal }) }} />
        <G x={this.state.sideLengthHalf} y={this.state.sideLengthHalf} {...this.addRotateListener.panHandlers}  >
          {
            this.state.showDetail ? (<G>
              <Text textAnchor='middle' y='-35' fontSize='10'>{this.props.name}</Text>
              <Text textAnchor='middle' y='-25' fontSize='24'>{this.state.integer}.{this.state.decimal}</Text>
              <Text textAnchor='middle' y='5' fontSize='10'>余额</Text>
              <Text textAnchor='middle' y='15'>{this.props.balance}</Text>
              <Circle r={this.state.radius - 10} opacity='0' onPress={() => { this.props.onClick(this.state.integer, this.state.decimal, this.state.color.value) }} />
            </G>) : (<G>
              <Text textAnchor='middle' y='-35' fontSize='10'>{this.props.name}</Text>
              <Circle r={this.state.radius - 10} opacity='0' onPressIn={() => { }} />
              <Circle y='-10' r='6' fill='pink' opacity='0.3' onPressIn={() => this.setState({ color: this.props.colors[0] })} />
              <Circle y='-10' x='-15' r='6' fill='grey' opacity='0.3' onPressIn={() => this.setState({ color: this.props.colors[1] })} />
              <Circle y='-10' x='15' r='6' fill='purple' opacity='0.3' onPressIn={() => this.setState({ color: this.props.colors[2] })} />
              <Circle y='-10' x='-30' r='6' fill='red' opacity='0.3' onPressIn={() => this.setState({ color: this.props.colors[3] })} />
              <Circle y='-10' x='30' r='6' fill='green' opacity='0.3' onPressIn={() => this.setState({ color: this.props.colors[4] })} />
            </G>)
          }
        </G>
      </Svg>
    )
  }
}

const styles = StyleSheet.create({
  pad: {
    margin: 2
  }
})