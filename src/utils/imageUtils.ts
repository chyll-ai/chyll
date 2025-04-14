
import { loadImage, removeBackground } from '@huggingface/transformers';

export const processLogoWithBackgroundRemoval = async (imageUrl: string): Promise<string> => {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Load the image
    const image = await loadImage(blob);

    // Remove background
    const processedBlob = await removeBackground(image);

    // Convert processed blob to data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(processedBlob);
    });
  } catch (error) {
    console.error('Background removal failed:', error);
    return imageUrl; // Fallback to original image if processing fails
  }
};
