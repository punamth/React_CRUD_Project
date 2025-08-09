import { useMemo } from 'react';

// Helper function to get full image URL
const getImageUrl = (imageUrl: string | null | undefined, imageFileName?: string): string | null => {
	if (imageUrl) {
		// If it's already a full URL, return as is
		if (imageUrl.startsWith('http')) {
			return imageUrl;
		}
		// If it's a relative URL, prefix with backend base URL
		return `https://localhost:5001${imageUrl}`;
	}
	
	if (imageFileName) {
		// Use the dedicated image endpoint
		return `https://localhost:5001/api/Product/image/${imageFileName}`;
	}
	
	return null;
};

interface UseProductImageProps {
	imageUrl?: string | null;
	imageFileName?: string;
	productName: string;
}

interface UseProductImageReturn {
	fullImageUrl: string | null;
	hasImage: boolean;
	handleImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export const useProductImage = ({ imageUrl, imageFileName }: UseProductImageProps): UseProductImageReturn => {
	const fullImageUrl = useMemo(() => {
		return getImageUrl(imageUrl, imageFileName);
	}, [imageUrl, imageFileName]);

	const hasImage = useMemo(() => {
		return !!fullImageUrl;
	}, [fullImageUrl]);

	const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
		console.error('Image failed to load:', fullImageUrl);
		// Show placeholder when image fails to load
		e.currentTarget.style.display = 'none';
		const placeholder = e.currentTarget.parentElement?.querySelector('.image-placeholder');
		if (placeholder) {
			placeholder.classList.remove('hidden');
		}
	};
	
	return {
		fullImageUrl,
		hasImage,
		handleImageError,
		
	};
}; 