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
    balance: PropTypes.number.isRequired,
    strokeWidthHalf: PropTypes.number,
    sideLengthHalf: PropTypes.number,
    radius: PropTypes.number,
    target: PropTypes.string,
    integer: PropTypes.number,
    decimal: PropTypes.number,
    name: PropTypes.string
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
      decimal: 0,
      color: 'pink'
    }
    this.setState(this.state)
  }

  get addRotateListener() {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.state.retateStart = evt.nativeEvent.locationX
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (Math.abs(this.state.retateStart - evt.nativeEvent.locationX) > 30) {
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
        <CircularSlider color={this.state.color} onUpdate={(integer, decimal) => { this.setState({ integer, decimal }) }}></CircularSlider>
        <G x={this.state.sideLengthHalf} y={this.state.sideLengthHalf} {...this.addRotateListener.panHandlers}  >
          {
            this.state.showDetail ? (<G>
              <Text textAnchor='middle' y='-35' fontSize='10'>{this.props.name}</Text>
              <Text textAnchor='middle' y='-25' fontSize='24'>{this.state.integer}.{this.state.decimal}</Text>
              <Text textAnchor='middle' fontSize='10'>Balance</Text>
              <Text textAnchor='middle' y='10'>{this.props.balance}</Text>
              <Circle r={this.state.radius - 10} opacity='0' onPress={() => { this.props.onClick(this.state.integer, this.state.decimal, this.state.color) }} />
            </G>) : (<G>
              <Text textAnchor='middle' y='-35' fontSize='10'>{this.props.name}</Text>
              <Circle r={this.state.radius - 10} opacity='0' onPress={() => { }} />
              <Circle y='-10' r='4' fill='pink' opacity='0.3' onPress={() => this.setState({ color: 'pink' })} />
              <Circle y='-10' x='-15' r='4' fill='grey' opacity='0.3' onPress={() => this.setState({ color: 'grey' })} />
              <Circle y='-10' x='15' r='4' fill='purple' opacity='0.3' onPress={() => this.setState({ color: 'purple' })} />
              <Circle y='-10' x='-30' r='4' fill='red' opacity='0.3' onPress={() => this.setState({ color: 'red' })} />
              <Circle y='-10' x='30' r='4' fill='green' opacity='0.3' onPress={() => this.setState({ color: 'green' })} />
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