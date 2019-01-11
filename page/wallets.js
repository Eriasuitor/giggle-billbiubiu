import React, { Component } from 'react';
import { ListView, StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, Image, AsyncStorage } from 'react-native';
import PropTypes from 'prop-types'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { Container, Header, Content, List, ListItem, Icon, Left, Body, Right, Switch, Button, Title, Form, Item, Input, Label, Picker, Card, CardItem, Thumbnail } from 'native-base';
import 'prop-types';

class Wallets extends Component {
  static propTypes = {
    wallets: PropTypes.array.isRequired,
  }

  static defaultProps = {
    wallets: []
  }


  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      collections: this.props.navigation.state.params.collections,
      wallets: this.props.navigation.state.params.wallets
    };
  }

  deleteRow(secId, rowId, rowMap) {
    rowMap[`${secId}${rowId}`].closeRow();
    const newData = [...this.state.listViewData];
    newData.splice(rowId, 1);
    this.setState({ listViewData: newData });
  }

  afterWalletEdition(value) {
    let wallet = this.state.wallets.find(_w => _w.name === value.oldName)
    if (value.newCollection) {
      value.collection = value.newCollection
      this.state.collections.find(_c => _c === value.newCollection) || this.state.collections.push(value.newCollection)
    }
    Object.assign(wallet, {
      name: value.name,
      amount: value.amount,
      limited: value.limited,
      collection: value.collection
    })
    this.setState({
      wallets: this.state.wallets,
      collections: this.state.collections
    })
    this.saveItem()
  }

  saveItem() {
    AsyncStorage.mergeItem('homeState', JSON.stringify({ wallets: this.state.wallets, collections: this.state.collections, }), error => error && AlertIOS.alert('Our Apologies', `Something wrong when set storage, all operations during failure won't be save. We suggest you suspending the use of this software until repaired. error message: ${JSON.stringify(error)}`))
  }

  render() {
    return (
      <SwipeListView style={styles.container}
        dataSource={this.ds.cloneWithRows(this.state.wallets)}
        renderRow={data => (
          <TouchableHighlight
            onPress={_ => console.log('You touched me')}
            style={styles.row}
            underlayColor={'white'}
          >
            <View style={{
              padding: 10,
              display: 'flex',
              flexDirection: 'row'
            }}>
              <Text style={{ flex: 3, fontSize: 30, textAlign: 'right', marginRight: 20 }}>{data.name}</Text>
              <View style={{ flex: 7 }}>
                <Text style={styles.item}><Text style={styles.label}>余额：</Text>{data.balance}</Text>
                <Text style={styles.item}><Text style={styles.label}>每月补充数额：</Text>{data.amount}</Text>
                <Text style={styles.item}><Text style={styles.label}>限制额度：</Text>{data.limited ? '是' : '否'}</Text>
                <Text style={styles.item}><Text style={styles.label}>集合：</Text>{data.collection}</Text>
              </View>
            </View>
          </TouchableHighlight>
        )}
        renderHiddenRow={(data, secId, rowId, rowMap) => (
          <View style={styles.rowBack}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                bottom: 0,
                justifyContent: 'center',
                position: 'absolute',
                top: 0,
                width: 75,
                backgroundColor: 'red',
              }}
              onPress={_ => this.deleteRow(secId, rowId, rowMap)}>
              <Text style={{ color: 'white' }}>删除</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.backRightBtn, styles.backRightBtnRight]}
              onPress={_ => {
                this.props.navigation.navigate({
                  routeName: 'NewWallet',
                  params: {
                    callback: value => {
                      this.afterWalletEdition(value)
                    },
                    wallet: data,
                    collections: this.state.collections
                  }
                })
              }
              }>
              <Text style={styles.backTextWhite}>编辑</Text>
            </TouchableOpacity>
          </View>
        )}
        leftOpenValue={75}
        rightOpenValue={-75}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  backTextWhite: {
    color: 'black',
  },
  label: {
    fontSize: 10
  },
  item: {
    margin: 2
  },
  row: {
    justifyContent: 'center',
    backgroundColor: 'white',
    borderBottomColor: 'grey',
    borderBottomWidth: 0.1,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    borderBottomColor: 'grey',
    borderBottomWidth: 0.1,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'pink',
    right: 0,
  },
  controls: {
    alignItems: 'center',
    marginBottom: 30,
  },
});

export default Wallets;
