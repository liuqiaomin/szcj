import {api} from '@/api/api'
import {setItem, getItem, removeAllItem} from '@/utils/storage'
import {TOKEN, USERINFO} from '@/constant'
import {setTimeStamp} from '@/utils/auth'
import {formatPermissionList, lowerCase} from '@/utils/index'
import router, {resetRouter} from '@/router'
import {ElMessage} from "element-plus";


export default {
    namespaced: true,
    state: () => ({
        //token的初始值从storage里取
        token: getItem(TOKEN) || '',
        userInfo: getItem(USERINFO) || {},
        roles: [],
        buttons: []
    }),
    mutations: {
        setToken(state, token) {
            state.token = token
            setItem(TOKEN, token)
        },
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo
            setItem(USERINFO, userInfo)

        },
        setRoles: (state, roles) => {
            state.roles = roles
        },
        setButtons: (state, buttons) => {
            state.buttons = buttons
        },
    },
    actions: {
        login(context, userInfo) {
            const {username, password, captcha_code, code_key} = userInfo
            return new Promise((resolve, reject) => {
                api({
                    Type: 'login',
                    username,
                    password,
                    captcha_code,
                    code_key,
                })
                    .then(data => {
                        this.commit('user/setToken', data.bizobj.sys_token)
                        this.commit('user/setUserInfo', data.bizobj)
                        // 保存登录时间
                        setTimeStamp()
                        resolve()
                    })
                    .catch(err => {
                        reject(err)
                    })

            })
        },
        getPermissionData(context) {
            return new Promise((resolve, reject) => {
                api({ Type: 'getPermission' })
                    .then(data => {
                        let obj = formatPermissionList(data.bizobj)
                        console.log(obj)
                        let role_arr = obj.role_arr//菜单权限
                        let button_arr = obj.button_arr//button权限
                        let info = {
                            roles: role_arr
                        }
                        if(role_arr.length == 0){
                            ElMessage.error("您登录的账号暂无权限或登录过期！") // 提示错误信息
                            this.dispatch('user/logout')
                        }
                        this.commit('user/setRoles', role_arr)
                        this.commit('user/setButtons', button_arr)
                        resolve(info)
                    })
                    .catch(err => {

                    })
            })
        },
        logout() {
            resetRouter()
            this.commit('user/setToken', '')
            this.commit('user/setUserInfo', {})
            this.commit('user/setRoles', [])
            this.commit('user/setButtons', [])
            this.commit('app/removeTagsView', {
                type: 'all'
            })
            removeAllItem()
            router.push('/login')
        }
    }
}
