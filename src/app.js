import "@tarojs/async-await";
import Taro, { Component } from "@tarojs/taro";
import { Provider } from "@tarojs/redux";
import Index from "./pages/index";
import configStore from "./store";
import "./app.less";
import { isUserCertification } from './utensil/index'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore();

class App extends Component {
  config = {
    pages: [
      // "pages/startupimg/index",
      "pages/index/index",//首页
      "pages/sharefriend/index",//分享朋友圈第一页
      "pages/createimg/index",//分享朋友圈第二页
      //"pages/createtalent/index",//创建人才原生页面(因为无法上传word而取消)
      "pages/talent/index",//人才
      "pages/my/index",//我的
      "pages/talentinfo/index",//人才信息
      "pages/companylist/index",//公司列表
      "pages/login/index",//登陆
      "pages/mytalent/index",//我的人才
      "pages/companyinfo/index",//公司详情
      "pages/message/index",//消息
      "pages/postinfo/index",//岗位详情
      "pages/createcombine/index",//推荐合作
      "pages/userlegalize/index",//用户
      "pages/postposition/index",//发布岗位
      "pages/signin/index",//签到
      "pages/webview/index",
      "pages/search/index",//搜索
      "pages/userIntegral/index",//积分
      "pages/userbalance/index",//余额
      "pages/mycompany/index",//我推荐点公司
      "pages/mypost/index",//我发布点岗位
      "pages/myfocus/index",//我的关注
      "pages/posttalentlist/index",//岗位选择
      "pages/myrule/index",//我对规则
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#fff",
      navigationBarTitleText: "地产推推乐",
      navigationBarTextStyle: "black"
    },
    tabBar: {
      color: "#333333",
      selectedColor: "#0bb76b",
      borderStyle: "white",
      backgroundColor: "#ffffff",
      list: [
        {
          pagePath: "pages/index/index",
          text: "首页",
          iconPath: "static/index.png",
          selectedIconPath: "static/indexSel.png"
        },
        {
          pagePath: "pages/talent/index",
          text: "人才",
          iconPath: "static/telent.png",
          selectedIconPath: "static/talentSel.png"
        },
        {
          pagePath: "pages/my/index",
          text: "我的",
          iconPath: "static/my.png",
          selectedIconPath: "static/mySel.png"
        }
      ]
    },
    plugins: {
      calendar: {
        version: "1.1.3",
        provider: "wx92c68dae5a8bb046"
      }
    }
  };

  componentDidMount() {
    //获取扫描二维码的用户ID
    let scene = this.$router.params.query.scene;
    if (scene) {
      scene = decodeURIComponent(scene);
      Taro.setStorageSync("InviterId", scene.InviterId);
    }
    let user = Taro.getStorageSync("userid");
    if (user) {
    isUserCertification(user)
    }
  }

  componentDidShow() {}

  componentDidHide() {}

  componentCatchError() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById("app"));
