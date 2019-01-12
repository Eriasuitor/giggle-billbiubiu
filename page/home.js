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
    ListView,
    AsyncStorage,
    AlertIOS,
    DatePickerIOS
} from 'react-native';
import lodash from 'lodash'

import AmountPad from '../component/amountPad'
import Notification from '../component/notification'
import { createDrawerNavigator } from 'react-navigation'
import moment from 'moment'

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
            datePicker: new Date(),
            recordCounter: 0,
            collections: ['国防部特批'],
            bills: [],
            colors: ['pink', 'grey', 'purple', 'red', 'green'],
            wallets: [{
                name: 'English',
                balance: 3000.33,
                amount: 10000,
                limited: true,
                collection: '国防部特批'
            }, {
                name: '中文',
                balance: 3000.33,
                amount: 10000,
                limited: true,
                collection: '国防部特批'
            }, {
                name: '个人生存',
                balance: 3000.33,
                amount: 10000,
                limited: true,
                collection: '国防部特批'
            }, {
                name: 'Survive Group',
                balance: 3000.33,
                amount: 10000,
                limited: true,
                collection: '国防部特批'
            }]
        };

    }

    componentWillMount() {
        this.setState(this.state)
        AsyncStorage.clear()
        this.props.navigation.addListener('willFocus', () => {
            AsyncStorage.getItem('listPresenter', (error, result) => {
                error && AlertIOS.alert('Our Apologies', `Something wrong when get storage, for the security of your data, please exit this BillBiuBiu, error message: ${JSON.stringify(error)}`)
                if (!result) return this.setState(this.state)
                result = JSON.parse(result)
                this.setState({
                    wallets: result.list.map(_l => _l.reduce((a, b) => Object.assign(a, { [b.name]: b.value }), {}))
                })
            })
        });

    }

    goWallets() {
        this.props.navigation.navigate({
            routeName: 'ListPresenter',
            params: {
                headerTitle: 'Wallets',
                list: this.state.wallets.map(_w => [
                    ['名称', 'name', {
                        type: 'string',
                        validMethod: (() => { })
                    }],
                    ['余额', 'balance', {
                        type: 'int',
                        validMethod: (() => { })
                    }],
                    ['每月数额', 'amount', {
                        type: 'int',
                        validMethod: (() => { })
                    }],
                    ['限制最大值', 'limited', {
                        type: 'boolean',
                        validMethod: (() => { })
                    }],
                    ['所属集合', 'collection', {
                        type: 'checkbox',
                        options: this.state.collections,
                        validMethod: (() => { })
                    }]
                ].map(_t_k_e => (Object.assign(_t_k_e[2], {
                    title: _t_k_e[0],
                    name: _t_k_e[1],
                    value: _w[_t_k_e[1]],
                }))))
            }
        })
    }

    goCollections() {
        this.props.navigation.navigate({
            routeName: 'ListPresenter',
            params: {
                headerTitle: 'bills',
                list: this.state.collections.map(_c => {
                    let collectionWalletsNames = this.state.wallets.filter(_w => _w.collection === _c).map(_w => _w.name)
                    return [
                        {
                            title: _c,
                            value: _c
                        },
                        {
                            title: '总额',
                            value: this.state.wallets.reduce((a, b) => b.collection === _c ? a + b.balance : a, 0)
                        },
                        {
                            title: 'costs total',
                            value: this.state.bills.reduce((a, b) => collectionWalletsNames.includes(b.walletName) ? a + b.amount : a, 0)
                        },
                    ]
                })
            }
        })
    }

    goBills() {
        this.props.navigation.navigate({
            routeName: 'ListPresenter',
            params: {
                headerTitle: 'bills',
                list: this.state.bills.map(_w => [
                    ['钱包', 'walletName', {
                        type: 'checkbox',
                        options: this.state.wallets.map(_w => _w.name),
                        validMethod: (() => { })
                    }],
                    ['数额', 'amount', {
                        type: 'int',
                        validMethod: (() => { })
                    }],
                    ['染色', 'color', {
                        type: 'checkbox',
                        options: this.state.colors,
                        validMethod: (() => { })
                    }],
                    ['消费时间', 'date', {
                        type: 'date',
                        validMethod: (() => { })
                    }]
                ].map(_t_k_e => (Object.assign(_t_k_e[2], {
                    title: _t_k_e[0],
                    name: _t_k_e[1],
                    value: _w[_t_k_e[1]],
                }))))
            }
        })
    }

    saveItem() {
        AsyncStorage.setItem('homeState', JSON.stringify(this.state), error => error && AlertIOS.alert('Our Apologies', `Something wrong when set storage, all operations during malfunction won't be save. We suggest you suspending the use of this software until repaired. error message: ${JSON.stringify(error)}`))
    }

    newBill(wallet, amount, color) {
        wallet.balance -= amount;
        this.state.bills.push({
            recordCounter: ++this.state.recordCounter,
            walletName: wallet.name,
            amount,
            color,
            date: this.state.datePicker
        })
        this.setState(this.state);
        this.saveItem()
        this.refs.notificationPad.addNotification({
            bottom: [{
                name: '撤销', operation: (recordCounter => {
                    return () => {
                        let billIndex = this.state.bills.findIndex(b => b.recordCounter === recordCounter);
                        if (billIndex === -1)
                            return this.refs.notificationPad.addNotification({
                                title: 'Something Wrong',
                                description: 'Recall failed! ',
                            })
                        let bill = this.state.bills[billIndex]
                        this.state.bills.splice(billIndex, 1)
                        wallet.balance += bill.amount
                        this.refs.notificationPad.addNotification({
                            title: 'Recall Success',
                            description: `wallet ${wallet.name} recall ¥ ${amount}`,
                        })
                        this.setState(this.state)
                        this.saveItem()
                    }
                }).call(this, this.state.recordCounter)
            }],
            title: `wallet ${wallet.name} 新账单产生`,
            description: `wallet ${wallet.name} consume ¥ ${amount} at ${moment(this.state.datePicker).format('YYYY-MM-DD H:mm')}`,
        });
    }

    afterNewWallet(formItems) {
        let newWallet = lodash.zip(['name', 'balance', 'amount', 'limited', 'collection'], formItems).reduce((a, b) => Object.assign(a, { [b[0]]: b[1].value }), {})
        this.state.wallets.push(newWallet)
        this.setState(this.state)
    }

    goNewWallet() {
        this.props.navigation.navigate({
            routeName: 'AttributeEditor',
            params: {
                callback: formItems => {
                    this.afterNewWallet(formItems)
                },
                headerTitle: 'Add a Wallet',
                formItems: [
                    {
                        title: 'Wallet Name',
                        type: 'string',
                        value: 'new wallet',
                        validMethod: value => value.length < 20
                    },
                    {
                        title: 'Balance',
                        type: 'int',
                        value: 0,
                        validMethod: value => value < 200000
                    },
                    {
                        title: 'Amount',
                        type: 'int',
                        value: 0,
                        validMethod: value => value > 200000
                    },
                    {
                        title: 'Limited',
                        type: 'boolean',
                        value: false,
                        validMethod: value => value
                    },
                    {
                        title: 'Collection',
                        type: 'checkbox',
                        value: '',
                        options: this.state.collections,
                        validMethod: value => value
                    },
                ]
            }
        })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Notification ref='notificationPad' />
                <View style={{ marginTop: 40, flexDirection: 'row', flexWrap: 'wrap' }}>
                    {
                        this.state.wallets.map(_w => (
                            <AmountPad
                                key={_w.name}
                                balance={_w.balance}
                                name={_w.name}
                                onClick={(integer, decimal, color) => this.newBill.call(this, _w, integer + decimal, color)}
                                colors={this.state.colors}
                            />
                        ))
                    }
                </View>
                <View style={styles.menu}>
                    <DatePickerIOS style={styles.datePicker}
                        date={this.state.datePicker}
                        onDateChange={datePicker => this.setState({ datePicker })}
                    />
                    <View style={styles.button}
                        onTouchStart={() => this.goWallets()}
                    >
                        <TextOrigin style={styles.option}>Wallets</TextOrigin>
                    </View>
                    <View style={styles.button}
                        onTouchStart={this.goNewWallet.bind(this)}>
                        <TextOrigin style={styles.option}>New Wallet</TextOrigin>
                    </View>
                    <View style={styles.button}
                        onTouchStart={() => this.goBills()}
                    >
                        <TextOrigin style={styles.option}>Bills</TextOrigin>
                    </View>
                    <View style={styles.button}
                        onTouchStart={() => this.goCollections()}
                    >
                        <TextOrigin style={styles.option}>集合</TextOrigin>
                    </View>
                </View>
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
        fontSize: 12,
    },
    datePicker: {
        width: '100%',
    },
    menu: {
        position: 'absolute',
        width: '100%',
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
        margin: 5,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'pink',
        padding: 5
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