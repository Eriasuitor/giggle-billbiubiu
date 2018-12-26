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
import { range } from 'lodash'
import { Container, Header, Content, Left, Right, Body, Button, Icon, Title, Form, Item, Input, Label, Text as TextBase, Picker, List, ListItem } from 'native-base';
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
      modalVisible: false,
      modalVisible2: true,
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
        if (Math.abs(this.state.wallet[walletName].retateStart, evt.nativeEvent.locationX) > 5) {
          this.state.wallet[walletName].detail = !this.state.wallet[walletName].detail
          this.setState(this.state)
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
      <View style={{ flex: 1 }}>
        <View style={{ marginTop: 40, flexDirection: 'row', flexWrap: 'wrap' }}>
          {
            Object.keys(this.state.wallet).map(_w =>
              (
                <Svg key={_w} width={this.props.width} height={this.props.height}>
                  <Circle cx={this.props.widthHalf} cy={this.props.heightHalf} r={this.props.radius} fill="none" stroke="pink" strokeWidth="10" strokeOpacity="0.3" />
                  <Circle cx={this.state.wallet[_w].x} cy={this.state.wallet[_w].y} r={this.props.touchRadius} fill="pink" {...this.addMoveListener(_w).panHandlers} />
                  <G x={this.props.widthHalf} y={this.props.heightHalf} {...this.addRotateListener(_w).panHandlers}>
                    <Circle r={this.props.radius - 10} opacity='0' ></Circle>
                    {
                      this.state.wallet[_w].detail ? (<G>
                        <Text textAnchor='middle' y='-30' fontSize='24'>{this.state.wallet[_w].yuan.value}.{this.state.wallet[_w].cent.value}</Text>
                        <Text textAnchor='middle' fontSize='10'>Balance</Text>
                        <Text textAnchor='middle' y='10'>{this.state.wallet[_w].yuan.value || 1023}.{this.state.wallet[_w].cent.value || 49}</Text>
                      </G>) : (<G></G>)
                    }
                  </G>
                </Svg>
              )
            )
          }
        </View>
        <View style={styles.menu}>
          <View style={styles.button}>
            <TextOrigin style={styles.option}>Bill</TextOrigin>
          </View>
          <View style={styles.button}
            // onStartShouldSetResponder = {() => true}
            // onStartShouldSetResponderCapture = {() => true}
            onTouchStart={() => {
              this.state.modalVisible = true
              this.setState(this.state)
            }}>
            <TextOrigin style={styles.option}>Wallet</TextOrigin>
          </View>
          <View style={styles.button}>
            <TextOrigin style={styles.option}>Resume</TextOrigin>
          </View>
        </View>
        {
          this.state.modalVisible ? (
            <View style={styles.model}>
              <Container>
                <Header style={{
                  // borderTopLeftRadius: 25, borderTopRightRadius: 25, height: 50 
                }}>
                  <Left>
                    <Button transparent onPress={() => {
                      // alert(2)
                      this.state.modalVisible = false
                      this.setState(this.state)
                    }}>
                      <TextBase>Cancel</TextBase>
                    </Button>
                  </Left>
                  <Body>
                    <Title>Add Wallet</Title>
                  </Body>
                  <Right>
                    <Button transparent>
                      <TextBase>Add</TextBase>
                    </Button>
                  </Right>
                </Header>
                <Content>
                  <Form>
                    <Item inlineLabel>
                      <Label>Wallet Name</Label>
                      <Input />
                    </Item>
                    <Item itemPicker inlineLabel>
                      <Label>Collection</Label>
                      <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="ios-arrow-down-outline" />}
                        style={{ width: undefined }}
                        placeholder="Select your SIM"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue='key0'
                      >
                        <Picker.Item label="Wallet" value="key0" />
                        <Picker.Item label="ATM Card" value="key1" />
                        <Picker.Item label="Debit Card" value="key2" />
                        <Picker.Item label="Credit Card" value="key3" />
                        <Picker.Item label="Net Banking" value="key4" />
                      </Picker>
                    </Item>
                    <Item inlineLabel>
                      <Label>Amount</Label>
                      <Input keyboardType='numeric' />
                    </Item>
                    <Item itemPicker inlineLabel>
                      <Label>Way of Resume</Label>
                      <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="ios-arrow-down-outline" />}
                        style={{ width: undefined }}
                        placeholder="Select your SIM"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue='key0'
                      >
                        <Picker.Item label="To Limit" value="key0" />
                        <Picker.Item label="Add" value="key1" />
                      </Picker>
                    </Item>
                  </Form>
                </Content>
              </Container>
            </View>
          ) : null
        }
        {
          this.state.modalVisible2 ? (
            <View style={styles.model}>

            <Container>
              <Header>
              <Left>
                    <Button transparent onPress={() => {
                      // alert(2)
                      this.state.modalVisible2 = false
                      this.setState(this.state)
                    }}>
                      <TextBase>Back</TextBase>
                    </Button>
                  </Left>
                  <Body>
                    <Title>Bill</Title>
                  </Body>
                  <Right>
                  </Right>
                </Header>
              <Content>
                <List
                  leftOpenValue={75}
                  rightOpenValue={-75}
                  dataSource={(new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })).cloneWithRows([
                    'Simon Mignolet',
                    'Nathaniel Clyne',
                    'Dejan Lovren',
                    'Mama Sakho',
                    'Alberto Moreno',
                    'Emre Can',
                    'Joe Allen',
                    'Phil Coutinho',
                  ])}
                  renderRow={data =>
                    <ListItem>
                      <Text> {data}1 </Text>
                    </ListItem>}
                  renderLeftHiddenRow={data =>
                    <Button full onPress={() => alert(data)}>
                      <Icon active name="information-circle" />
                    </Button>}
                  renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                    <Button full danger onPress={() => {}}>
                      <Icon active name="trash" />
                    </Button>}
                />
              </Content>
            </Container>
            </View>
          ) : null
        }
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
  model: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    // left: '10%',
    // top: '5%',
    // borderRadius: 30,
    backgroundColor: 'white',
  },
  modelTitle: {
    fontSize: 20,
    textAlign: 'center',
    width: '80%',
    marginTop: 10

  },
  modelInput: {
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
    padding: 3,
    borderWidth: 0,
    borderBottomWidth: 10
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
