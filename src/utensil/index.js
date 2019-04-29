import Taro, {
  Component
} from "@tarojs/taro";
import Http from "../server/api";

const Toast = (text, type) => {
  Taro.showToast({
    title: `${text}`,
    icon: type || 'none',
    duration: 2000
  })
}
//更新用户数据
const PostData = (uid, data) => {
  Http.post("WXDevelopment.ashx?t=18", {
      MemberId: uid,
      nickName: data.nickName,
      avatarUrl: data.avatarUrl,
      gender: data.gender
    })
    .then(rec => {})
    .catch(err => {});
}
//每日登陆积分
const dayIntegral = (uid) => {
  Http.post('WXDevelopment.ashx?t=31', {
      MemberId: uid
    })
    .then(rec => {
      if (rec.state === 200) {
        //  resolve(rec.parma);
      } else {

      }
    })
}
//邀请好友
const inviteFriends = (fid, uid) => {
  Http.post('WXDevelopment.ashx?t=33', {
      InviterId: fid,
      MemberId: uid
    })
    .then(rec => {
      if (rec.state === 200) {
        wx.removeStorageSync('InviterId')
      }
    })
}
//获取用户是否认证
const isUserCertification = (uid) => {
  Http.post('WXDevelopment.ashx?t=39', {
      MemberId: uid
    })
    .then(rec => {
      if(rec.state===200){
        rec.parma ?  Taro.setStorageSync("isUserCard", 2) : showUsercardModal()
      }
    })
}
//让用户去认证的弹窗(注：3:未认证，2:已认证)
const showUsercardModal=()=>{
  Taro.showModal({
    title: '提示',
    content: '发现您还没有进行实名认证,您必须要进行实名认证才能进行操作哦!',
    showCancel:true,
    cancelText:'我就逛逛',
    confirmText:'马上实名',
    success(res) {
      if (res.confirm) {
        Taro.navigateTo({
          url: '/pages/userlegalize/index'
        });
      } else if (res.cancel) {
        Taro.setStorageSync("isUserCard", 3)
      }
    }
  })
}
export {
  Toast,
  PostData,
  dayIntegral,
  inviteFriends,
  isUserCertification,
  showUsercardModal
}
