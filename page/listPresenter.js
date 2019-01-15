import React, { Component } from 'react';
import { ListView, StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, Image, AsyncStorage, AlertIOS } from 'react-native';
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
      list: this.props.navigation.getParam('list', []),
      disableDelete: this.props.navigation.getParam('disableDelete', false),
      disableEdit: this.props.navigation.getParam('disableEdit', false),
    })
  }

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  }

  onRemoveItem(secId, rowId, rowMap, targetItem) {
    let targetIndex = this.state.list.indexOf(targetItem)
    this.state.list.splice(targetIndex, 1)
    let errMsg = this.props.navigation.getParam('onRemoveItem', () => AlertIOS.alert('invalid data delete'))(this.state.list, targetItem)
    if (errMsg) {
      this.state.list.splice(targetIndex, 0, targetItem)
      return AlertIOS.alert('删除失败', errMsg)
    }
    rowMap[`${secId}${rowId}`].closeRow();
    this.setState(this.state)
  }

  saveList(newItem) {
    this.props.navigation.getParam('onChangeData', () => AlertIOS.alert('invalid data change'))(this.state.list, newItem)
  }

  goEditor(row) {
    this.props.navigation.navigate({
      routeName: 'AttributeEditor',
      params: {
        callback: formItems => {
          formItems.forEach(_fi => row.find(_r => _r.title === _fi.title).value === _fi.value)
          this.setState(this.state)
          this.saveList(row)
        },
        headerTitle: row[0].value,
        formItems: row.filter(_r => !_r.disEditable)
      }
    })
  }

  render() {
    if (this.state.list.length === 0)
      return <Text style={{ textAlign: 'center', marginTop: 30, fontSize: 15 }}>暂无数据</Text>
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
              <Text style={{ flex: 3, fontSize: 25, textAlign: 'right', marginRight: 20 }}>{_row[0].type === 'date' ? moment(_row[0].value).format('YYYY-MM-DD H:mm') : _row[0].value}</Text>
              <View style={{ flex: 7 }}>
                {
                  _row.slice(1, _row.length).map(_ao =>
                    <Text key={_ao.title} style={styles.item}>
                      <Text style={styles.label}>{_ao.title}：</Text>{_ao.type === 'date' ? moment(_ao.value).format('YYYY-MM-DD H:mm') : _ao.value}
                    </Text>)
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
                width: this.state.disableDelete ? 0 : 75,
                backgroundColor: 'red',
              }}
              onPress={_ => this.onRemoveItem(secId, rowId, rowMap, row)}>
              <Text style={{ color: 'white' }}>删除</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[{
                alignItems: 'center',
                bottom: 0,
                justifyContent: 'center',
                position: 'absolute',
                top: 0,
                width: this.state.disableEdit ? 0 : 75,
              }, styles.backRightBtnRight]}
              onPress={() => this.goEditor(row)}>
              <Text style={styles.backTextWhite}>{typeof(row.find(_ => _.type === 'date').value)}</Text>
            </TouchableOpacity>
          </View>
        )}
        leftOpenValue={this.state.disableDelete ? 0 : 75}
        rightOpenValue={this.state.disableEdit ? 0 : -75}
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
  backRightBtnRight: {
    backgroundColor: 'pink',
    right: 0,
  },
});