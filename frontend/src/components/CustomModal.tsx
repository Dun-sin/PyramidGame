import { Modal, Portal } from 'react-native-paper';
import React, { ReactNode } from 'react';

import { View } from 'react-native';

const CustomModal = ({
	children,
	hideModal,
	visible,
}: {
	children: ReactNode;
	visible: boolean;
	hideModal: () => void;
}) => {
	return (
		<Portal>
			<Modal visible={visible} onDismiss={hideModal}>
				<View className='flex items-center justify-center w-screen'>
					{children}
				</View>
			</Modal>
		</Portal>
	);
};

export default CustomModal;
