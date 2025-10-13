import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from './config';

const storage = getStorage();

export async function uploadRecipeImage(file: File, recipeId: string): Promise<string> {
  if (!auth.currentUser) {
    throw new Error('User not authenticated');
  }

  const filePath = `recipes/${auth.currentUser.uid}/${recipeId}/${file.name}`;
  const storageRef = ref(storage, filePath);

  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
}