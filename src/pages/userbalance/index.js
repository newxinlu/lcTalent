import Taro, { Component } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import "./index.less";
import Http from "../../server/api";
import { Toastpop } from "../propsview/toastpop";
import { Withdraw } from "../propsview/withdraw";

class Index extends Component {
  config = {
    navigationBarTitleText: "我的余额"
  };
  constructor(props) {
    this.state = {
      userid: Taro.getStorageSync("userid"),
      usernum: this.$router.params.num,
      pagesize: 10,
      pageindex: 1,
      userlist: [],
      isload: true,
      tshow: false,
      tcon: ``,
      wshow:false,
      isnull:false,
    };
  }
  downScorll() {
    if (this.state.isload) {
      this.setState(
        {
          pageindex: this.state.pageindex + 1
        },
        () => {
          this.getData();
        }
      );
    }
  }
  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps);
  }
  componentDidMount() {
    this.setContainerHeight();
    this.getData();
    this.getRule();
  }
  getRule(){
    Http.post("WXDevelopment.ashx?t=40", {RuleId:3})
    .then(rec=>{
      this.setState({ tcon: rec.parma })
    })
  }
  getData() {
    Http.post("WXDevelopment.ashx?t=28", {
      pagesize: this.state.pagesize,
      pageindex: this.state.pageindex,
      MemberId: this.state.userid,
      Type:2,
    }).then(rec => {
      if (rec.state === 200 && rec.parma.length) {
        this.setState({
          userlist: this.state.userlist.concat(rec.parma),
          isload: true,
          isnull:true
        });
      } else if (!rec.parma.length) {
        this.setState({
          isload: false,
          isnull:true
        });
      }
    })
    .catch(err=>{
      this.setState({
        isnull:true
      });
    })
  }
  setContainerHeight() {
    const systemInfo = Taro.getSystemInfoSync();
    this.setState({
      containerHeight: systemInfo.windowHeight - 50
    });
  }
  componentWillUnmount() {}

  componentDidShow() {
  }

  componentDidHide() {}
  onTShow() {
    this.setState({ tshow: true });
  }
  halShow() {
    this.setState({ tshow: false });
  }
  handleWithdraw(){
    this.setState({ wshow: true });
  }
  callback(){
    this.setState({ wshow: false });
  }
  render() {
    return !this.state.userlist.length & this.state.isnull ? (
      <View className="nullclist">
      <Text className="iconfont icon-tixing" />
      <View>亲，帮助朋友，帮助自己，抓紧多多举荐人才，盘活您的人脉资源，我们一起来让价值最大化吧！</View>
    </View>
    ) : (
      <View>
        <View className="title">交易记录
        <View
            className="iconfont icon-wenhao icon-right"
            onClick={this.onTShow.bind(this)}
          />
        </View>

        <ScrollView
          scrollY
          className="content"
          style={{ height: this.state.containerHeight + "px" }}
          lowerThreshold="30"
          onScrollToLower={this.downScorll}
        >
          {this.state.userlist.map((x, i) => {
            return (
              <View className="child_content" key={i}>
                <View className="name">{x.Context}</View>
                <View className="time">{x.Time}</View>
              </View>
            );
          })}
        </ScrollView>

        <View className="foot">
          {/* <View className="foot_content">
               <View className="foot_text">我的余额</View>
               <View className="foot_num">151500</View>
               <View className="iconfont icon-zhanghuyue-chongzhi"></View>
           </View> */}
          <View className="foot_content">
            <View className="foot_text">我的余额</View>
            <View className="foot_num">{this.state.usernum}</View>
            <View className="iconfont icon-yue" />
          </View>
        </View>
        <Toastpop
          con={this.state.tcon}
          title="赏金规则"
          isshow={this.state.tshow}
          onClick={this.halShow.bind(this)}
        />
        <View className='iconfont icon-tixian gobala'   onClick={this.handleWithdraw.bind(this)} />
        <Withdraw wshow={this.state.wshow} onCallback={this.callback.bind(this)}></Withdraw>
      </View>
    );
  }
}
export default Index;
