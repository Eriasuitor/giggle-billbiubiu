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

import AmountPad from './component/amountPad'
import Notification from './component/notification'
import NewWallet from './page/newWallet'

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
      modalVisible2: false,
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

  addRotateListener(walletName) {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.props.wallet[walletName].retateStart = evt.nativeEvent.locationX
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (Math.abs(this.props.wallet[walletName].retateStart, evt.nativeEvent.locationX) > 5) {
          this.props.wallet[walletName].detail = !this.props.wallet[walletName].detail
          this.setState(this.props)
        }
      },
    })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Notification ref='notificationPad' />
        <NewWallet />
        <View style={{ marginTop: 40, flexDirection: 'row', flexWrap: 'wrap' }}>
          {
            Object.keys(this.state.wallet).map(_w => (<AmountPad key={_w} balance={2310.91} onClick={(integer, decimal, color) => this.refs.notificationPad.addNotificcation([{ name: '撤销', operation: () => alert("???/") }], '新账产生', '你收到了来自生活的一百万现金', -1)}></AmountPad>))
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
        {/* {
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
        } */}
        {/* {
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
                      <Button full danger onPress={() => { }}>
                        <Icon active name="trash" />
                      </Button>}
                  />
                </Content>
              </Container>
            </View>
          ) : null
        } */}
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
