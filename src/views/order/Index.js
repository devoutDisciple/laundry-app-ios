import React from 'react';
import Order from './component/Order';
import { Text, View } from 'react-native';
import SafeViewComponent from '@/component/SafeViewComponent';
import language from '@/language';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';

export default class OrderScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentPageIndex: 1,
		};
	}

	// 改变tab的时候
	changeTab(data) {
		this.setState({
			currentPageIndex: data.i + 1,
		});
	}

	render() {
		const { navigation } = this.props;
		let { currentPageIndex } = this.state;
		return (
			<SafeViewComponent>
				<View style={{ flex: 1 }}>
					<View
						style={{
							height: 50,
							marginTop: 20,
						}}
					>
						<ScrollableTabView
							tabBarActiveTextColor="#fb9dd0"
							tabBarInactiveTextColor="#333"
							tabBarUnderlineStyle={{
								backgroundColor: '#fb9dd0',
								borderWidth: 0,
								borderRadius: 3,
							}}
							initialPage={0}
							onChangeTab={this.changeTab.bind(this)}
							renderTabBar={() => <DefaultTabBar containerWidth={100} />}
						>
							<Text style={{ height: 0 }} tabLabel={language.orderScreen.all} />
							<Text style={{ height: 0 }} tabLabel={language.orderScreen.process} />
							<Text style={{ height: 0 }} tabLabel={language.orderScreen.wating} />
							<Text style={{ height: 0 }} tabLabel={language.orderScreen.complate} />
						</ScrollableTabView>
					</View>
					{currentPageIndex === 1 && <Order navigation={navigation} type="all" />}
					{currentPageIndex === 2 && <Order navigation={navigation} type="cleaning" />}
					{currentPageIndex === 3 && <Order navigation={navigation} type="receiving" />}
					{currentPageIndex === 4 && <Order navigation={navigation} type="finished" />}
				</View>
			</SafeViewComponent>
		);
	}
}
