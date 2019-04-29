import Taro, { Component } from "@tarojs/taro";
import {
  View,
  Button,
  Text,
  Swiper,
  SwiperItem,
  Image,
  ScrollView,
  WebView
} from "@tarojs/components";

import "./index.less";
import Http from "../../server/api";

class Index extends Component {
  config = {
    navigationBarTitleText: "公司"
  };
  constructor(props) {
    super(props);
    this.state = { companylist: [], rankpic: "", tid: this.$router.params.tid };
  }

  componentWillReceiveProps(nextProps) {

  }
  setContainerHeight() {
    const systemInfo = Taro.getSystemInfoSync();
    this.setState({
      containerHeight: systemInfo.windowHeight - 240
    });
  }
  componentDidMount() {
    let vm = this;
    this.setContainerHeight();
    Http.get("WXDevelopment.ashx?t=5", {
      RankId: vm.$router.params.cid,
      Type: vm.$router.params.tid
    })
      .then(rec => {
        vm.setState({
          companylist: rec.parma[0]
        });
      })
      .catch(err => {});
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
    let { Url, RankCompanyList, RankPic } = this.state.companylist;
    let tid = this.state.tid;
    return tid ? (
      <View>
        <View className="companylogo">
          <Image src={Url} />
        </View>
        {tid == 1 ? (
          <View className="companylist">
            {RankCompanyList.map((x, i) => {
              return (
                <View
                  key={i}
                  onClick={this.openJump.bind(
                    this,
                    `/pages/companyinfo/index?id=${x.CompanyId}`
                  )}
                >
                  <View>
                    <View className="companyname">{x.CompanyName}</View>
                    <View className="companytype">{x.CompanyIndustry}</View>
                  </View>
                  <Image src={x.CompanyLogo} />
                </View>
              );
            })}
          </View>
        ) : (
          <ScrollView
            scrollY
            style={{
              height: this.state.containerHeight + "px"
            }}
          >
            <Image
              mode="widthFix"
              style="width: 100%;height: 100%;background: #fff;"
              src={RankPic}
            />
          </ScrollView>
        )}
      </View>
    ) : (
      ""
    );
  }
}

export default Index;
