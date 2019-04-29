import Taro, { Component } from "@tarojs/taro";
import {
  View,
  Image
} from "@tarojs/components";

import sdg from './sdg.png'
import "./index.less";
class Index extends Component {
  config = {
    navigationBarTitleText: "",
  };
  constructor(props) {
    super(props);
    this.state = {  };
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

    return (

        <Image src={sdg} ></Image>

    )
  }
}

export default Index;
