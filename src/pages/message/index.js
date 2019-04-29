import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView } from "@tarojs/components";
import "./index.less";
import Http from "../../server/api";
import { Toast } from "../../utensil/index";
class Index extends Component {
  config = {
    navigationBarTitleText: "消息"
  };
  constructor(props) {
    super(props);
    this.state = {
      userid: Taro.getStorageSync("userid"),
      pagesize: 10,
      pageindex: 1,
      mlist: [],
      containerHeight: 0,
      isload: true,
      isnull: false
    };
  }
  setContainerHeight() {
    const systemInfo = Taro.getSystemInfoSync();
    this.setState({
      containerHeight: systemInfo.windowHeight
    });
  }
  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps);
  }
  componentDidMount() {
    this.setContainerHeight();
    this.getMsgData();
  }
  getMsgData() {
    Http.post("WXDevelopment.ashx?t=21", {
      MemberId: this.state.userid,
      pagesize: this.state.pagesize,
      pageindex: this.state.pageindex
    })
      .then(rec => {
        if (rec.state === 200 && rec.parma.MessageList.length) {
          this.setState({
            mlist: this.state.mlist.concat(rec.parma.MessageList),
            isload: true,
            isnull: true
          });
        } else if (!rec.parma.MessageList.length) {
          Toast("没有更多了");
          this.setState({
            isload: false,
            isnull: true
          });
        }
      })
      .catch(err => {
        this.setState({
          isnull: true
        });
      });
  }
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  downScorll() {
    if (this.state.isload) {
      this.setState(
        {
          pageindex: this.state.pageindex + 1
        },
        () => {
          this.getMsgData();
        }
      );
    }
  }
  render() {
    let data = this.state.mlist;
    return !this.state.mlist.length & this.state.isnull ? (
      <View className="nullclist">
        <Text className="iconfont icon-tixing" />
        <View>暂无消息</View>
      </View>
    ) : (
      <ScrollView
        className="bg"
        scrollY
        style={{ height: this.state.containerHeight + "px" }}
        lowerThreshold="30"
        onScrollToLower={this.downScorll}
      >
        {data.map((x, i) => {
          return (
            <View className="main" key={i}>
              <View className="name">{x.Title}</View>
              <View className="message">{x.Content}</View>
            </View>
          );
        })}
      </ScrollView>
    );
  }
}
export default Index;
