import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text, Map, Textarea } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import Http from "../../server/api";
import location from "../../static/location.png";
import "./index.less";
import { Toast } from "../../utensil";
// import  wxParse from '../wxParse/conts'
import WxParse from "../../wxParse/wxParse";
import share from "../../static/share.png";
import ad from "../../static/ad.png";
import ad1 from "../../static/ad1.png";
class Index extends Component {
  config = {
    navigationBarTitleText: "岗位详情"
  };
  constructor(props) {
    super(props);
    this.state = {
      infoobj: {},
      isEllipsis: false,
      PostRemark: "",
      userid: Taro.getStorageSync("userid"),
      isshare: false,
      isrule: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps);
  }
  componentDidMount() {
    let vm = this;

    this.handelisShaer();
  }

  componentWillUnmount() {}

  componentDidShow() {
    Http.get("WXDevelopment.ashx?t=2", {
      PostId: this.$router.params.id
    })
      .then(rec => {
        this.setState(
          {
            infoobj: rec.parma,
            PostRemark: rec.parma.PostRewardRemark
          },
          () => {
            const article = this.state.PostRemark;
            WxParse.wxParse("article", "html", article, this.$scope, 5);
          }
        );
      })
      .catch(err => {});
  }

  componentDidHide() {}
  handleEllipsis() {
    this.setState({
      isEllipsis: !this.state.isEllipsis
    });
  }
  handleRule() {
    this.setState({
      isrule: !this.state.isrule
    });
  }
  handelTalent() {
    let vm = this;
    Taro.showActionSheet({
      itemList: ["选择已有人才", "举荐新人才"],
      success(res) {
        if (res.tapIndex === 0) {
          Taro.navigateTo({
            url: `/pages/posttalentlist/index?PostId=${vm.$router.params.id}`
          });
        } else {
          Taro.navigateTo({
            url: `/pages/webview/index?url=${encodeURIComponent(
              `https://ttl.liangcaihr.com/source/default/AddPersonnel.aspx?MemberId=${
                vm.state.userid
              }&PostId=${vm.$router.params.id}`
            )}`
          });
        }
      },
      fail(res) {
        //console.log(res.errMsg);
      }
    });
  }
  handleCall = tel => {
    Taro.makePhoneCall({
      phoneNumber: tel
    });
  };
  handelisShaer() {
    Http.post("WXDevelopment.ashx?t=38", {
      MemberId: this.state.userid,
      Id: this.$router.params.id,
      Type: 1
    }).then(rec => {
      rec.state === 200 ? this.setState({ isshare: rec.parma }) : "";
    });
  }
  handelAttentinon() {
    Http.post("WXDevelopment.ashx?t=35", {
      PostId: this.$router.params.id,
      MemberId: this.state.userid
    }).then(rec => {
      if (rec.state === 200) {
        this.setState({
          isshare: true
        });
        Toast(rec.msg);
      } else if (rec.state === 201) {
        this.setState({
          isshare: false
        });
        Toast(rec.msg);
      }
    });
  }
  onShareAppMessage() {
    return {
      title: this.state.infoobj.Name,
      path: `/pages/postinfo/index?id=${this.$router.params.id}`
    };
  }

  render() {
    console.log(this.state.thight);
    let infodata = this.state.infoobj;
    let markers = [
      {
        iconPath: location,
        id: 0,
        latitude: infodata.Latitude,
        longitude: infodata.Longitude,
        width: "30px",
        height: "30px"
      }
    ];
    let Details = this.state.infoobj.Details;
    let detcon =
      typeof Details === "string"
        ? Details.replace(/<br\s*[\/]?>/gi, "\n")
        : "";

    return (
      <View>
        <View className="view-bonttm">
          <View className="info-head">
            <View className="head-title">{infodata.Name}</View>
            <View className="head-price">{infodata.Salary}</View>
            <View className="head-city">{infodata.ShowAddress}</View>
          </View>
          <View className="head-list">
            <View>
              <View>举荐顾问人数</View>
              <View>{infodata.RecommendPersonLCount}</View>
            </View>
            <View>
              <View>已举荐数量</View>
              <View>{infodata.RecommendpPsonnelCount}</View>
            </View>
            <View>
              <View>已面试人才</View>
              <View>{infodata.MsPsonnelCount}</View>
            </View>
          </View>
          <View className="info-content ">
            <Text className="info-title">职位详情</Text>
            <Text
              id="errorView"
              className={`infon-con ${
                this.state.isEllipsis ? "unellipsis" : "ellipsis"
              }`}
            >
              {detcon}
            </Text>
            <Button
              className={`info-look ${
                detcon.length < 60 ? "hide" : "show"
              }`}
              size="mini"
              onClick={this.handleEllipsis.bind(this)}
            >
              查看全部
            </Button>
          </View>
          <View className="info-content">
            <Text className="info-title title-mai">赏金规则</Text>
            <View
              className={`${this.state.isrule ? "info-show" : "info-hide"}`}
            >
              <import src="../../wxParse/wxParse.wxml" />
              <template is="wxParse" data="{{wxParseData:article.nodes}}" />
            </View>
            <Button
              className="info-look"
              size="mini"
              onClick={this.handleRule.bind(this)}
            >
              查看全部
            </Button>
          </View>
          <View className="info-bounty info-content">
            <Text className="info-title">赏金</Text>
            <View>{infodata.PostRewardMoney}</View>
          </View>
          <View className="info-content">
            <Text className="info-title title-mai">企业详情</Text>
            <View className="info-conmpany info-bold">
              <View className="info-name">{infodata.Company}</View>
              <View className="iconfont" />
            </View>
            <Map
              id="map"
              longitude={infodata.Longitude}
              latitude={infodata.Latitude}
              scale="14"
              markers={markers}
            />
          </View>
        </View>
        <cover-view>
          <Button className="share" open-type="share">
            <cover-image src={share} />
            分享
          </Button>
          <Button className="attention" onClick={this.handelAttentinon} name>
            <cover-image src={this.state.isshare ? ad1 : ad} />
            关注
          </Button>
          <Button className="oklc" onClick={this.handelTalent} name>
            马上举荐
          </Button>
          <Button
            className="callme"
            onClick={this.handleCall.bind(this, infodata.Contact)}
          >
            联系经理
          </Button>
        </cover-view>
      </View>
    );
  }
}

export default Index;
