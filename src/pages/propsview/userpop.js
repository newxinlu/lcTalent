import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Button } from "@tarojs/components";
import "./index.less";
import { Popups } from "./popups";
import Http from "../../server/api";
class Userpop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "用户协议",
      con: "在使用“地产推推乐”平台开展人才举荐之前,请仔细阅读《用户协议》",
      isshow: true,
      popshow: false
    };
  }

  componentWillReceiveProps(nextProps) {
   // console.log(this.props, nextProps);
  }
  componentDidMount() {

  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  handleProtocol() {
    this.setState({
      isshow: !this.state.isshow
    });
    wx.setStorageSync("isProtocol", true);
  }
  showPop() {
    this.setState({
      popshow: true,
      isshow: !this.state.isshow
    });
    wx.setStorageSync("isProtocol", true);
  }
  onshow(){
    this.setState({
      popshow: false,
      isshow: !this.state.isshow
    });
  }
  render() {
    return this.state.popshow ? (
      <Popups  isshow={this.state.isshow} onClick={this.onshow.bind(this)}/>
    ) : (
      <View className={`${this.props.isshow ? "show" : "hide"}`}>
        <View className="popbg" />
        <View className="userpopcon">
          <View className="usertitle">{this.state.title}</View>
          <View className="usercon">{this.state.con}</View>
          <View className="useropen" onClick={this.showPop.bind(this)}>
            我已经阅读<Text>《用户协议》</Text>
          </View>
          <View class="tclose" onClick={this.handleProtocol.bind(this)}>
            同意并继续
          </View>
        </View>
      </View>
    );
  }
}
export default Userpop;
