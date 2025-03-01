import React from 'react';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import language from '@/language';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default class Waller extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {}

	// 点击成为会员
	beMember() {
		let { navigation } = this.props;
		navigation.navigate('MemberScreen');
	}

	// 点击余额
	onSearchBill() {
		let { navigation } = this.props;
		return navigation.navigate('BillScreen');
	}

	render() {
		let { user } = this.props;
		return (
			<View>
				<View style={styles.my_wallet}>
					{/* <TouchableOpacity style={styles.my_wallet_chunk} onPress={this.onSearchBill.bind(this)}> */}
					<TouchableOpacity style={styles.my_wallet_chunk}>
						<Text style={styles.my_wallet_chunk_top}>{user.balance}</Text>
						<Text style={styles.my_wallet_chunk_bottom}>{language.myScreen.myAccount}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.my_wallet_chunk}>
						<Text style={styles.my_wallet_chunk_top}>{user.integral}</Text>
						<Text style={styles.my_wallet_chunk_bottom}>{language.myScreen.myIntegral}</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.my_member}>
					<View style={styles.my_member_left}>
						<View style={styles.my_member_left_icon}>
							<Image style={{ width: 20, height: 20 }} source={require('@/asserts/public/member.png')} />
						</View>
						<View style={styles.my_member_left_text}>
							<Text style={{ color: '#fff' }}>{language.common.vipUser}</Text>
						</View>
					</View>
					<View style={styles.my_member_right}>
						<Button
							onPress={this.beMember.bind(this)}
							icon={<Icon name="right" size={15} color="#b1a082" />}
							iconRight
							title={language.homeScreen.member}
							buttonStyle={{
								backgroundColor: '#f8eacf',
								borderRadius: 10,
								width: 100,
							}}
							titleStyle={{
								color: '#333',
								fontSize: 16,
							}}
						/>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	my_wallet: {
		height: 80,
		marginTop: 10,
		flexDirection: 'row',
	},
	my_wallet_chunk: {
		width: 100,
		alignItems: 'center',
	},
	my_wallet_chunk_top: {
		fontSize: 18,
		maxWidth: 129,
		maxHeight: 20,
		marginVertical: 10,
		color: '#fb9dd0',
		fontWeight: '800',
	},
	my_wallet_chunk_bottom: {
		color: '#8a8a8a',
		fontSize: 13,
	},
	my_member: {
		backgroundColor: '#3c3e57',
		height: 50,
		flexDirection: 'row',
		paddingRight: 10,
		alignItems: 'center',
	},
	my_member_left: {
		flex: 1,
		height: 30,
		paddingHorizontal: 9,
		flexDirection: 'row',
	},
	my_member_left_icon: {
		width: 30,
		justifyContent: 'center',
	},
	my_member_left_text: {
		justifyContent: 'center',
	},
	my_member_right: {
		width: 110,
	},
});
