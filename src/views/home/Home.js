import React from 'react';
import Swiper from './Swiper';
import Express from './Express';
import IconList from './IconList';
import Request from '@/util/Request';
import config from '@/config/config';
import StorageUtil from '@/util/Storage';
import Picker from 'react-native-picker';
import Loading from '@/component/Loading';
import Message from '@/component/Message';
import UpdateVersion from '@/util/Update';
import Spinner from 'react-native-spinkit';
import NavigationUtil from '@/util/NavigationUtil';
import VersionDialog from '@/component/VersionDialog';
import Icon from 'react-native-vector-icons/AntDesign';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Text, View, TouchableOpacity, ScrollView, Linking, Modal, RefreshControl } from 'react-native';

export default class HomeScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loadingVisible: false,
			shopList: [],
			shopid: '',
			versionSoftDialogVisible: false, // 非强制更新
			versionForceDialogVisible: false, // 强制更新
			previewModalVisible: false,
			swiperList: [],
			swiperIdx: 0, // 当前点击之后swiper所在的index
			cabinetList: [],
			previewSwiperList: [],
			freshLoading: false,
			adverList: [], // 店铺广告图片
		};
		this.locationClick = this.locationClick.bind(this);
		this.goAppStore = this.goAppStore.bind(this);
	}

	static navigationOptions = ({ navigation, navigationOptions }) => {
		// 自定义左右菜单
		return {
			headerTitle: 'MOVING洗衣',
			headerLeft: () => {
				let title = '';
				if (navigation.state.params && navigation.state.params.title) {
					title = navigation.state.params.title;
					if (title && title.length > 5) {
						title = `${title.substr(0, 5)}...`;
					}
				}
				return (
					<TouchableOpacity onPress={() => navigation.state.params.leftIconClick()}>
						<View
							style={{
								width: 150,
								flexDirection: 'row',
								alignItems: 'center',
								alignSelf: 'center',
								justifyContent: 'center',
							}}
						>
							<Icon style={{ width: 20, marginTop: 2 }} name="enviromento" size={16} color="#fb9dd0" />
							<Text style={{ flex: 1 }}>
								{title}
								{/* {navigation.state.params && navigation.state.params.title ? navigation.state.params.title : ''} */}
							</Text>
						</View>
					</TouchableOpacity>
				);
			},
			headerLeftContainerStyle: {
				padding: 10,
			},
			headerRight: () => {
				return (
					<TouchableOpacity onPress={() => navigation.state.params.rightIconClick()}>
						<Icon style={{ width: 20, marginTop: 2 }} name="customerservice" size={16} color="#fb9dd0" />
					</TouchableOpacity>
				);
			},
			headerRightContainerStyle: {
				padding: 10,
			},
			headerBackTitle: '返回',
			headerTitleStyle: {
				alignSelf: 'center',
				textAlign: 'center',
				flex: 1,
			},
			// 整个标题的样式
			headerStyle: {
				shadowColor: '#505050',
				shadowOffset: {
					width: 0,
					height: 3,
				},
				shadowOpacity: 0.3,
			},
		};
	};

	async componentDidMount() {
		const { setParams } = this.props.navigation;
		// 设置左右按钮的点击功能
		setParams({
			// 左侧按钮点击
			leftIconClick: () => this.locationClick(),
			// 右侧按钮点击
			rightIconClick: () => this.serviceClick(),
		});
		await this.onSearchData(true);
	}

	async onSearchData(flag) {
		let state = {};
		try {
			flag ? (state.loadingVisible = true) : (state.freshLoading = true);
			this.setState(state);
			// 获取版本信息
			await this.getVersion();
			// 获取所有商店
			let shopid = await this.getAllShop();
			// 获取快递柜子
			let cabinets = await this.getAllCabinetByShop(shopid);
			// 获取轮播图信息
			await this.getSwiperList(shopid);
			// 获取广告图
			if (cabinets && cabinets.length === 0) {
				await this.onSearchAdverList(shopid);
			}
			flag ? (state.loadingVisible = false) : (state.freshLoading = false);
			this.setState(state);
			// 获取用户信息
			await this.getCurrentUserInfo();
		} catch (error) {
			flag ? (state.loadingVisible = false) : (state.freshLoading = false);
			this.setState(state);
		}
	}

	// 查询广告图
	async onSearchAdverList(shopid) {
		let res = await Request.get('/shopAdver/list', { shopid });
		const adverList = res.data || [];
		this.setState({ adverList });
	}

	// 更新当前用户信息
	async getCurrentUserInfo() {
		let user = await StorageUtil.get('user');
		if (!user) {
			return;
		}
		let res = await Request.get('/user/getUserByUserid', { userid: user.id });
		let currentUser = res.data || '';
		await StorageUtil.set('user', currentUser);
	}

	// 获取当前版本
	async getVersion() {
		let res = await Request.get('/version/getCurrentVersion');
		let versionDetail = res.data;
		if (!versionDetail.version.includes(config.currentVersion)) {
			if (versionDetail.force === 1) {
				this.setState({
					versionSoftDialogVisible: true,
				});
			}
			if (versionDetail.force === 2) {
				this.setState({
					versionForceDialogVisible: true,
				});
			}
		}
	}

	// 获取所有商店信息
	async getAllShop() {
		// 获取所有门店列表
		let res = await Request.get('/shop/all');
		let data = res.data;
		let shop = await StorageUtil.get('shop');
		// 如果没有缓存过商店
		if (!shop) {
			shop = (data && data[0]) || {};
			// 保存设置的商店
			await StorageUtil.set('shop', shop);
		}

		if (shop && data) {
			let currentRes = data.filter(item => item.id === shop.id);
			shop = (currentRes && currentRes[0]) || {};
			// 保存设置的商店
			await StorageUtil.set('shop', shop);
		}

		await this.setState({ shopList: data || [], shopid: shop.id }, () => {
			let { navigation } = this.props;
			navigation.navigate('HomeScreen', {
				title: shop.name || '',
			});
		});
		return shop.id;
	}

	// 根据商店id获取快递柜子
	async getAllCabinetByShop(shopid) {
		if (!shopid) {
			return;
		}
		let res = await Request.get('/cabinet/getAllByShop', { shopid });
		this.setState({ cabinetList: res.data || [] });
		return res.data || [];
	}

	// 获取swiper
	async getSwiperList(shopid) {
		if (!shopid) {
			return;
		}
		// 获取当前门店的轮播图列表
		let res = await Request.get('/swiper/getAllById', { shopid });
		this.setState({ swiperList: res.data || [] });
	}

	// 跳转更新
	goAppStore() {
		UpdateVersion.updateVersion();
	}

	// 位置点击
	locationClick() {
		let { shopList } = this.state,
			{ navigation } = this.props,
			pickData = [];
		if (Array.isArray(shopList)) {
			shopList.forEach(item => {
				pickData.push(item.name);
			});
		}
		Picker.init({
			...config.pickCommonConfig,
			pickerData: pickData,
			// selectedValue: ['广州3号洗衣店'],
			onPickerConfirm: async res => {
				let name = res[0];
				let selectShop = {};
				shopList.forEach(item => {
					if (name === item.name) {
						selectShop = item;
					}
				});
				this.setState({ shopid: selectShop.id }, async () => {
					await StorageUtil.set('shop', selectShop);
					NavigationUtil.reset(navigation, 'HomeScreen');
					// navigation.navigate('HomeScreen', {
					// 	title: name || '',
					// });
				});
			},
		});
		Picker.show();
	}

	// 点击客服按钮
	async serviceClick() {
		let shop = await StorageUtil.get('shop');
		let tel = `tel:${shop.phone}`; // 目标电话
		Linking.canOpenURL(tel)
			.then(supported => {
				if (!supported) {
					Message.warning('商家电话', shop.phone);
				} else {
					return Linking.openURL(tel);
				}
			})
			.catch(error => console.log('tel error', error));
	}

	// 点击图片预览
	onShowPreviewModal(idx) {
		let { swiperList } = this.state,
			list = [];
		if (Array.isArray(swiperList)) {
			swiperList.forEach(item => list.push({ url: `${config.baseUrl}/${item.url}` }));
		}
		this.setState({ previewModalVisible: true, previewSwiperList: list, swiperIdx: idx });
	}

	render() {
		let { navigation } = this.props;
		let {
			loadingVisible,
			shopid,
			versionForceDialogVisible,
			versionSoftDialogVisible,
			cabinetList,
			swiperList,
			swiperIdx,
			freshLoading,
			previewSwiperList,
			previewModalVisible,
			adverList,
		} = this.state;
		return (
			<View style={{ flex: 1 }}>
				<ScrollView
					style={{ flex: 1 }}
					showsVerticalScrollIndicator={false}
					refreshControl={<RefreshControl refreshing={freshLoading} onRefresh={this.onSearchData.bind(this, false)} />}
				>
					{/* 轮播图 */}
					<Swiper
						navigation={navigation}
						shopid={shopid}
						swiperList={swiperList}
						onShowPreviewModal={this.onShowPreviewModal.bind(this)}
					/>
					{/* 图标选项 */}
					<IconList navigation={navigation} />
					{/* 快递柜子 */}
					<Express
						shopid={shopid}
						navigation={navigation}
						cabinetList={cabinetList}
						adverList={adverList}
						setLoading={flag => this.setState({ loadingVisible: flag })}
					/>
				</ScrollView>
				{/* 非强制版本 */}
				{versionSoftDialogVisible && (
					<VersionDialog
						title="版本更新"
						okText="立即更新"
						cancelText="取消更新"
						desc="有新版本更新,请更新至最新版本"
						onOk={this.goAppStore.bind(this)}
						onCancel={() => {
							this.setState({ versionSoftDialogVisible: false });
						}}
						cancelShow={true}
					/>
				)}
				{/* 强制更新版本 */}
				{versionForceDialogVisible && (
					<VersionDialog
						title="版本更新"
						okText="立即更新"
						desc="有新版本更新,请立即更新至最新版本"
						onOk={this.goAppStore.bind(this)}
						onCancel={() => {}}
						cancelShow={false}
					/>
				)}
				{previewModalVisible && (
					<Modal visible={true} transparent={true}>
						<ImageViewer
							imageUrls={previewSwiperList}
							failImageSource="暂无图片信息"
							index={swiperIdx}
							onClick={() => this.setState({ previewModalVisible: false })}
							loadingRender={() => <Spinner type="Bounce" color="#fb9bcd" />}
						/>
					</Modal>
				)}
				<Loading visible={loadingVisible} />
			</View>
		);
	}
}
