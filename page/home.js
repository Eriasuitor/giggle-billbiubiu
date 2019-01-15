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
            collections: [],
            bills: [],
            colors: [{
                value: 'pink',
                startDate: new Date().getTime()
            }, {
                value: 'grey',
                startDate: new Date().getTime()
            }, {
                value: 'purple',
                startDate: new Date().getTime()
            }, {
                value: 'red',
                startDate: new Date().getTime()
            }, {
                value: 'green',
                startDate: new Date().getTime()
            }],
            wallets: []
        };
    }

    componentWillMount() {
        // AsyncStorage.clear()
        AsyncStorage.getItem('homeState', (error, result) => {
            error && AlertIOS.alert('Our Apologies', `Something wrong when get storage, all operations during malfunction won't be save. We suggest you suspending the use of this software until repaired. error message: ${JSON.stringify(error)}`)
            if (result) {
                result = JSON.parse(result)
                result.datePicker = new Date()
                this.setState(result)
            }
            this.setState(this.state)
        })
    }

    goWallets() {
        this.props.navigation.navigate({
            routeName: 'ListPresenter',
            params: {
                headerTitle: '钱包',
                list: this.state.wallets.map(_w => [
                    ['名称', 'name', {
                        type: 'string',
                        validMethod: this.walletNameValidMethod
                    }],
                    ['余额', 'balance', {
                        type: 'int',
                        validMethod: this.moneyValidMethod
                    }],
                    ['每月数额', 'amount', {
                        type: 'int',
                        validMethod: this.moneyValidMethod
                    }],
                    ['限制最大值', 'limited', {
                        type: 'boolean',
                    }],
                    ['所属集合', 'collection', {
                        type: 'checkbox',
                        options: this.state.collections,
                    }]
                ].map(_t_k_e => (Object.assign(_t_k_e[2], {
                    title: _t_k_e[0],
                    name: _t_k_e[1],
                    value: _w[_t_k_e[1]],
                    editable: true
                })))),
                onChangeData: wallets => {
                    this.state.wallets = wallets.map(_l => _l.reduce((a, b) => Object.assign(a, { [b.name]: b.value }), {}))
                    this.setState({
                        wallets: this.state.wallets
                    })
                    this.saveItem()
                },
                onRemoveItem: ((wallets, targetWallet) => {
                    let walletIndex = this.state.wallets.findIndex(_w => _w.name === targetWallet.find(_tw => _tw.name === 'name').value)
                    this.state.wallets.splice(walletIndex, 1)
                    this.setState({
                        wallets: this.state.wallets
                    })
                    this.saveItem()
                }).bind(this)
            }
        })
    }

    collectionNameValidMethod(value) {
        if (value.length <= 10) return
        return `集合名称不能长于10个字符，当前长度为${value.length}`
    }

    goCollections() {
        this.props.navigation.navigate({
            routeName: 'ListPresenter',
            params: {
                headerTitle: '集合',
                list: this.state.collections.map(_c => {
                    let collectionWalletsNames = this.state.wallets.filter(_w => _w.collection === _c).map(_w => _w.name)
                    return [
                        {
                            title: '名称',
                            primary: true,
                            value: _c,
                            type: 'string',
                            validMethod: this.collectionNameValidMethod
                        },
                        {
                            title: '总额',
                            value: this.state.wallets.reduce((a, b) => b.collection === _c ? a + b.balance : a, 0),
                            disEditable: true
                        },
                        {
                            title: '消费总额',
                            value: this.state.bills.reduce((a, b) => collectionWalletsNames.includes(b.walletName) ? a + b.amount : a, 0),
                            disEditable: true
                        },
                    ]
                }),
                onChangeData: collections => {
                    lodash.zip(this.state.collections, collections).map(_oc_nca => {
                        this.state.wallets.filter(_w => _w.collection === _oc_nca[0]).forEach(_w => _w.collection = _oc_nca[1].find(_nco => _nco.primary).value)
                    })
                    this.state.collections = collections.map(_ca => _ca.find(_co => _co.primary).value)
                    this.setState(this.state)
                    this.saveItem()
                },
                onRemoveItem: ((bills, targetCollection) => {
                    let collectionName = targetCollection.find(_ca => _ca.primary).value
                    let existedWallets = this.state.wallets.filter(_w => _w.collection === collectionName)
                    if (existedWallets.length !== 0) return `wallet ${existedWallets.map(_w => `'${_w.name}'`)} is belonging with collection '${collectionName}'`
                }).bind(this)
            }
        })
    }

    showColors() {
        this.props.navigation.navigate({
            routeName: 'ListPresenter',
            params: {
                headerTitle: '彩圈',
                list: this.state.colors.map(_c => {
                    return [
                        {
                            title: '名称',
                            primary: true,
                            value: _c.value,
                            disEditable: true
                        },
                        {
                            title: '总计数额',
                            value: this.state.bills.reduce((a, b) => b.color === _c.value && b.date >= _c.startDate ? a + b.amount : a, 0),
                            disEditable: true
                        },
                        {
                            title: '开始时间',
                            value: _c.startDate,
                            type: 'date'
                        }
                    ]
                }),
                onChangeData: ((colors, newColor) => {
                    let color = this.state.colors.find(_c => _c.value === newColor.find(_nc => _nc.title === '名称').value)
                    color.startDate = newColor.find(_nc => _nc.title === '开始时间').value
                    newColor.find(_nc => _nc.title === '总计数额').value = 
                        this.state.bills.reduce((a, b) => b.color === color.value && b.date >= color.startDate ? a + b.amount : a, 0)
                    this.setState(this.state)
                    this.saveItem()
                }).bind(this),
                disableDelete: true

            }
        })
    }

    goBills() {
        this.props.navigation.navigate({
            routeName: 'ListPresenter',
            params: {
                headerTitle: '账单',
                list: this.state.bills.map(_w => [
                    ['消费时间', 'date', {
                        type: 'date',
                    }],
                    ['钱包', 'walletName', {
                        type: 'checkbox',
                        options: this.state.wallets.map(_w => _w.name),
                        validMethod: this.walletNameValidMethod
                    }],
                    ['数额', 'amount', {
                        type: 'int',
                        validMethod: this.moneyValidMethod
                    }],
                    ['染色', 'color', {
                        type: 'checkbox',
                        options: this.state.colors.map(_c => _c.value),
                    }],
                    ['计数器', 'recordCounter', {
                        type: 'int',
                        disEditable: true,
                    }]
                ].map(_t_k_e => (Object.assign(_t_k_e[2], {
                    title: _t_k_e[0],
                    name: _t_k_e[1],
                    value: _w[_t_k_e[1]],
                })))),
                onChangeData: ((bills, newBill) => {
                    this.spliceBill.call(this, newBill.find(_ob => _ob.name === 'recordCounter').value, newBill)
                }).bind(this),
                onRemoveItem: ((bills, targetBill) => {
                    this.spliceBill.call(this, targetBill.find(_ob => _ob.name === 'recordCounter').value)
                }).bind(this)
            }
        })
    }

    saveItem() {
        AsyncStorage.setItem('homeState', JSON.stringify(this.state), error => error && AlertIOS.alert('Our Apologies', `Something wrong when set storage, all operations during malfunction won't be save. We suggest you suspending the use of this software until repaired. error message: ${JSON.stringify(error)}`))
    }

    spliceBill(recordCounter, newBill) {
        let billIndex = this.state.bills.findIndex(b => b.recordCounter === recordCounter);
        if (billIndex === -1)
            return this.refs.notificationPad.addNotification({
                title: 'Recall failed',
                description: 'No bill was found when modify a bill!',
                timeout: -1
            })
        let bill = this.state.bills[billIndex]
        let wallet = this.state.wallets.find(_w => _w.name === bill.walletName)
        wallet.balance += bill.amount
        wallet.balance = parseFloat(wallet.balance.toFixed(2))
        if (newBill) {
            newBill = newBill.reduce((a, b) => Object.assign(a, { [b.name]: b.value }), {})
            let targetWallet = this.state.wallets.find(_w => _w.name === newBill.walletName)
            if (!targetWallet) return this.refs.notificationPad.addNotification({
                title: 'Recall failed',
                description: 'No wallet was found when modify a bill!',
                timeout: -1
            })
            targetWallet.balance -= newBill.amount
            targetWallet.balance = parseFloat(targetWallet.balance.toFixed(2))
            this.state.bills.splice(billIndex, 1, newBill)
        }
        else {
            this.state.bills.splice(billIndex, 1)
            this.refs.notificationPad.addNotification({
                title: '撤销成功',
                description: `wallet ${wallet.name} recall ¥ ${bill.amount}`,
            })
        }
        this.state.bills.sort((a, b) => b.date - a.date)
        this.setState(this.state)
        this.saveItem()
    }

    newBill(wallet, amount, color) {
        wallet.balance -= amount;
        wallet.balance = parseFloat(wallet.balance.toFixed(2))
        this.state.bills.push({
            recordCounter: ++this.state.recordCounter,
            walletName: wallet.name,
            amount,
            color,
            date: this.state.datePicker.getTime()
        })
        this.setState(this.state);
        this.saveItem()
        this.refs.notificationPad.addNotification({
            bottom: [{
                name: '撤销', operation: (recordCounter => {
                    return () => this.spliceBill(recordCounter)
                })(this.state.recordCounter)
            }],
            title: `wallet ${wallet.name} 新账单产生`,
            description: `wallet ${wallet.name} consume ¥ ${amount} at ${moment(this.state.datePicker).format('YYYY-MM-DD H:mm')}`,
        });
    }

    afterNewWallet(formItems) {
        let newWallet = lodash.zip(['name', 'balance', 'amount', 'limited', 'collection'], formItems).reduce((a, b) => Object.assign(a, { [b[0]]: b[1].value }), {})
        this.state.wallets.push(newWallet)
        this.setState(this.state)
        this.saveItem()
    }

    moneyValidMethod(value) {
        value = parseFloat(value)
        if (value === NaN) return '请确保您的输入为计算机可识别的数字'
        value = value.toString(),
            decimalLength = value.length - value.lastIndexOf('.') - 1
        decimalLength = decimalLength === value.length ? 0 : decimalLength
        if (decimalLength > 2) return `至多可保留两位小数，当前存在${decimalLength}位小数`
    }

    walletNameValidMethod(value) {
        if (value.length <= 10) return
        return `钱包名称不能长于10个字符，当前长度为${value.length}`
    }

    goNewWallet() {
        this.props.navigation.navigate({
            routeName: 'AttributeEditor',
            params: {
                callback: formItems => {
                    this.afterNewWallet(formItems)
                },
                headerTitle: '新建钱包',
                formItems: [
                    {
                        title: 'Wallet Name',
                        type: 'string',
                        value: 'new wallet',
                        validMethod: this.walletNameValidMethod
                    },
                    {
                        title: 'Balance',
                        type: 'int',
                        value: 0,
                        validMethod: this.moneyValidMethod
                    },
                    {
                        title: 'Amount',
                        type: 'int',
                        value: 0,
                        validMethod: this.moneyValidMethod
                    },
                    {
                        title: 'Limited',
                        type: 'boolean',
                        value: false,
                    },
                    {
                        title: 'Collection',
                        type: 'checkbox',
                        value: '',
                        options: this.state.collections,
                    },
                ]
            }
        })
    }

    afterNewCollection(formItems) {
        this.state.collections.push(formItems[0].value)
        this.setState({
            collections: this.state.collections
        })
        this.saveItem()
    }

    goNewCollection() {
        this.props.navigation.navigate({
            routeName: 'AttributeEditor',
            params: {
                callback: formItems => {
                    this.afterNewCollection(formItems)
                },
                headerTitle: '新建集合',
                formItems: [
                    {
                        title: 'Collection Name',
                        type: 'string',
                        value: 'new collection',
                        validMethod: this.collectionNameValidMethod
                    }
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
                                colors={this.state.colors.map(_c => _c.value)}
                            />
                        ))
                    }
                </View>
                <View style={styles.menu}>
                    <DatePickerIOS style={styles.datePicker}
                        date={this.state.datePicker}
                        onDateChange={datePicker => {
                            this.setState({ datePicker })
                        }}
                    />
                    <View style={styles.button}
                        onTouchStart={() => this.goWallets()}
                    >
                        <TextOrigin style={styles.option}>钱包</TextOrigin>
                    </View>
                    <View style={styles.button}
                        onTouchStart={this.goNewWallet.bind(this)}>
                        <TextOrigin style={styles.option}>新建钱包</TextOrigin>
                    </View>
                    <View style={styles.button}
                        onTouchStart={() => this.goBills()}
                    >
                        <TextOrigin style={styles.option}>账单</TextOrigin>
                    </View>
                    <View style={styles.button}
                        onTouchStart={() => this.goCollections()}
                    >
                        <TextOrigin style={styles.option}>集合</TextOrigin>
                    </View>
                    <View style={styles.button}
                        onTouchStart={() => this.goNewCollection()}
                    >
                        <TextOrigin style={styles.option}>新建集合</TextOrigin>
                    </View>
                    <View style={styles.button}
                        onTouchStart={() => this.showColors()}
                    >
                        <TextOrigin style={styles.option}>彩圈</TextOrigin>
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
        fontSize: 13,
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
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'pink',
        padding: 6
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