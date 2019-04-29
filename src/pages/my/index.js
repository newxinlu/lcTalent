import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./index.less";
import { connect } from "@tarojs/redux";
import Http from "../../server/api";
import {
  Toast,
  PostData,
  inviteFriends,
  showUsercardModal
} from "../../utensil/index";
import { Userpop } from "../propsview/userpop";
class Index extends Component {
  config = {
    navigationBarTitleText: "我的"
  };
  constructor(props) {
    super(props);
    const value = Taro.getStorageSync("openid");
    this.state = {
      isLogin: value,
      userinfo: {},
      userid: Taro.getStorageSync("userid"),
      confirm: false,
      isProtocol: Taro.getStorageSync("isProtocol"),
      userIntegral: 0,
      InviterId: Taro.getStorageSync("InviterId"),
      userBalance: 0,
      isuserCard: Taro.getStorageSync("isUserCard")
    };
  }
  componentWillReceiveProps(nextProps) {
   // console.log(this.props, nextProps);
  }
  componentDidMount() {
    let vm = this;
    if (this.state.isLogin) {
      Taro.getUserInfo({
        success(rec) {
          if (rec.errMsg == "getUserInfo:ok") {
            vm.setState({
              userinfo: JSON.parse(rec.rawData)
            });
          }
        }
      });
    }
  }
  handleCall = tel => {
    Taro.makePhoneCall({
      phoneNumber: tel
    });
  };
  componentWillUnmount() {}

  componentDidShow() {
    this.setState({ isuserCard: Taro.getStorageSync("isUserCard"),isProtocol: Taro.getStorageSync("isProtocol") });
    this.state.userid ? this.getUserIntegral() : "";
  }
  getUserIntegral() {
    Http.post("WXDevelopment.ashx?t=30", {
      MemberId: this.state.userid
    }).then(rec => {
      rec.state === 200
        ? this.setState({
            userIntegral: rec.parma.CodeNum,
            userBalance: rec.parma.RewardNum
          })
        : "";
    });
  }
  componentDidHide() {}
  openJump(url) {
    if (this.state.isuserCard === 3 && this.state.userid) {
      showUsercardModal();
      return;
    }
    if (this.state.userid) {
      Taro.navigateTo({
        url: url
      });
    } else {
      Toast("请先登录");
    }
  }
  handleLogin() {
    let vm = this;
    Taro.login({
      success(res) {
        let code = res.code;
        Http.post("WXDevelopment.ashx?t=8", {
          code: code
        }).then(rec => {
          if (rec.state === 200) {
            let openid = rec.parma.OpenId;
            let userid = rec.parma.id;
            vm.setState({ userid: userid });
            try {
              Taro.setStorageSync("openid", openid);
              Taro.setStorageSync("userid", userid);
              if (vm.rec.parma.Mobile) {
                Taro.setStorageSync("isUserCard", 2),
                  this.setState({ isuserCard: 2 });
              } else {
                Taro.setStorageSync("isUserCard", 3),
                  this.setState({ isuserCard: 3 });
              }
              vm.state.InviterId
                ? inviteFriends(vm.state.InviterId, userid)
                : "";
            } catch (e) {}
            Taro.getUserInfo({
              success(rec) {
                if (rec.errMsg == "getUserInfo:ok") {
                  PostData(userid, rec.userInfo);
                  vm.setState({
                    userinfo: rec.userInfo,
                    isLogin: openid
                  });
                }
              }
            });
          } else {

            Toast("登录失败,请稍后再试!");
          }
        });
      }
    });
  }
  render() {
    let userdata = this.state.userinfo;
    return (
      <View className="main">
        {this.state.isProtocol ? "" : <Userpop />}
        <View className="user">
          <Image className="user_avatar" src={userdata.avatarUrl} />
          {this.state.isLogin ? (
            <View>
              <View className="user_name">{userdata.nickName}</View>
              <View
                onClick={this.openJump.bind(
                  this,
                  `/pages/userIntegral/index?num=${this.state.userIntegral}`
                )}
              >
                <View className="user_information">我的积分</View>
                <View className="iconfont icon-yue" />
                <View className="num">{this.state.userIntegral}</View>
              </View>
              <View
                onClick={this.openJump.bind(
                  this,
                  `/pages/userbalance/index?num=${this.state.userBalance}`
                )}
              >
                <View className="user_information">我的余额</View>
                <View className="iconfont icon-zhanghuyue-chongzhi" />
                <View className="num">{this.state.userBalance}</View>
              </View>
              {/* <View className="iconfont icon-youjiantou icona"> </View>
          <View
            onClick={this.openJump.bind(this, "/pages/editdata/index")}
            className="edit_data"
          >
            编辑资料
          </View> */}
            </View>
          ) : (
            <View onClick={this.handleLogin.bind(this)} className="user_name">
              点击登录
            </View>
          )}
        </View>
        <View
          className="content"
          onClick={this.openJump.bind(this, "/pages/signin/index")}
        >
          <View className="iconfont icon-qiandao0101 iconb" />
          <View className="text_content">签到</View>
          <View className="iconfont icon-youjiantou iconc" />
        </View>
        {/* <View
          onClick={this.openJump.bind(this, "/pages/userlegalize/index")}
          className="content"
        >
          <View className="iconfont icon-renzheng iconb" />
          <View className="text_content">用户认证</View>
          <View className="iconfont icon-youjiantou iconc" />
        </View> */}
        <View
          className="content"
          onClick={this.openJump.bind(this, "/pages/postposition/index")}
        >
          <View className="iconfont icon-zhifeiji iconb" />
          <View className="text_content">发布岗位</View>
          <View className="iconfont icon-youjiantou iconc" />
        </View>
        <View
          className="content"
          onClick={this.openJump.bind(this, "/pages/mypost/index")}
        >
          <View className="iconfont icon-mendiangangwei_huaban iconb" />
          <View className="text_content">我的发布</View>
          <View className="iconfont icon-youjiantou iconc" />
        </View>
        <View
          className="content"
          onClick={this.openJump.bind(this, "/pages/mycompany/index")}
        >
          <View className="iconfont icon-Group- iconb" />
          <View className="text_content">我的公司</View>
          <View className="iconfont icon-youjiantou iconc" />
        </View>
        <View
          className="content_two"
          onClick={this.openJump.bind(this, "/pages/myfocus/index")}
        >
          <View className="iconfont icon-guanzhu iconb" />
          <View className="text_content">我的关注</View>
          <View className="iconfont icon-youjiantou iconc" />
        </View>
        <View
          onClick={this.openJump.bind(this, "/pages/message/index")}
          className="content"
        >
          <View className="iconfont icon-xiaoxi1 iconb" />
          <View className="text_content">我的消息</View>
          <View className="iconfont icon-youjiantou iconc" />
        </View>
        <View
          onClick={this.openJump.bind(this, "/pages/myrule/index")}
          className="content"
        >
          <View className="iconfont icon-dkw_tianxie iconb" />
          <View className="text_content">平台规则</View>
          <View className="iconfont icon-youjiantou iconc" />
        </View>
        <View className="servicetel">
          客服热线：
          <Text
            className="callcolor"
            onClick={this.handleCall.bind(this, "400-8166-011")}
          >
            400-8166-011
          </Text>
        </View>
        <View className="servicetel">在线时间：9:00 — 17:00（周一至周五）</View>
        {/* <View className="content_two">
          <View className="iconfont icon-wujiaoxingkong iconb" />
          <View className="text_content">我的收藏</View>
          <View className="iconfont icon-youjiantou iconc" />
        </View>
        <View className="content">
          <View className="iconfont icon-shezhi iconb" />
          <View className="text_content">帮助与设置</View>
          <View className="iconfont icon-youjiantou iconc" />
        </View>
        <View className="content_two">
          <View className="iconfont icon-dkw_tianxie iconb" />
          <View className="text_content">意见反馈</View>
          <View className="iconfont icon-youjiantou iconc" />
        </View> */}
      </View>
    );
  }
}

export default Index;
