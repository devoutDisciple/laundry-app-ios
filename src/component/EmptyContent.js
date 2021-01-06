import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default class EmptyContent extends React.Component {
	render() {
		return (
			<View style={styles.empty}>
				<Text style={{ fontSize: 18, color: '#bfbfbf' }}>暂无数据</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	empty: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
