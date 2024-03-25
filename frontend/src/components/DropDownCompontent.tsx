import React, { Dispatch, useEffect, useState } from 'react';
import { StyleSheet, Text, ToastAndroid, View } from 'react-native';

import { Dropdown } from 'react-native-element-dropdown';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { votesType } from '@/play/Started/Voting';

interface data {
	label: string;
	value: string;
}

interface Props {
	index: number;
	data: data[];
	setVotes: Dispatch<React.SetStateAction<votesType[]>>;
	votes: votesType[];
}

const DropdownComponent = ({ data, setVotes, votes, index }: Props) => {
	const initalValue = votes.find((value) => value.index === index)?.vote;
	const [value, setValue] = useState<string | null>(null);

	const renderItem = (item: data) => {
		return (
			<View style={styles.item}>
				<Text style={styles.textItem}>{item.label}</Text>
				{item.value === value && (
					<MaterialCommunityIcons name='vote' size={24} color='black' />
				)}
			</View>
		);
	};

	useEffect(() => {
		if (!value) return;

		// Check if the vote already exists in the votes array
		const found = votes.find((vote) => vote.vote === value);

		if (found && found?.index !== index) {
			setValue(null);
			ToastAndroid.show(
				'Oops, already voted for this person',
				ToastAndroid.LONG,
			);
			return;
		}

		// Check if the index already exists in the votes array
		const indexExists = votes.findIndex((item) => item.index === index);

		// Create a new array with the updated or added object
		const updatedVotes =
			indexExists !== -1
				? votes.map((item) =>
						item.index === index ? { ...item, vote: value } : item,
				  )
				: [...votes, { index, vote: value }];

		// Update the state with the new array
		setVotes(updatedVotes);
	}, [value]);

	return (
		<Dropdown
			style={styles.dropdown}
			placeholderStyle={styles.placeholderStyle}
			selectedTextStyle={styles.selectedTextStyle}
			inputSearchStyle={styles.inputSearchStyle}
			iconStyle={styles.iconStyle}
			data={data}
			search
			maxHeight={300}
			labelField='label'
			valueField='value'
			placeholder='Select item'
			searchPlaceholder='Search...'
			value={value || initalValue}
			onChange={(item) => {
				setValue(item.value);
			}}
			renderLeftIcon={() => (
				<MaterialCommunityIcons name='vote' size={24} color='black' />
			)}
			renderItem={renderItem}
		/>
	);
};

export default DropdownComponent;

const styles = StyleSheet.create({
	dropdown: {
		margin: 16,
		height: 50,
		backgroundColor: 'white',
		borderRadius: 12,
		padding: 12,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,
		elevation: 2,
	},
	icon: {
		marginRight: 5,
	},
	item: {
		padding: 17,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	textItem: {
		flex: 1,
		fontSize: 16,
	},
	placeholderStyle: {
		fontSize: 16,
	},
	selectedTextStyle: {
		fontSize: 16,
	},
	iconStyle: {
		width: 20,
		height: 20,
	},
	inputSearchStyle: {
		height: 40,
		fontSize: 16,
	},
});
