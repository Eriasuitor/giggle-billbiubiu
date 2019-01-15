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
import AttributeEditor1 from  './page/attributeEditor.1'
import ListPresenter from  './page/listPresenter'

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
    AttributeEditor,
    ListPresenter,
    AttributeEditor1
}, {
        initialRouteName: 'AttributeEditor1',
        cardStyle: {
            backgroundColor: 'white'
        }
    }));
