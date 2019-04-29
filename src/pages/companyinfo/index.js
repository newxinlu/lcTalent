import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, Swiper, SwiperItem } from "@tarojs/components";
import "./index.less";
import Http from "../../server/api";
class Index extends Component {
  config = {
    navigationBarTitleText: "公司详情"
  };
  constructor(props) {
    super(props);
    this.state = {
      swindex: 1,
      cdata: {}
    };
  }
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }
  componentDidMount() {
    Http.post("/WXDevelopment.ashx?t=12", {
      CompanyId: this.$router.params.id
    }).then(rec => {
      this.setState({
        cdata: rec.parma
      });
    });
  }
  getConr(){

  }
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  swIndex(e) {
    console.log(e.detail.current);
    this.setState({
      swindex: e.detail.current + 1
    });
  }
  render() {
    let data = this.state.cdata;
    return (
      <View>
        <View>
          <View className="top">
            <View className="top_left">
              <View className="top_left_up">{data.CompanyName}</View>
              <View className="top_left_down">
                {data.CompanyShowAddress} · {data.CompanyIndustry}
              </View>
            </View>
            <Image className="image" src={data.CompanyLogo} />
          </View>
          <View>
            <Swiper
              next-margin="24rpx"
              circular
              current="0"
              onChange={this.swIndex.bind(this)}
            >
              {data.PhotoList.map((x, i) => {
                return (
                  <swiper-item class="sw" key={i}>
                    <Image src={x.Url} />
                  </swiper-item>
                );
              })}
            </Swiper>
            <View className="count">{this.state.swindex}/{data.PhotoList.length}</View>
          </View>
          <View className="resume">
            简介
            <Text>{data.CompanyDetails}</Text>
          </View>
        </View>
        <View className="company">
        <View className="contacts_title">联系方式</View>
          {/* <View className="company_title">{data.CompanyName}</View> */}
          <View className="company_address">
            地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址<Text>{data.Address}</Text>
          </View>
          <View className="company_address">
            联&nbsp;系&nbsp;人<Text>{data.ManagerName}</Text>
          </View>
          <View className="company_content">
            {cdata.TagList.map((x, i) => {
              return <View  key={i}>{x.Title}</View>;
            })}
          </View>
        </View>
        {/* <View className="contacts">
         
          <View className="contacts_people">{data.ManagerName}</View>
        </View> */}
        <View />
      </View>
    );
  }
}
export default Index;
