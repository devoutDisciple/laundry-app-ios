/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, View} from 'react-native';

export default class OrderScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log(3);
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Text>进行中</Text>
            </View>
        );
    }
}
