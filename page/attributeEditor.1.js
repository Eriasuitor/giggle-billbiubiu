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
    TextInput,
    PickerIOS,
    ListView,
    DatePickerIOS,
    AsyncStorage,
    AlertIOS
} from 'react-native';
import Variable from '../entity'
import PropTypes from 'prop-types'
import { Container, Header, Content, List, ListItem, Text, Icon, Left, Body, Right, Switch, Button, Title, Form, Item, Input, Label, Picker } from 'native-base';
import moment from 'moment'
import { NavigationActions } from 'react-navigation';

export default class AttributeEditor1 extends Component {

    componentWillMount() {
        this.setState({
            object: {
                name: new Variable.AString('123', () => { }),
                // amount: new Variable.AInt(123, () => { }, 2),
                // date: new Variable.ADate(new Date(), () => { }),
                // chose: new Variable.AEnum('123', () => { }, ['123'])
            },
            formItems: [],
            invalidRecord: {}
        })
    }

    valid(validMethod = () => null, item) {
        // let errMsg = validMethod(item.value)
        // if (!errMsg) {
        //     this.state.invalidRecord[item.title] = null
        //     return false
        // }
        // this.state.invalidRecord[item.title] = errMsg
        // return true
    }

    componentDidMount() {

    }

    get renders() {
        return {
            AString: (variable) => {
                alert(JSON.stringify(variable))
                return (
                    <Item key={variable.humanReadableName} error={this.valid()} fixedLabel style={{ height: 45, marginRight: 15, paddingRight: 15 }}>
                        <Label>{variable.humanReadableName}</Label>
                        <Input
                            style={{ textAlign: 'right' }}
                            value={variable.value}
                            onChangeText={value => {
                                variable.set(value)
                                this.setState(this.state)
                            }}
                        />
                    </Item>
                )
            }
        }
    }



    string(item) {
        return (
            <Item key={item.title} error={this.valid(item.validMethod, item)} fixedLabel style={{ height: 45, marginRight: 15, paddingRight: 15 }}>
                <Label>{item.title}</Label>
                <Input
                    style={{ textAlign: 'right' }}
                    value={item.value}
                    onChangeText={value => {
                        item.value = value
                        this.setState(this.state)
                        this.asyncStorage()
                    }}
                />
            </Item>
        )
    }

    int(item) {
        return (
            <Item key={item.title} error={this.valid(item.validMethod, item)} fixedLabel style={{ height: 45, marginRight: 15, paddingRight: 15 }}>
                <Label>{item.title}</Label>
                <Input
                    style={{ textAlign: 'right' }}
                    value={item.value != undefined && item.value.toString()}
                    keyboardType='numeric'
                    onChangeText={value => {
                        item.value = !value || value.endsWith('.') || value.endsWith('0') ? value : parseFloat(value)
                        this.setState(this.state)
                        this.asyncStorage()
                    }}
                />
            </Item>
        )
    }

    date(item) {
        !(item.value instanceof Date) && (item.value = new Date(item.value))
        return (
            <Item key={item.title} error={this.valid(item.validMethod, item)} fixedLabel style={{ height: 45, marginRight: 15, paddingRight: 15 }}>
                <Label>{item.title}</Label>
                <Text
                    style={{ textAlign: 'right', position: 'absolute', right: 20 }}
                    onPress={() => {
                        item.showDatePicker = true
                        this.setState(this.state)
                        this.asyncStorage()
                    }}
                >{item.value && moment(item.value).format('YYYY-MM-DD H:mm')}</Text>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={!!item.showDatePicker}
                >
                    <View style={{ display: 'flex', flexDirection: 'column-reverse', bottom: 0, width: '100%', height: '100%' }}
                        onTouchStart={() => {
                            item.showDatePicker = false
                            this.setState(this.state)
                            this.asyncStorage()
                        }}>
                        <View onTouchStart={e => e.stopPropagation()}>
                            <DatePickerIOS
                                date={item.value}
                                onDateChange={value => {
                                    item.value = moment(value).toDate().getTime()
                                    this.setState(this.state)
                                    this.asyncStorage()
                                }}
                            />
                        </View>
                    </View>
                </Modal>
            </Item>

        )
    }

    boolean(item) {
        return (
            <Item key={item.title} error={this.valid(item.validMethod, item)} fixedLabel style={{ height: 45, marginRight: 15, paddingRight: 15 }}>
                <Label>{item.title}</Label>
                <Switch value={item.value} onValueChange={value => {
                    item.value = value
                    this.setState(this.state)
                    this.asyncStorage()
                }} />
            </Item>
        )
    }

    checkbox(item) {
        return (
            <Item key={item.title} error={this.valid(item.validMethod, item)} itemPicker fixedLabel style={{ height: 45, marginRight: 15 }}>
                <Label>{item.title}</Label>
                <Picker
                    headerStyle={{ paddingTop: 42, height: 88 }}
                    iosHeader={item.title}
                    iosIcon={<Icon name="ios-arrow-down-outline" />}
                    placeholder="Click to Select"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={item.value}
                    onValueChange={value => {
                        item.value = value
                        this.setState(this.state)
                        this.asyncStorage()
                    }}
                >
                    {
                        item.options.map(_o => <Picker.Item key={_o} label={_o} value={_o} />)
                    }
                </Picker>
            </Item>
        )
    }

    asyncStorage() {
        AsyncStorage.setItem('attributeEditorFormItems', JSON.stringify(this.state.formItems), error => error && AlertIOS.alert('Our Apologies', `Something wrong when set storage, all operations during malfunction won't be save. We suggest you suspending the use of this software until repaired. error message: ${JSON.stringify(error)}`))
    }

    goHome() {

    }



    render() {
        return (
            <Container style={{}}>
                <Content>
                    <Form>
                        {
                            Object.values(this.state.object).map(_v => this.renders[_v.type](_v))
                        }
                    </Form>
                </Content>
            </Container>
        )
    }
}