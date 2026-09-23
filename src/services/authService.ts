import { useAppStore } from '../store/useAppStore';
import { User, UserRole } from '../types';
import { DEMO_USERS } from '../data/mockSeed';

export const loginWithRole = (role: UserRole): User => {
  useAppStore.getState().login(role);
  return DEMO_USERS[role];
};

export const loginWithCredentials = (email: string, role: UserRole = 'project_manager'): void => {
  useAppStore.getState().login(email, role);
};

export const logoutUser = (): void => {
  useAppStore.getState().logout();
};

export const getCurrentUser = (): User | null => {
  return useAppStore.getState().currentUser;
};
