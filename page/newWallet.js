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
import { Container, Header, Content, Left, Right, Body, Button, Icon, Title, Form, Item, Input, Label, Text as TextBase, Picker, List, ListItem } from 'native-base';

export default class NewWallet extends Component {
    render() {
        return (
            <View style={styles.container}>
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
        )
    }
}

const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      // left: '10%',
      // top: '5%',
      // borderRadius: 30,
      backgroundColor: 'white',
    },
  });