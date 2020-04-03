/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import Request from '../../util/Request';
import config from '../../config/config';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as WeChat from 'react-native-wechat';
import Toast from '../../component/Toast';

export default class AllOrder extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {}

	// 点击去支付
	async payOrder() {
		try {
			// let isWXAppInstalled = await WeChat.isWXAppInstalled();
			// if (!isWXAppInstalled) {
			// 	return Toast.warning('未下载微信');
			// }
			let result = await Request.post('/pay/payOrder');
			let data = result.data;
			let params = {
				partnerId: config.partnerId, // 商家向财付通申请的商家ID
				prepayId: data.prepay_id, // 预支付订单ID
				nonceStr: data.nonce_str[0], // 随机串
				timeStamp: new Date().getTime(), // 时间戳
				package: config.package, // 商家根据财付通文档填写的数据和签名
				sign: data.sign[0], // 商家根据微信开放平台文档对数据做的签名
			};
			// 第三步，调起微信客户端支付
			WeChat.pay(params)
				.then(response => {
					let errorCode = Number(response.errCode);
					if (errorCode === 0) {
						Toast.success('支付成功');
						// TODO: 这里处理支付成功后的业务逻辑，比如支付成功跳转页面、清空购物车。。。。
						// .....
					} else {
						Toast.error(response.errStr);
					}
				})
				.catch(error => {
					console.log(error);
					let errorCode = Number(error.code);
					if (errorCode === -2) {
						Toast.warning('已取消支付');
					} else {
						Toast.error('支付失败');
					}
				});
		} catch (error) {
			return Toast.warning('系统开小差了，请稍后重试');
		}
	}

	// 点击查看详情页面
	onSearchDetail(id) {
		const { navigation } = this.props;
		navigation.navigate('OrderDetailScreen', {
			id: id,
			hello: 'world',
		});
	}

	render() {
		const { id, title, imgUrl, time, address, goods, money } = this.props;
		return (
			<View style={styles.order_item}>
				<View style={styles.order_item_left}>
					<Image style={styles.order_item_left_img} source={imgUrl} />
					{/* <Image style={{ width: 50, height: 50 }} source={{ uri: 'https://facebook.github.io/react-native/img/tiny_logo.png' }} /> */}
					{/* <Image style={{ width: 50, height: 50 }} source={{ uri: 'http://i.imgur.com/UePbdph.jpg' }} /> */}
				</View>
				<View style={styles.order_item_right}>
					<View style={styles.order_item_right_title}>
						<View style={styles.order_item_right_title_left}>
							<Text style={styles.font_title_style}>{title}</Text>
						</View>
						<View style={styles.order_item_right_title_right}>
							<Text style={styles.font_title_style}>待支付</Text>
						</View>
					</View>
					<View style={styles.order_item_right_time}>
						<Text style={{ fontSize: 10, color: '#333' }}>{time}</Text>
					</View>
					<TouchableOpacity onPress={this.onSearchDetail.bind(this, id)}>
						<View style={styles.order_item_right_adrress}>
							<Text style={styles.font_desc_style}>取货地点：{address}</Text>
						</View>
						<View style={styles.order_item_right_goods}>
							<View style={styles.order_item_right_goods_left}>
								<Text style={styles.font_desc_style}>{goods}</Text>
							</View>
							<View style={styles.order_item_right_goods_right}>
								<Text style={styles.font_desc_style}>￥ {money}</Text>
							</View>
						</View>
					</TouchableOpacity>
					<View style={styles.order_item_right_bottom}>
						<TouchableOpacity onPress={this.payOrder.bind(this)} style={styles.order_item_right_bottom_btn}>
							<Text style={styles.order_pay_font}>去支付</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}
}

const order_item_left_width = 35;
const styles = StyleSheet.create({
	font_title_style: {
		fontSize: 14,
		color: '#606060',
	},
	font_desc_style: {
		fontSize: 12,
		color: '#333',
		lineHeight: 20,
	},
	order_item: {
		height: 180,
		margin: 10,
		marginBottom: 0,
		backgroundColor: '#fff',
		flexDirection: 'row',
		padding: 10,
	},
	order_item_left: {
		width: order_item_left_width,
		height: order_item_left_width,
	},
	order_item_left_img: {
		width: order_item_left_width,
		height: order_item_left_width,
	},
	order_item_right: {
		flex: 1,
		marginLeft: 10,
	},
	order_item_right_title: {
		height: 20,
		justifyContent: 'center',
		flexDirection: 'row',
	},
	order_item_right_title_left: {
		flex: 1,
	},
	order_item_right_title_right: {
		width: 50,
		alignItems: 'flex-end',
	},
	order_item_right_time: {
		height: 20,
		justifyContent: 'center',
		borderBottomColor: '#f2f2f2',
		borderBottomWidth: 1,
	},
	order_item_right_adrress: {
		marginTop: 5,
		height: 50,
	},
	order_item_right_goods: {
		flexDirection: 'row',
	},
	order_item_right_goods_left: {
		flex: 1,
	},
	order_item_right_goods_right: {
		width: 70,
		alignItems: 'flex-end',
	},
	order_item_right_bottom: {
		height: 50,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
	},
	order_item_right_bottom_btn: {
		width: 60,
		padding: 5,
		borderWidth: 1,
		borderColor: '#fb9dd0',
		alignItems: 'center',
		borderRadius: 5,
	},
	order_pay_font: {
		color: '#fb9dd0',
	},
});
