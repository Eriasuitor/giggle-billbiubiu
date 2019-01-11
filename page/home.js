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
import { range } from 'lodash'

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
            bill: [],
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
        this.props.navigation.addListener('willFocus', (payload) => {
            AsyncStorage.getItem('homeState', (error, result) => {
            error && AlertIOS.alert('Our Apologies', `Something wrong when get storage, for the security of your data, please exit this BillBiuBiu, error message: ${JSON.stringify(error)}`)
            result ? this.setState(JSON.parse(result)) : this.setState(this.state)
        })
          });
        
    }

    componentDidMount() {
        
    }

    goWallets(){
        this.props.navigation.navigate({
            routeName: 'Wallets',
            params: {
                wallets: this.state.wallets,
                collections: this.state.collections
            }
        })
    }

    afterWalletEdit(value) {
        let wallet = this.state.wallets.find(_w => _w.name === value.walletName)
        if(!wallet) {
          wallet = {balance: 0}
          this.state.wallets.push(wallet)
        }
        if (value.newCollection) {
          value.collection = value.newCollection
          this.state.collections.find(_c => _c === value.newCollection) || this.state.collections.push(value.newCollection)
        }
        Object.assign(wallet, {
          name: value.walletName,
          amount: value.amount,
          limited: value.limited,
          collection: value.collection
        })
        this.setState({
          wallets,
          collections: this.state.collections
        })
        this.saveItem()
      }
    

    afterNewWallet(newWallet) {
        if (newWallet && !this.state.wallets[newWallet.walletName]) {
            if (newWallet.newCollection) {
                newWallet.collection = newWallet.newCollection
                this.state.collections.push(newWallet.newCollection)
            }
            this.setState({
                wallet: Object.assign(this.state.wallets, {
                    [newWallet.walletName]: {
                        balance: 0,
                        amount: newWallet.amount,
                        limited: newWallet.limited,
                        collection: newWallet.collection,
                    }
                }),
                collections: this.state.collections
            })
            this.saveItem()
        }
    }

    saveItem() {
        AsyncStorage.setItem('homeState', JSON.stringify(this.state), error => error && AlertIOS.alert('Our Apologies', `Something wrong when set storage, all operations during failure won't be save. We suggest you suspending the use of this software until repaired. error message: ${JSON.stringify(error)}`))
    }

    newBill(wallet, amount, color) {
        wallet.balance -= amount;
        this.state.bill.push({
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
                        let billIndex = this.state.bill.findIndex(b => b.recordCounter === recordCounter);
                        if (billIndex === -1)
                            return this.refs.notificationPad.addNotification({
                                title: 'Something Wrong',
                                description: 'Recall failed! ',
                            })
                        let bill = this.state.bill[billIndex]
                        this.state.bill.splice(billIndex, 1)
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
                        <TextOrigin style={styles.option}>Bill</TextOrigin>
                    </View>
                    <View style={styles.button}
                        onTouchStart={() => {
                            this.props.navigation.navigate({
                                routeName: 'NewWallet',
                                params: {
                                    callback: newWallet => {
                                        this.afterNewWallet(newWallet)
                                    }
                                }
                            })
                        }}>
                        <TextOrigin style={styles.option}>Wallet</TextOrigin>
                    </View>
                    <View style={styles.button}
                        onTouchStart={() => this.props.navigation.goBack()}
                    >
                        <TextOrigin style={styles.option}>Resume</TextOrigin>
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
        fontSize: 12
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