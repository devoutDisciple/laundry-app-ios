import Axios from 'axios';
import message from './message';
import config from '../config/config';

Axios.defaults = Object.assign(Axios.defaults, {
    // `transformRequest` 允许在向服务器发送前，修改请求数据
    // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
    // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
    // transformRequest: [function (data) {
    // 	// 对 data 进行任意转换处理
    // 	return data;
    // }],
    baseURL: config.baseUrl,
    // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
    transformResponse: [
        function(data) {
            // 对 data 进行任意转换处理
            return data;
        },
    ],
    // `headers` 是即将被发送的自定义请求头
    // headers: {'X-Requested-With': 'XMLHttpRequest'},
    // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
    // 如果请求话费了超过 `timeout` 的时间，请求将被中断
    timeout: 30000,
    // `withCredentials` 表示跨域请求时是否需要使用凭证
    withCredentials: true, // 默认的
    // `auth` 表示应该使用 HTTP 基础验证，并提供凭据
    // 这将设置一个 `Authorization` 头，覆写掉现有的任意使用 `headers` 设置的自定义 `Authorization`头
});

// 添加响应拦截器
Axios.interceptors.response.use(
    function(res) {
        console.log(res);
        if (res.status !== 200) {
            message.warning('网络出小差了', '请稍后重试');
            return Promise.reject('系统错误');
        }
        return Promise.resolve(res.data);
    },
    function(error) {
        // 对响应错误做点什么
        if (error.response) {
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else {
            console.info('Error', error.message);
        }
        return Promise.reject(error);
    },
);

export default {
    get: (url = '', params = {}) => {
        return new Promise((resolve, reject) => {
            Axios({
                method: 'get',
                url: url,
                params: params,
            })
                .then(res => {
                    if (res.code === 200) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                })
                .catch(err => {
                    console.info(`服务端出错11: ${err}`);
                    reject(err);
                });
        });
    },
    post: (url = '', params = {}) => {
        return new Promise((resolve, reject) => {
            Axios({
                method: 'post',
                url: url,
                data: params,
            })
                .then(res => {
                    if (res.code === 200) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                })
                .catch(err => {
                    console.info(`服务端出错: ${err}`);
                    reject(err);
                });
        });
    },
    put: (url = '', params = {}) => {
        return new Promise((resolve, reject) => {
            Axios({
                method: 'put',
                url: url,
                data: params,
            })
                .then(res => {
                    if (res.code === 200) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                })
                .catch(err => {
                    console.info(`服务端出错: ${err}`);
                    reject(err);
                });
        });
    },
    delete: (url = '', params = {}) => {
        return new Promise((resolve, reject) => {
            Axios({
                method: 'delete',
                url: url,
                data: params,
            })
                .then(res => {
                    if (res.code === 200) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                })
                .catch(err => {
                    console.info(`服务端出错: ${err}`);
                    reject(err);
                });
        });
    },
};