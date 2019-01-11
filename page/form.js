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
    ListView
} from 'react-native';
import PropTypes from 'prop-types'
import { Container, Header, Content, List, ListItem, Text, Icon, Left, Body, Right, Switch, Button, Title, Form, Item, Input, Label, Picker } from 'native-base';
import { NavigationActions } from 'react-navigation';

export default class NewWallet extends Component {
    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;
        return {
            title: 'New Wallet',
            headerRight:
                <Button block iconLeft transparent onPress={() => navigation.state.params.navigatePress()}>
                    <Icon name='add' style={{ fontSize: 30 }} />
                </Button>
        }
    };

    goHome() {

    }

    componentDidMount() {
        [
            {
                title: '',
                type: ['int', 'string', 'date', 'boolean', 'checkbox'],
                validMethod: value => true
            }
        ]
        this.props.navigation.setParams({
            navigatePress: () => {
                this.props.navigation.state.params.callback(['name', 'limited', 'amount', 'collection', 'newCollection', 'oldName'].reduce((a, b) => Object.assign(a, { [b]: this.state[b] }), {}))
                this.props.navigation.goBack()
            }
        })
    }

    componentWillMount() {
        let wallet = this.props.navigation.state.params.wallet
        wallet.collections = this.props.navigation.state.params.collections
        wallet.collections.push('Add One')
        wallet.oldName = wallet.name
        this.state = Object.assign({
            invalid: {
                collections: false,
                name: false,
                limited: false,
                amount: false,
                collection: false
            }
        }, wallet)
        this.setState(this.state)
    }

    render() {
        return (
            <Container style={{}}>
                <Content>
                    <Form>
                        <Item error={this.state.invalid.name} fixedLabel style={{ height: 45, marginRight: 15, paddingRight: 15 }}>
                            <Label>Wallet Name</Label>
                            <Input
                                style={{ textAlign: 'right' }}
                                value={this.state.name}
                                onChangeText={name => this.setState({ name })}
                            />
                        </Item>
                        <Item error={this.state.invalid.collection} itemPicker fixedLabel style={{ height: 45, marginRight: 15 }}>
                            <Label>Collection</Label>
                            <Picker
                                headerStyle={{ paddingTop: 40 }}
                                iosHeader="Collections"
                                iosIcon={<Icon name="ios-arrow-down-outline" />}
                                placeholder="Click to Select"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.collection}
                                onValueChange={collection => this.setState({ collection })}
                            >
                                {
                                    this.state.collections.map(_c => <Picker.Item key={_c} label={_c} value={_c} />)
                                }
                            </Picker>
                        </Item>
                        {
                            this.state.collection === 'Add One' &&
                            <Item error={this.state.invalid.newCollection} fixedLabel style={{ height: 45, marginRight: 15, paddingRight: 15 }}>
                                <Label>新建集合名称</Label>
                                <Input
                                    style={{ textAlign: 'right' }}
                                    onChangeText={newCollection => {
                                        this.setState({ newCollection })
                                    }}
                                />
                            </Item>
                        }
                        <Item error={this.state.invalid.amount} fixedLabel style={{ height: 45, marginRight: 15, paddingRight: 15 }}>
                            <Label>Amount</Label>
                            <Input keyboardType='numeric'
                                style={{ textAlign: 'right' }}
                                value={this.state.amount.toString()}
                                onChangeText={amount => this.setState({ amount })}
                            />
                        </Item>
                        <Item error={this.state.invalid.limited} fixedLabel style={{ height: 45, marginRight: 15, paddingRight: 15 }}>
                            <Label>Limited</Label>
                            <Switch value={this.state.limited} onValueChange={limited => this.setState({ limited })} />
                        </Item>
                    </Form>
                </Content>
            </Container>
        )
    }
}