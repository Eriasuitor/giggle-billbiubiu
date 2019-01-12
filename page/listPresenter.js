import React, { Component } from 'react';
import { ListView, StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, Image, AsyncStorage } from 'react-native';
import PropTypes from 'prop-types'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { Container, Header, Content, List, ListItem, Icon, Left, Body, Right, Switch, Button, Title, Form, Item, Input, Label, Picker, Card, CardItem, Thumbnail } from 'native-base';
import 'prop-types';
import lodash from 'lodash'
import moment from 'moment'

export default class ListPresenter extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    const { params } = navigation.state;
    return {
      title: navigation.getParam('headerTitle', 'Invalid Access'),
    }
  };

  componentWillMount() {
    this.setState({
      list: this.props.navigation.getParam('list', [])
    })
  }

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  }

  deleteRow(secId, rowId, rowMap) {
    rowMap[`${secId}${rowId}`].closeRow();
    const newData = [...this.state.listViewData];
    newData.splice(rowId, 1);
    this.setState({ listViewData: newData });
  }

  saveList() {
    AsyncStorage.mergeItem('listPresenter', JSON.stringify({ list: this.state.list }), error => error && AlertIOS.alert('Our Apologies', `Something wrong when set storage, all operations during failure won't be save. We suggest you suspending the use of this software until repaired. error message: ${JSON.stringify(error)}`))
  }

  goEditor(row) {
    this.props.navigation.navigate({
      routeName: 'AttributeEditor',
      params: {
        callback: formItems => {
          row = formItems
          this.setState(this.state)
          this.saveList()
        },
        headerTitle: row[0].value,
        formItems: row
      }
    })
  }

  render() {
    return (
      <SwipeListView style={styles.container}
        dataSource={this.ds.cloneWithRows(this.state.list)}
        renderRow={_row => (
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
              <Text style={{ flex: 3, fontSize: 30, textAlign: 'right', marginRight: 20 }}>{_row[0].value}</Text>
              <View style={{ flex: 7 }}>
                {
                  _row.slice(1, _row.length).map(_ao => <Text key={_ao.value} style={styles.item}><Text style={styles.label}>{_ao.title}：</Text>{_ao.type === 'date' ? moment(_ao.value).format('YYYY-MM-DD H:mm') : _ao.value}</Text>)
                }
              </View>
            </View>
          </TouchableHighlight>
        )}
        renderHiddenRow={(row, secId, rowId, rowMap) => (
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
              onPress={() => this.goEditor(row)}>
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