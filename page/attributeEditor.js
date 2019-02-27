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
import PropTypes from 'prop-types'
import { Container, Header, Content, List, ListItem, Text, Icon, Left, Body, Right, Switch, Button, Title, Form, Item, Input, Label, Picker } from 'native-base';
import moment from 'moment'
import { NavigationActions } from 'react-navigation';

export default class AttributeEditor extends Component {
    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;
        return {
            title: navigation.getParam('headerTitle', 'Invalid Access'),
            headerRight:
                <Button block iconLeft transparent onPress={() => navigation.state.params.navigatePress()}>
                    <Text style={{}}>Save</Text>
                </Button>
        }
    };

    componentWillMount() {
        this.setState({
            formItems: this.props.navigation.getParam('formItems', []),
            returnAsObject: this.props.navigation.getParam('returnAsArray', true),
            invalidRecord: {}
        })
    }

    valid(validMethod = () => null, item) {
        let errMsg = validMethod(item.value)
        if (!errMsg) {
            this.state.invalidRecord[item.title] = null
            return false
        }
        this.state.invalidRecord[item.title] = errMsg
        return true
    }

    componentDidMount() {
        this.props.navigation.setParams({
            navigatePress: () => {
                let errList = []
                Object.keys(this.state.invalidRecord).forEach(_ir => {
                    if (!this.state.invalidRecord[_ir]) return
                    errList.push(`'${_ir}': ${this.state.invalidRecord[_ir]}`)
                })
                if (errList.length !== 0)
                    return AlertIOS.alert('数据格式错误', errList.map((e, h) => `${h + 1}.${e}`).join('\n'))
                this.state.formItems.forEach(_f => _f.type === 'int' && (_f.value = parseFloat(_f.value)))
                this.props.navigation.state.params.callback(
                    
                    this.state.returnAsObject? this.state.formItems.reduce((a, b) =>  Object.assign(a, { [b.key]: b.value }), {} ): this.state.formItems
                )
                this.props.navigation.goBack()
            }
        })
    }

    string(item) {
        return (
            <Item key={item.name} error={this.valid(item.validMethod, item)} fixedLabel style={{ height: 45, marginRight: 15, paddingRight: 15 }}>
                <Label>{item.name}</Label>
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
            <Item key={item.name} error={this.valid(item.validMethod, item)} fixedLabel style={{ height: 45, marginRight: 15, paddingRight: 15 }}>
                <Label>item.name</Label>
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
        return (
            <Item key={item.name} error={this.valid(item.validMethod, item)} fixedLabel style={{ height: 45, marginRight: 15, paddingRight: 15 }}>
                <Label>{item.name}</Label>
                <Text
                    style={{ textAlign: 'right', position: 'absolute', right: 20 }}
                    onPress={() => {
                        item.showDatePicker = true
                        this.setState(this.state)
                        this.asyncStorage()
                    }}
                >{moment(item.value).format('YYYY-MM-DD H:mm')}</Text>
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
                                date={new Date(item.value)}
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
            <Item key={item.name} error={this.valid(item.validMethod, item)} fixedLabel style={{ height: 45, marginRight: 15, paddingRight: 15 }}>
                <Label>{item.name}</Label>
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
            <Item key={item.name} error={this.valid(item.validMethod, item)} itemPicker fixedLabel style={{ height: 45, marginRight: 15 }}>
                <Label>{item.name}</Label>
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
                        item.options.map(_o => <Picker.Item key={_o.name} label={_o.key || _o.name} value={_o.value} />)
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
                            this.state.formItems.map(_fi => this[_fi.type](_fi))
                        }
                    </Form>
                </Content>
            </Container>
        )
    }
}