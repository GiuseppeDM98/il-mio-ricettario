import { auth } from './config';

export function getCurrentUser() {
  return auth.currentUser;
}