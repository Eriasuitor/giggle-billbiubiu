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
import { range } from 'lodash'

import AmountPad from '../component/amountPad'
import Notification from '../component/notification'
import NewWallet from './newWallet'

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
            recordCounter: 0,
            bill: [],
            wallet: {
                charge2: {
                    startX: 0,
                    startY: 0,
                    balance: 100,
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
                    balance: 100,
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
                    balance: 100,
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
                    balance: 100,
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
                    balance: 100,
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

    newBill(walletName, amount, color) {
        this.state.wallet[walletName].balance -= amount;
        this.state.bill.push({
            recordCounter: ++this.state.recordCounter,
            walletName,
            amount,
            color
        })
        this.setState(this.state);
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
                        this.state.wallet[bill.walletName].balance += bill.amount
                        this.refs.notificationPad.addNotification({
                            title: 'Recall Success',
                            description: `wallet ${walletName} recall ¥ ${amount}`,
                        })
                        this.setState(this.state)
                    }
                }).call(this, this.state.recordCounter)
            }],
            title: `wallet ${walletName} 新账单产生`,
            description: `wallet ${walletName} consume ¥ ${amount}`,
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Notification ref='notificationPad' />
                {/* <NewWallet /> */}
                <View style={{ marginTop: 40, flexDirection: 'row', flexWrap: 'wrap' }}>
                    {
                        Object.keys(this.state.wallet).map(_w => (
                            <AmountPad
                                key={_w}
                                balance={this.state.wallet[_w].balance}
                                name={_w}
                                onClick={(integer, decimal, color) => this.newBill.call(this, _w, integer + decimal, color)}
                            />
                        ))
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