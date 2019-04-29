import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.less";
import Http from "../../server/api";
import { Toast,showUsercardModal } from "../../utensil";
import { Toastpop } from "../propsview/toastpop";
class Index extends Component {
  config = {
    navigationBarTitleText: "人才"
  };
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      userid: Taro.getStorageSync("userid"),
      tshow: false,
      tcon: ``,
      isuserCard: Taro.getStorageSync("isUserCard"),
    };
  }
  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps);
  }
  componentDidMount() {
    this.getRule();
  }
  componentWillUnmount() {}
  getRule(){
    Http.post("WXDevelopment.ashx?t=40", {RuleId:4})
    .then(rec=>{
      this.setState({ tcon: rec.parma })
    })
  }
  componentDidShow() {
    this.setState({ userid: Taro.getStorageSync("userid"),isuserCard:Taro.getStorageSync("isUserCard")}, () => {
      Http.post("/WXDevelopment.ashx?t=7", {
        MemberId: this.state.userid
      }).then(rec => {
        rec.state === 200 ? this.setState({ list: rec.parma }) : [];
      });
    });
  }

  componentDidHide() {}
  openJump(url) {
    if (this.state.isuserCard===3&&this.state.userid) {
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
  onTShow() {
    this.setState({ tshow: true });
  }
  halShow(){
    this.setState({ tshow: false });
  }
  render() {
    let list = this.state.list;
    return (
      <View className="main">
        <View className="up">
          <View
            className="up_content"
            onClick={this.openJump.bind(
              this,
              `/pages/webview/index?url=${encodeURIComponent(
                `https://ttl.liangcaihr.com/source/default/AddPersonnel.aspx?MemberId=${
                  this.state.userid
                }`
              )}`
            )}
          >
            <View className="iconfont icon-dkw_tianxie" />
            <View className="up_txt">举荐人才</View>
            <View className="iconfont icon-youjiantou" />
          </View>
          <View
            className="up_content"
            onClick={this.openJump.bind(this, "/pages/createcombine/index")}
          >
            <View className="iconfont  icon-Group-" />
            <View className="up_txt">推荐合作</View>
            <View className="iconfont icon-youjiantou" />
          </View>
          {/* <View className="up_content">
           <View className="iconfont icon-tongzhi"></View>
           <View className="up_txt">待办事宜</View>
           <View className="iconfont icon-youjiantou"></View>
           </View> */}
          {/* <View className="up_content">
           <View className="iconfont icon-My"></View>
           <View className="up_txt">收藏岗位</View>
           <View className="iconfont icon-youjiantou"></View>
           </View> */}
        </View>
        <View className="down">
          <View className="down_up">
            <View className="down_title">人才信息</View>
            <View
              className="iconfont icon-wenhao"
              onClick={this.onTShow.bind(this)}
            />
          </View>
          {list.map((x, i) => {
            return (
              <View
                className="down_content"
                key={i}
                onClick={this.openJump.bind(
                  this,
                  `/pages/mytalent/index?id=${x.id}&name=${x.Name}`
                )}
              >
                <View className="down_content_up">{x.Count}</View>
                <View className="down_content_down">{x.Name}</View>
              </View>
            );
          })}
        </View>
        <Toastpop
          con={this.state.tcon}
          title="注意事项"
          isshow={this.state.tshow}
          onClick={this.halShow.bind(this)}
        />
      </View>
    );
  }
}
export default Index;
