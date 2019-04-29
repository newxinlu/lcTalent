import Taro, { Component } from "@tarojs/taro";
import { WebView } from "@tarojs/components";
class Index extends Component {
  config = {
    navigationBarTitleText: ""
  };
  constructor(props) {
    super(props);
    this.state = {
      userid: Taro.getStorageSync("userid")
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

  render() {
    return <WebView src={decodeURIComponent(this.$router.params.url)}/>;
  }
}
export default Index;
