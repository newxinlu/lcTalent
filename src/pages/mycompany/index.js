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

class Index extends Component {
  config = {
    navigationBarTitleText: "我的公司"
  };
  constructor(props) {
    super(props);
    this.state = {
      companylist: [],
      userid: Taro.getStorageSync("userid"),
      isnull: false
    };
  }
  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps);
  }
  componentDidMount() {
    Http.get("WXDevelopment.ashx?t=13", {
      MemberId: this.state.userid
    })
      .then(rec => {
        this.setState({
          companylist: rec.parma,
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

  render() {
    let RankCompanyList = this.state.companylist;
    return !this.state.companylist.length & this.state.isnull ? (
      <View className="nullclist">
        <Text className="iconfont icon-tixing" />
        <View>暂无公司</View>
      </View>
    ) : (
      <View>
        <View className="companylist">
          {RankCompanyList.map((x, i) => {
            return (
              <View key={i}>
                <View>
                  <View className='ctitle'>{x.CompanyName} <View className='isreview'>{x.CompanyIndustry || "暂无"}</View></View>
                  <View className='cooperation'>合作意向:{x.Cooperation || "暂无"}</View>
                </View>
               {/* <Image src={x.CompanyLogo} /> */}
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}

export default Index;
