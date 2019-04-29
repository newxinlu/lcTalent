import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, Button } from "@tarojs/components";
import "./index.less";
import logo from '../../static/logo.jpg'

class Index extends Component {
  config = {
    navigationBarTitleText: "授权登录"
  };
  constructor(props) {
    super(props);
    this.state = { isLogin: false };
  }
  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps);
  }
  componentDidMount() {}
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  openJump(url) {
    Taro.navigateTo({
      url: url
    });
  }
  bindGetUserInfo(e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      //授权成功后，跳转进入小程序首页
      wx.switchTab({
        url: "/pages/index/index"
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: "警告",
        content: "您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!",
        showCancel: false,
        confirmText: "返回授权",
        success: function(res) {
          if (res.confirm) {
          }
        }
      });
    }
  }
  render() {
    return (
      <View className='loginmain'>
        <Image src={logo}></Image>
       <View>地产推推乐申请获得以下权限</View>
        <View>获得你的公开信息(昵称,头像等);</View>
        <Button open-type="getUserInfo" onGetUserInfo={this.bindGetUserInfo}>
          点击授权
        </Button>
      </View>
    );
  }
}

export default Index;
