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
import index1 from "../../static/index1.png";
import index2 from "../../static/index2.png";
import index3 from "../../static/index3.png";
import { Toast, dayIntegral, showUsercardModal } from "../../utensil/index";

class Index extends Component {
  config = {
    navigationBarTitleText: "首页"
  };
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      tabindex: 1,
      swiperlist: [],
      pagesize: 10,
      pageindex: 1,
      isload: true,
      companylist: [],
      userid: "",
      isuserCard: Taro.getStorageSync("isUserCard")
    };
  }
  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps);
  }
  componentWillMount() {
    Taro.getSetting({
      success(res) {
        if (!res.authSetting["scope.userInfo"]) {
          Taro.redirectTo({
            url: "/pages/login/index",
            success(res) {
            }
          });
        }
      }
    });
  }
  componentDidMount() {
    this.setContainerHeight();
    this.getSwiper();
    this.getIndexData();
    this.getCompanyData();
    this.state.userid ? dayIntegral(this.state.userid) : "";
  }
  componentWillUnmount() {}
  componentDidShow() {
    this.setState({ userid: Taro.getStorageSync("userid"),isuserCard:Taro.getStorageSync("isUserCard") });
  }

  componentDidHide() {}
  openJump(url) {

    if (this.state.isuserCard===3&&this.state.userid) {
      showUsercardModal();
      return;
    }
    if (this.state.userid) {
      Taro.navigateTo({
        url: url
      });
    } else {
      Toast("请先登录");
    }
  }
  openWebJump(data, url) {
    if (data) {
      if (this.state.userid) {
        Taro.navigateTo({
          url: url
        });
      } else {
        Toast("请先登录");
      }
    }
  }
  getCompanyData() {
    Http.post("WXDevelopment.ashx?t=4", {
      pagesize: 4,
      pageindex: 1
    })
      .then(rec => {
        this.setState({
          companylist: rec.parma
        });
      })
      .catch(err => {
      });
  }
  getIndexData() {
    Http.post("WXDevelopment.ashx?t=1", {
      pagesize: this.state.pagesize,
      pageindex: this.state.pageindex
    })
      .then(rec => {
        if (rec.state === 200 && rec.parma.length) {
          this.setState({
            list: this.state.list.concat(rec.parma),
            isload: true
          });
        } else if (!rec.parma.length) {
          Toast("没有更多了");
          this.setState({
            isload: false
          });
        }
      })
      .catch(err => {});
  }
  setContainerHeight() {
    const systemInfo = Taro.getSystemInfoSync();
    this.setState({
      containerHeight: systemInfo.windowHeight - 50
    });
  }
  getSwiper() {
    Http.get("WXDevelopment.ashx?t=11", {})
      .then(rec => {
        this.setState({
          swiperlist: rec.parma
        });
      })
      .catch(err => {
      });
  }
  downScorll() {
    if (this.state.isload) {
      this.setState(
        {
          pageindex: this.state.pageindex + 1
        },
        () => {
          this.getIndexData();
        }
      );
    }
  }
  handleTab(e) {
    this.setState({
      tabindex: e
    });
  }
  render() {
    //  console.log(this.props);
    let indexlist = this.state.list;
    let swiperdata = this.state.swiperlist;
    return (
      <View>
        <Swiper className="test-h" autoplay="true">
          {swiperdata.map((x, i) => {
            return (
              <SwiperItem key={i}>
                <View
                  className="demo-text-1"
                  onClick={this.openWebJump.bind(
                    this,
                    x.Hyperlink,
                    `/pages/webview/index?url=${x.Hyperlink}`
                  )}
                >
                  <Image src={x.Url} />
                </View>
              </SwiperItem>
            );
          })}
        </Swiper>
        {/* <Input
          className="searchBar"
          type="search"
          placeholder="请输入关键字搜索"
          value={this.state.value}
          onInput={this.onInput.bind(this)}
        /> */}
        <View
          className="searchBar"
          onClick={this.openJump.bind(this, "/pages/search/index")}
        >
          请输入关键字搜索
        </View>
        <View className="listbar">
          <View
            onClick={this.openJump.bind(
              this,
              `/pages/webview/index?url=${encodeURIComponent(
                `https://ttl.liangcaihr.com/source/default/AddPersonnel.aspx?MemberId=${
                  this.state.userid
                }`
              )}`
            )}
          >
            <Image className="" src={index1} />
            <View>举荐人才</View>
          </View>
          <View
            onClick={this.openJump.bind(this, "/pages/createcombine/index")}
          >
            <Image className="" src={index3} />
            <View>推荐合作</View>
          </View>
          <View onClick={this.openJump.bind(this, "/pages/sharefriend/index")}>
            <Image className="" src={index2} />
            <View>邀请好友</View>
          </View>
        </View>
        <View className="index-nav">
          <View
            className={` ${this.state.tabindex === 1 ? "active" : null}`}
            onClick={this.handleTab.bind(this, 1)}
          >
            热门岗位
          </View>
          <View
            className={` ${this.state.tabindex === 2 ? "active" : null}`}
            onClick={this.handleTab.bind(this, 2)}
          >
            品牌公司
          </View>
        </View>
        <ScrollView
          scrollY
          className={`index-list view-bonttm ${
            this.state.tabindex === 1 ? "show" : "hide"
          }`}
          style={{ height: this.state.containerHeight + "px" }}
          lowerThreshold="30"
          onScrollToLower={this.downScorll}
        >
          {indexlist.map((x, i) => {
            return (
              <View
                key={i}
                className="list-item"
                onClick={this.openJump.bind(
                  this,
                  `/pages/postinfo/index?id=${x.Id}`
                )}
              >
                <Image src={x.PicUrl} />
                <View className="item-con">
                  <View className="list-title"><Text className='list-tname'>{x.Name} </Text> <Text className="list-price">{x.Salary}</Text></View>

                  <View className="list-info"><Text className='list-address'>{x.ShowAddress} </Text>  <Text className="list-reward">赏金:{x.RewardMoney}</Text></View>
                  <View className="list-name">
                    <View className="list-tag">
                      {x.TagList.map((t, si) => {
                        return <Text key={si}>{t.Title}</Text>;
                      })}
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
        <View
          className={`index-company view-bonttm ${
            this.state.tabindex === 2 ? "show" : "hide"
          }`}
        >
          {this.state.companylist.map((x, i) => {
            return (
              <View
                key={i}
                onClick={this.openJump.bind(
                  this,
                  `/pages/companylist/index?cid=${x.Id}&tid=${x.Type}`
                )}
              >
                <Image src={x.Url} />
                <View>{x.Name}</View>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}

export default Index;
