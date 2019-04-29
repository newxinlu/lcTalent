import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Button, Input } from "@tarojs/components";
import "./index.less";
import { Toast } from "../../utensil";
import Http from "../../server/api";
class Withdraw extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: Taro.getStorageSync("userid"),
      num: ""
    };
  }

  componentWillReceiveProps(nextProps) {
  //  console.log(this.props, nextProps);
  }
  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}
  handleNum(e) {
    this.setState({ num: e.target.value });
  }
  componentDidHide() {}
  handleProtocol(is) {
    const { onCallback } = this.props;
    if (is) {
      Http.post("WXDevelopment.ashx?t=41", {
        MemberId: this.state.userid,
        Money: this.state.num
      }).then(rec => {
        if (rec.state === 200) {
          Toast(rec.msg);
          this.setState({ num: "" });
          setTimeout(() => {
            onCallback();
          }, 1000);
        } else {
          Toast(rec.msg);
        }
      });
    } else {
      this.setState({ num: "" });
      onCallback();
    }
  }
  render() {
    return (
      <View className={`${this.props.wshow ? "show" : "hide"}`}>
        <View className="popbg" />
        <View className="withpopcon">
          <ScrollView scrollY className="scrollview">
            <View>申请提现</View>
            <Input
              placeholder="请输入提现金额"
              onInput={this.handleNum.bind(this)}
              value={this.state.num}
            />
          </ScrollView>
          <Button
            className="nobutton"
            hover-class="none"
            onClick={this.handleProtocol.bind(this, true)}
          >
            提现
          </Button>
          <Button
            hover-class="none"
            onClick={this.handleProtocol.bind(this, false)}
          >
            取消
          </Button>
        </View>
      </View>
    );
  }
}
export default Withdraw;
