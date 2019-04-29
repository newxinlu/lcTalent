import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text, Input } from "@tarojs/components";
import "./index.less";
import Http from "../../server/api";
class Index extends Component {
  config = {
    navigationBarTitleText: "人才详情"
  };
  constructor(props) {
    super(props);
    this.state = {
      userdata: {},
      userid: Taro.getStorageSync("userid"),
    };
  }
  componentDidMount() {
    Http.post("WXDevelopment.ashx?t=10", {
      PersonnelId: this.$router.params.id
    }).then(rec => {
      this.setState({
        userdata: rec.parma
      });
    });
  }
  openJump() {
    let vm=this;
      Taro.navigateTo({
        url: `/pages/webview/index?url=${encodeURIComponent(
          `https://ttl.liangcaihr.com/source/default/UpdatePersonnel.aspx?MemberId=${
            vm.state.userid
          }&PersonnelId=${vm.$router.params.id}`
        )}`
      });
  }
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  render() {
    let getdata = this.state.userdata;
    let userdatas = getdata.PersonnelStateList.map((x, i) => {
      return (
        <li key={i}>
          <span />
          {x.State}
          {x.CreationTime}
          <View
            className={`my-line ${
              getdata.PersonnelStateList.length - 1 === i ? "hide" : "show"
            }`}
          />
        </li>
      );
    });
    return (
      <View>
        <View className="up">
          <View className="framework">
            <Text className="textone">姓名</Text>
            <Text className="texttwo">{getdata.Name}</Text>
          </View>
          <View className="framework">
            <Text className="textone">联系电话</Text>
            <Text className="texttwo">{getdata.Contact}</Text>
          </View>
          <View className="framework">
            <Text className="textone">意向岗位</Text>
            <Text className="texttwo">{getdata.IntentionPost||'暂无'}</Text>
          </View>
          <View className="framework">
            <Text className="textone">备注</Text>
            <Text className="texttwo">{getdata.Remark || "暂无"}</Text>
          </View>
          <View className="framework">
            <Text className="textone">经纪人</Text>
            <Text className="texttwo">{getdata.Receiver}</Text>
          </View>
        </View>
        <View className="down">
          <View className="down_title">当前状态</View>
          <ul>{userdatas}</ul>
        </View>
        <View className="dowm-view">
          <Button type="primary"  onClick={this.openJump.bind(this)}>
            更新信息
          </Button>
        </View>
        </View>
    );
  }
}
export default Index;
