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

import Http from "../../server/api";
import "./index.less";
class Index extends Component {
  config = {
    navigationBarTitleText: "我的发布"
  };
  constructor(props) {
    super(props);
    this.state = { postlist: [], userid: Taro.getStorageSync("userid"),isnull:false };
  }

  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps);
  }
  componentDidMount() {
    this.setContainerHeight();
    Http.get("WXDevelopment.ashx?t=34", {
      MemberId: this.state.userid
    })
      .then(rec => {
        this.setState({
          postlist: rec.parma,
          isnull:true
        });
      })
      .catch(err => {
        this.setState({
          isnull:true
        });
      });
  }
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  setContainerHeight() {
    const systemInfo = Taro.getSystemInfoSync();
    this.setState({
      containerHeight: systemInfo.windowHeight
    });
  }
  render() {
    let postlist = this.state.postlist;
    let getState = id => {
      if (id === 1) {
        return "已审核";
      } else if (id === 2) {
        return "未审核";
      } else {
        return "未通过";
      }
    };
    return !this.state.postlist.length & this.state.isnull ? (
      <View className="nullclist">
      <Text className="iconfont icon-tixing" />
      <View>亲，推荐合作客户您就可以发布岗位啦，正常我们将于1-2个工作日完成审核，急需的话请联系我们400全国客服专线，一起为让天下没有难招的人共同努力吧！</View>
    </View>
    ) : (
      <View>
        <ScrollView
          scrollY
          className="index-list view-bonttm"
          style={{ height: this.state.containerHeight + "px" }}
          lowerThreshold="30"
          onScrollToLower={this.downScorll}
        >
          {postlist.map((x, i) => {
            return (
              <View
                key={i}
                className="list-item"
              >
                <Image src={x.PicUrl} />
                <View className="item-con">
                  <View className="list-title">{x.Name}</View>
                  <View className="list-info">{x.Company}</View>
                </View>
                <View className='list-type'>{getState(x.State)}</View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    )
  }
}

export default Index;
