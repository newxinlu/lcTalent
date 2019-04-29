import Taro, { Component } from "@tarojs/taro";
import {
  View,
  Button,
  Text,
  Swiper,
  SwiperItem,
  Image,
  ScrollView
} from "@tarojs/components";

import "./index.less";
import Http from "../../server/api";
import logo from "../../static/logo.jpg";
import { Toastpop } from "../propsview/toastpop";
class Index extends Component {
  config = {
    navigationBarTitleText: "规则"
  };
  constructor(props) {
    super(props);
    this.state = {
      rulelist: [],
      userid: Taro.getStorageSync("userid"),
      tshow: false,
      tcon: "",
      title: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps);
  }
  componentDidMount() {
    Http.get("WXDevelopment.ashx?t=40", {})
      .then(rec => {
        this.setState({
          rulelist: rec.parma
        });
      })
      .catch(err => {});
  }
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  halShow() {
    this.setState({ tshow: false });
  }
  halRule(index, title) {
    this.setState({
      title: title,
      tcon: this.state.rulelist[index].Content,
      tshow: true
    });
  }
  render() {
    return (
      <View>
        <View className="loginmain">
          <Image src={logo} />
          <View>地产推推乐</View>
        </View>

        <View className="companylist">
          <View onClick={this.halRule.bind(this, 0, "用户协议")}>
            用户协议 <View className="iconfont icon-youjiantou" />
          </View>
          <View onClick={this.halRule.bind(this, 3, "人才协议")}>
            人才协议 <View className="iconfont icon-youjiantou" />
          </View>
          <View onClick={this.halRule.bind(this, 1, "积分协议")}>
            积分协议 <View className="iconfont icon-youjiantou" />
          </View>
          <View onClick={this.halRule.bind(this, 2, "赏金协议")}>
            赏金协议 <View className="iconfont icon-youjiantou" />
          </View>
        </View>
        <Toastpop
          con={this.state.tcon}
          title={this.state.title}
          isshow={this.state.tshow}
          onClick={this.halShow.bind(this)}
        />
      </View>
    );
  }
}

export default Index;
