import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Button } from "@tarojs/components";
import "./index.less";
import WxParse from "../../wxParse/wxParse";
class Toastpop extends Component {

  constructor(props) {
    super(props);

  }

  componentWillReceiveProps(nextProps) {
    //console.log(this.props, nextProps);
  }
  componentDidMount() {

  }

  componentWillUnmount() {}

  componentDidShow() {

  }

  componentDidHide() {}
  handleProtocol() {
    this.setState({
      isshow: !this.state.isshow
    });
  }
  render() {
    WxParse.wxParse("article", "html", this.props.con, this.$scope, 5);
    return (
      <View className={`${this.props.isshow ? "show" : "hide"}`}>
        <View className="popbg" />
        <View className="popcon">
          <ScrollView scrollY className="scrollview">
            <View className='title'>{this.props.title}</View>
            <View class='rulecon'>
            <import src="../../wxParse/wxParse.wxml" />
            <template is="wxParse" data="{{wxParseData:article.nodes}}" />
            </View>
          </ScrollView>
       <View class='tclose' onClick={this.props.onClick}>确定</View>
        </View>
      </View>
    );
  }
}
export default Toastpop;
