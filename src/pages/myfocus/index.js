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
    navigationBarTitleText: "我的关注"
  };
  constructor(props) {
    super(props);
    this.state = {
      postlist: [],
      userid: Taro.getStorageSync("userid"),
      isnull: false
    };
  }

  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps);
  }
  componentDidMount() {
    this.setContainerHeight();
    Http.get("WXDevelopment.ashx?t=36", {
      MemberId: this.state.userid,
      Type: 1
    })
      .then(rec => {
        this.setState({
          postlist: rec.parma,
          isnull: true
        });
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
  openJump(url) {
    Taro.navigateTo({
      url: url
    });
  }
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
        <View>暂无关注</View>
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
                onClick={this.openJump.bind(
                  this,
                  `/pages/postinfo/index?id=${x.CareId}`
                )}
              >
                <Image src={x.PicUrl} />
                <View className="item-con">
                <View className="list-title"><Text className='list-tname'>{x.Name} </Text> <Text className="list-price">{x.Salary}</Text></View>

                  <View className="list-info"><Text className='list-address'>{x.ShowAddress} </Text>  <Text className="list-reward">赏金:{x.RewardMoney}</Text></View>
                  <View className="list-name">
                    {x.TagList.map((t, si) => {
                      return <Text key={si}>{t.Title}</Text>;
                    })}
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

export default Index;
