import * as Application from 'expo-application';

import { Welcome } from '@/components/Welcome';
import Wrapper from '@/components/Wrapper';
import instance from '@/utils/db';
import useApp from '@/context/AppContext';
import useAuth from '@/context/AuthContext';
import { useEffect } from 'react';

const userId = Application.androidId;
const Home = () => {
	const { isLoggedIn, setIsLoggedIn } = useAuth();
	const { updateName } = useApp();

	useEffect(() => {
		if (isLoggedIn) return;

		(async () => {
			try {
				const response = await instance.post('/users', { uid: userId });
				const data = await response.data;

				if (response.status === 200) {
					setIsLoggedIn(true);
					data.name && updateName(data.name);
				}
			} catch (error) {
				setIsLoggedIn(false);
				console.log(error);
			}
		})();
	}, []);

	return (
		<Wrapper>
			<Welcome />
		</Wrapper>
	);
};

export default Home;
