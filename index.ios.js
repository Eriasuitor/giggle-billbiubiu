/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import { AppRegistry } from 'react-native';
import BillBiuBiu from './page/home'
import { StackNavigator } from 'react-navigation'
import NewWallet from './page/newWallet'
import Wallets from './page/wallets'
import AttributeEditor from  './page/attributeEditor'

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
    Wallets,
    AttributeEditor
}, {
        initialRouteName: 'Home',
        cardStyle: {
            backgroundColor: 'white'
        }
    }));
