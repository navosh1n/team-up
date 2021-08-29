import userStorage from '@/services/storage/user-storage';
import authService from '@/services/api/auth-service';

const actions = {
  async signInGoogle({ dispatch }) {
    const { email, photoURL } = await authService.signInGoogle();
    const user = await dispatch('users/getUserByEmail', email, { root: true });

    if (!user) {
      await dispatch('signOutGoogle', false);
      throw Error('Пользователь не найден. Обратитесь к администратору.');
    }

    await dispatch('users/updateUser', { ...user, photo: photoURL }, { root: true });
    userStorage.userId = user.id;
  },

  signOutGoogle(ctx, redirect) {
    return authService.signOutGoogle(redirect);
  },
};

export default { namespaced: true, actions };
