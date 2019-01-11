/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import { AppRegistry } from 'react-native';
import BillBiuBiu from './page/home'
import { StackNavigator } from 'react-navigation'
import NewWallet from './page/newWallet'
import SwipeableListExample from './page/wallets'

AppRegistry.registerComponent('BillBiuBiu', () => StackNavigator({
    Home: {
        screen: BillBiuBiu,
        navigationOptions: () => ({
            header: null
          })
    },
    NewWallet: {
        screen: NewWallet,
    },
    Wallets: SwipeableListExample
}, {
        initialRouteName: 'Home',
        cardStyle: {
            backgroundColor: 'white'
        }
    }));
