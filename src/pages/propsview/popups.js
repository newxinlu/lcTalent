import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Button } from "@tarojs/components";
import "./index.less";
import { Toast } from "../../utensil";
import WxParse from "../../wxParse/wxParse";
import Http from "../../server/api";
class Popups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ``,
      isshow: true
    };
  }

  componentWillReceiveProps(nextProps) {
    //console.log(this.props, nextProps);
  }
  componentDidMount() {
    Http.get("/WXDevelopment.ashx?t=40", {RuleId:1}).then(rec => {
      this.setState({ text: rec.parma }, () => {
        const article = this.state.text;
        WxParse.wxParse("article", "html", article, this.$scope, 5);
      });
    });
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  handleProtocol(is) {
    if (is) {
      try {
        wx.setStorageSync("isProtocol", is);
      } catch (e) {}
      this.setState({
        isshow: !this.state.isshow
      });
    } else {
      Toast("您点击了不同意,将无法使用本平台哦!");
    }
  }
  render() {
    return (
      <View className={`${this.props.isshow ? "show" : "hide"}`}>
        <View className="popbg" />
        <View className="popcon">
          <ScrollView scrollY className="scrollview">
            <View className='title'>用户协议</View>
            <View class='rulecon'>
            <import src="../../wxParse/wxParse.wxml" />
            <template is="wxParse" data="{{wxParseData:article.nodes}}" />
            </View>
          </ScrollView>
          <Button
            className="nobutton"
            hover-class="none"
            onClick={this.props.onClick}
          >
            同意
          </Button>{" "}
          <Button
            hover-class="none"
            onClick={this.handleProtocol.bind(this, false)}
          >
            不同意
          </Button>
        </View>
      </View>
    );
  }
}
export default Popups;
