import React, { Component } from 'react';
import PropTypes from 'prop-types'
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
import Svg, {
  Circle,
  Ellipse,
  G,
  Text,
  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,
  // Image,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
} from 'react-native-svg';
import CircularSlider from './circularSlider'

export default class Notification extends Component {

  addNotification({ bottom = [], title = '', description = '', timeout = 3000 }) {
    let newNotification = { bottom, title, description }
    newNotification.bottom.push({
      name: '关闭', operation: () => {
        this.state.notifications = this.state.notifications.filter(n => n != newNotification)
        this.setState({
          notifications: this.state.notifications
        })
      }
    })
    this.state.notifications.push(newNotification)
    timeout === -1 || setTimeout(() => {
      this.state.notifications = this.state.notifications.filter(n => n != newNotification)
      this.setState({
        notifications: this.state.notifications
      })
    }, timeout);
    this.setState({
      notifications: this.state.notifications
    })
  }

  componentWillMount() {
    this.state = {
      notifications: []
    }
  }

  render() {
    return (
      <View style={styles.pad}>
        {
          this.state.notifications.map((n, h) => (
            <View key={h} style={styles.notification}>
              <View style={{ flex: 2, borderTopLeftRadius: 15, borderBottomLeftRadius: 15, display: 'flex', flexDirection: 'column', borderRightWidth: 0.25, borderColor: 'grey' }}>
                {
                  n.bottom.map((b, h2) => (
                    <View
                      key={h2}
                      style={{
                        flex: 1,
                        padding: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderBottomWidth: h2 === n.bottom.length - 1 ? 0 : 0.25, borderColor: 'grey'
                      }}
                      onTouchStart={() => {
                        b.operation()
                        this.state.notifications.splice(h, 1)
                        this.setState({
                          notifications: this.state.notifications
                        })
                      }}
                    >
                      <TextOrigin>{b.name}</TextOrigin>
                    </View>
                  ))
                }
              </View>
              <View style={{ flex: 8, borderTopRightRadius: 15, borderBottomRightRadius: 15 }}>
                <TextOrigin style={{ margin: 10, marginBottom: 5, fontSize: 15 }}>{n.title}</TextOrigin>
                <TextOrigin style={{ margin: 10, marginTop: 0, fontSize: 12, fontWeight: '200' }}>{n.description}</TextOrigin>
              </View>
            </View>
          ))
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  pad: {
    zIndex: 10000,
    display: 'flex',
    flexDirection: 'column-reverse',
    margin: 5,
    right: 5,
    bottom: 120,
    position: 'absolute',
  },
  notification: {
    margin: 5,
    borderRadius: 12,
    width: 269,
    backgroundColor: 'rgb(240, 240, 240)',
    minHeight: 50,
    display: 'flex',
    flexDirection: 'row',
    shadowOffset: { width: 3, height: 3 },
    shadowColor: 'grey',
    shadowOpacity: 0.3,
    shadowRadius: 2,
  }
})