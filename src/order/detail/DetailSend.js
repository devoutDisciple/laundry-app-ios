import React from 'react';
import CommonSylte from '../../style/common';
import { Text, View, StyleSheet } from 'react-native';

export default class OrderScreen extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {}

	render() {
		return (
			<View style={styles.detail_send}>
				<View style={styles.detail_common_title}>
					<Text>派送信息</Text>
				</View>
				<View style={styles.detail_send_content}>
					<View style={styles.detail_send_content_item}>
						<Text style={styles.detail_send_content_item_label}>派送时间: </Text>
						<Text style={styles.detail_send_content_item_text}>2020-04-05 20:18:32</Text>
					</View>
					<View style={styles.detail_send_content_item}>
						<Text style={styles.detail_send_content_item_label}>派送地点: </Text>
						<Text style={styles.detail_send_content_item_text}>幸福家园北门二号蜂巢柜子29格</Text>
					</View>
					<View style={styles.detail_send_content_item}>
						<Text style={styles.detail_send_content_item_label}>派送人: </Text>
						<Text style={styles.detail_send_content_item_text}>李二狗</Text>
					</View>
					<View style={styles.detail_send_content_item}>
						<Text style={styles.detail_send_content_item_label}>派送人电话: </Text>
						<Text style={styles.detail_send_content_item_text}>182110110110</Text>
					</View>
					<View style={styles.detail_send_content_item}>
						<Text style={styles.detail_send_content_item_label}>店铺名称: </Text>
						<Text style={styles.detail_send_content_item_text}>MOVING洗衣店</Text>
					</View>
					<View style={styles.detail_send_content_item}>
						<Text style={styles.detail_send_content_item_label}>店铺地址: </Text>
						<Text style={styles.detail_send_content_item_text}>广州市中山区405国道</Text>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	detail_common_title: CommonSylte.detail_common_title,
	detail_send: {
		backgroundColor: '#fff',
		padding: 10,
		marginTop: 10,
		borderRadius: 5,
	},
	detail_send_content_item: {
		flexDirection: 'row',
		marginBottom: 10,
	},
	detail_send_content_item_label: {
		width: 80,
	},
	detail_send_content_item_text: {
		flex: 1,
		color: '#8a8a8a',
	},
});
