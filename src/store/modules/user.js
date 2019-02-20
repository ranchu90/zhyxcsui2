import Cookies from 'js-cookie';
import {getUser,setUser, removeUser} from '../../utils/auth';
import {login, logout} from '../../api/login';

const user = {
    state: {
        user: getUser(),
        status: '',
        code: '',
        // token: getToken(),
        name: '',
        avatar: '',
        introduction: '',
        roles: '',
        systemVersion: ''
    },
    mutations: {
        // SET_TOKEN: (state, token) => {
        //     state.token = token;
        // },
        SET_USER: (state, user) => {
            state.user = user;
        },
        LOGOUT (state, vm) {
            // Cookies.remove('user');
            // removeToken();
            removeUser();
            // state.token = '';
            state.user = '';
            localStorage.clear();
        },
        CLEAR_INFO: (state) => {
            Cookies.remove('user');
            // removeToken();
            // state.token = '';
            removeUser();
            state.user = '';
        }
    },
    actions: {
        Login({ commit }, userInfo) {
            const usercode = userInfo.userCode.trim();
            const systemVersion = userInfo.system.trim();

            return new Promise((resolve, reject) => {
                login(usercode, userInfo.password).then(response => {
                    const data = response.data;
                    if (data.hasOwnProperty('state') && data.state == 'success') {
                        // setToken(data.token); //登录成功后将token存储在cookie之中
                        // Cookies.set('user', data.user);
                        setUser(data.user);
                        this.state.systemVersion = systemVersion;
                        commit('SET_USER', data.user);
                    } else {
                        reject(data);
                    }
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },
        Logout({commit}) {
            return new Promise((resolve, reject) => {
                logout().then(response => {
                    const data = response.data;
                    if (data.state){
                        commit('LOGOUT');
                    }
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        }
    }
};

export default user;
