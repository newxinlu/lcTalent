import Taro from '@tarojs/taro'



// production:https://ttl.liangcaihr.com
// development:http://tthappy.wzxlkj.cn
let root = process.env.API_URL;
const headers = 'application/x-www-form-urlencoded'

const Http = {
  get(url, data) {
    return   this.createHttp('GET', url, data)
  },
  post(url,data){
    return  this.createHttp('POST', url, data)
  },
  async createHttp(method,rooturl,data) {
    return new Promise(async (resolve,reject) => {
      Taro.showNavigationBarLoading()
      let url=`https://ttl.liangcaihr.com/admin/ashx/${rooturl}`;
      try {
        const res = await Taro.request({
          url,
          method,
          data, // 可以自己定义一些公共的参数，比如token,session
          header: {
            'content-type': headers
          }
        })
        Taro.hideNavigationBarLoading()
        switch (res.statusCode) {
          case 200:
            return resolve(res.data)
          default:
            console.log(res.data.message)
            reject(new Error(res.data.msg))
        }
      } catch (error) {
        Taro.hideNavigationBarLoading()
        reject(new Error('网络请求出错'))
      }
    })
  }
}
export default Http;
