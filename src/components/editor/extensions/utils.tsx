export const uploadImageFn = async (file: File) => {
  console.log('Upload file logic');

  // Simulate upload delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const imageUrl = URL.createObjectURL(file);
  return imageUrl;
};

export const deleteImageFn = async (url: string): Promise<any> => {
  console.log('Delete file logic', url);

  // Simulate upload delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return true;
};
