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
    AsyncStorage
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
                    <Icon name='add' style={{ fontSize: 30 }} />
                </Button>
        }
    };

    componentWillMount() {
        this.setState({
            formItems: this.props.navigation.getParam('formItems', [])
        })
    }

    componentDidMount() {
        this.props.navigation.setParams({
            navigatePress: () => {
                this.props.navigation.state.params.callback(this.state.formItems)
                this.props.navigation.goBack()
            }
        })
    }

    string(item) {
        return (
            <Item key={item.title} error={!item.validMethod(item.value)} fixedLabel style={{ height: 45, marginRight: 15, paddingRight: 15 }}>
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
            <Item key={item.title} error={!item.validMethod(item.value)} fixedLabel style={{ height: 45, marginRight: 15, paddingRight: 15 }}>
                <Label>{item.title}</Label>
                <Input
                    style={{ textAlign: 'right' }}
                    value={item.value != undefined && item.value.toString()}
                    keyboardType='numeric'
                    onChangeText={value => {
                        item.value = value.indexOf('.') != value.lastIndexOf('.')? item.value: value
                        this.setState(this.state)
                        this.asyncStorage()
                    }}
                    onBlur={value => {
                        item.value = parseFloat(item.value)
                        this.setState(this.state)
                        this.asyncStorage()
                    }}
                />
            </Item>
        )
    }

    date(item) {
        return (
            <Item key={item.title} error={!item.validMethod(item.value)} fixedLabel style={{ height: 45, marginRight: 15, paddingRight: 15 }}>
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
                        <View onTouchStart={e => e.stopPropagation()}                        >
                            <DatePickerIOS
                                date={item.value}
                                onDateChange={value => {
                                    item.value = value
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
            <Item key={item.title} error={!item.validMethod(item.value)} fixedLabel style={{ height: 45, marginRight: 15, paddingRight: 15 }}>
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
            <Item key={item.title} error={!item.validMethod(item.value)} itemPicker fixedLabel style={{ height: 45, marginRight: 15 }}>
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
                            this.state.formItems.map(_fi => this[_fi.type](_fi))
                        }
                    </Form>
                </Content>
            </Container>
        )
    }
}