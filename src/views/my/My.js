import React from 'react';
import My_Header from './Header';
import My_Wallert from './Wallet';
import Request from '@/util/Request';
import Storage from '@/util/Storage';
import ListItem from '@/component/ListItem';
import Icon from 'react-native-vector-icons/AntDesign';
import UserUtil from '@/util/UserUtil';
import Toast from '@/component/Toast';
import language from '@/language';
import SafeViewComponent from '@/component/SafeViewComponent';
import { StyleSheet, TouchableOpacity, ScrollView, View, RefreshControl } from 'react-native';

export default class MyScreen extends React.Component {
	static navigationOptions = ({ navigation, navigationOptions }) => {
		return {
			headerTitle: '',
			headerRight: () => {
				return (
					<TouchableOpacity onPress={() => navigation.state.params.rightIconClick()}>
						<Icon style={{ width: 20, marginTop: 3, marginRight: 10 }} name="setting" size={20} color="#333" />
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
		this.state = {
			user: {},
			loading: false,
		};
	}

	async componentDidMount() {
		// 增加设置按钮点击功能
		const { setParams } = this.props.navigation;
		setParams({
			rightIconClick: () => this.setIconClick(),
		});
		// 获取用户信息
		await this.getUserInfo();
	}

	// 获取用户信息
	async getUserInfo() {
		this.setState({ loading: true });
		let { navigation } = this.props;
		// 获取用户id的值
		let currentUser = await Storage.get('user');
		let userid = currentUser.id;
		if (!userid) {
			return;
		}
		let res = await Request.get('/user/getUserByUserid', { userid });
		let user = res.data || '';
		await UserUtil.hasUser(user, navigation);
		await Storage.set('user', user);
		this.setState({ user: user, loading: false });
	}

	// 下拉刷新的时候
	async refreshing() {
		await this.getUserInfo();
	}

	// 点击设置按钮
	setIconClick() {
		this.props.navigation.navigate('MySetting');
	}

	// 判断是不是会员
	async judgeMember() {
		return new Promise(async (resolve, reject) => {
			let { navigation } = this.props;
			let user = await Storage.get('user');
			// 如果用户没有登录
			if (!user) {
				reject();
				Toast.warning('请先登录!');
				return setTimeout(() => {
					navigation.navigate('LoginScreen');
				}, 2000);
			}
			resolve(user);
		});
	}

	// 点击listItem的时候
	onPressListItem(key) {
		const { navigation } = this.props;
		// 点击我的地址
		if (key === 'address') {
			return navigation.navigate('MyAddressScreen');
		}
		// 点击积分兑换的时候
		if (key === 'intergralGoods') {
			return navigation.navigate('IntergralScreen');
		}
		// 点击账单的时候
		if (key === 'bill') {
			return navigation.navigate('BillScreen');
		}
		// 点击积分兑换记录的时候
		if (key === 'intergralRecord') {
			return navigation.navigate('IntergralRecordScreen');
		}
		// 点击余额充值
		if (key === 'account') {
			return navigation.navigate('ReChargeScreen', { type: 'recharge' });
		}
		// 点击意见反馈
		if (key === 'suggestion') {
			return navigation.navigate('SuggestionScreen');
		}
		// 点击关于我们
		if (key === 'aboutUs') {
			return navigation.navigate('ConcatUsScreen');
		}
		// 点击联系我们
		if (key === 'concatUs') {
			return navigation.navigate('ConcatUsScreen');
		}
	}

	render() {
		let { user, loading } = this.state;
		return (
			<SafeViewComponent>
				<ScrollView
					style={styles.container}
					showsVerticalScrollIndicator={false}
					refreshControl={<RefreshControl refreshing={loading} onRefresh={this.refreshing.bind(this)} />}
				>
					<My_Header navigation={this.props.navigation} user={user} getUserInfo={this.getUserInfo.bind(this)} />
					<My_Wallert navigation={this.props.navigation} user={user} />
					<View style={{ height: 10 }} />
					<ListItem
						iconName="creditcard"
						text={language.myScreen.balanceRecharge}
						onPress={this.onPressListItem.bind(this, 'account')}
					/>
					<ListItem
						iconName="staro"
						text={language.homeScreen.shop}
						onPress={this.onPressListItem.bind(this, 'intergralGoods')}
					/>
					{/* <ListItem iconName="linechart" text="MOVING账单" onPress={this.onPressListItem.bind(this, 'bill')} /> */}
					<ListItem
						iconName="enviromento"
						text={language.myScreen.myAddress}
						onPress={this.onPressListItem.bind(this, 'address')}
					/>
					<ListItem
						iconName="notification"
						text={language.myScreen.options}
						onPress={this.onPressListItem.bind(this, 'suggestion')}
					/>
					<ListItem iconName="team" text={language.myScreen.aboutUs} onPress={this.onPressListItem.bind(this, 'aboutUs')} />
					<View style={styles.btm_empty} />
				</ScrollView>
			</SafeViewComponent>
		);
	}
}

// 展示头像的view高度
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 10,
		marginTop: 10,
	},
	btm_empty: {
		height: 20,
	},
});
