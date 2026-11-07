import axios from '@/utils/axios'

/**
 * 统一请求
 * @param params
 */
export function api(params) {
  return axios({
    url: '/admin/' + params.Type,
    method: 'post',
    data: params
  })
}
