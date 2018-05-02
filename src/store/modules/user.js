import Cookies from 'js-cookie';
import {getToken} from '../../utils/auth';
import {login} from '../../api/login';

const user = {
    state: {
        user: '',
        status: '',
        code: '',
        token: getToken(),
        name: '',
        avatar: '',
        introduction: '',
        roles: []
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        logout (state, vm) {
            Cookies.remove('user');
            localStorage.clear();
        }
    },
    actions: {
        Login({ commit }, userInfo) {
            const usercode = userInfo.userCode.trim();
            return new Promise((resolve, reject) => {
                login(usercode, userInfo.password).then(response => {
                    const data = response.data;
                    Cookies.set('Token', data.token); //登录成功后将token存储在cookie之中
                    Cookies.set('user', usercode);
                    commit('SET_TOKEN', data.token);
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        }
    }
};

export default user;
