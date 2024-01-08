import { Helmet } from 'react-helmet-async'

export const useHelmelMeta = () => {
    
	return (
		<Helmet>
			<title>Buitar</title>
			<link rel="canonical" href="https://www.tacobell.com/" />
		</Helmet>
	)
}
