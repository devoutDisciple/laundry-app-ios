/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import My_Header from './Header';
import My_Wallert from './Wallet';
import ListItem from './ListItem';
import Icon from 'react-native-vector-icons/AntDesign';
import {StyleSheet, TouchableOpacity, ScrollView, View} from 'react-native';

export default class MyScreen extends React.Component {
    static navigationOptions = ({navigation, navigationOptions}) => {
        return {
            headerTitle: '',
            headerRight: () => {
                return (
                    <TouchableOpacity
                        onPress={() =>
                            navigation.state.params.rightIconClick()
                        }>
                        <Icon
                            style={{width: 20, marginTop: 3, marginRight: 3}}
                            name="setting"
                            size={20}
                            color="#333"
                        />
                    </TouchableOpacity>
                );
            },
            headerStyle: {
                borderWidth: 0,
                borderBottomColor: '#fff',
            },
        };
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const {setParams} = this.props.navigation;
        setParams({
            rightIconClick: () => this.setIconClick(),
        });
    }

    // 点击设置按钮
    setIconClick() {
        this.props.navigation.navigate('My_Setting');
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <My_Header navigation={this.props.navigation} />
                <My_Wallert navigation={this.props.navigation} />
                <View style={{height: 20}} />
                <ListItem iconName="creditcard" text="我的点评" />
                <ListItem iconName="creditcard" text="车牌号" />
                <ListItem iconName="creditcard" text="hello" />
                <ListItem iconName="creditcard" text="world" />
                <ListItem iconName="creditcard" text="车牌号" />
                <ListItem iconName="creditcard" text="hello" />
                <ListItem iconName="creditcard" text="车牌号" />
                <ListItem iconName="creditcard" text="hello" />
            </ScrollView>
        );
    }
}
// 展示头像的view高度
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
});
