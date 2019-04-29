import Taro, { Component } from "@tarojs/taro";
import Http from "../../server/api";
import { View, Button, ScrollView, Toast } from "@tarojs/components";
import "./index.less";
class Index extends Component {
  config = {
    navigationBarTitleText: "我的人才"
  };

  constructor(props) {
    super(props);
    const value = Taro.getStorageSync("userid");
    this.state = {
      isShow: false,
      pagesize: 10,
      pageindex: 1,
      isload: true,
      userid: value,
      typeid: this.$router.params.id,
      oldtypeid: 0,
      list: [],
      filterList: [],
      filterId: 0,
      name: this.$router.params.name,
      oldname: "",
      containerHeight: 0,
      isnull: false
    };
  }
  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps);
  }
  componentDidMount() {
    this.myList();
    this.filter();
    this.setContainerHeight();
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  showhide(event) {
    event.stopPropagation();
    this.setState({
      oldtypeid: this.state.typeid,
      isShow: !this.state.isShow
    });
  }
  myList = () => {
    Http.get("WXDevelopment.ashx?t=26").then(rec => {
      this.setState({
        filterList: rec.parma
      });
    });
  };
  filter = () => {
    Http.post("WXDevelopment.ashx?t=9", {
      pagesize: this.state.pagesize,
      pageindex: this.state.pageindex,
      MemberId: this.state.userid,
      TypeId: this.state.typeid
    })
      .then(rec => {
        if (rec.state === 200 && rec.parma.length) {
          this.setState({
            list: this.state.list.concat(rec.parma),
            isload: true,
            isnull: true
          });
        } else if (!rec.parma.length) {
          Toast("没有更多了");
          this.setState({
            isload: false,
            isnull: true
          });
        }
      })
      .catch(err => {
        this.setState({
          isnull: true
        });
      });
  };
  downScorll() {
    if (this.state.isload) {
      this.setState(
        {
          pageindex: this.state.pageindex + 1
        },
        () => {
          this.filter();
        }
      );
    }
  }
  setContainerHeight() {
    const systemInfo = Taro.getSystemInfoSync();
    this.setState({
      containerHeight: systemInfo.windowHeight - 50
    });
  }
  tolistFilter = (id, name, event) => {
    event.stopPropagation();
    this.setState({
      oldtypeid: id,
      oldname: name
    });
  };
  comir(event) {
    event.stopPropagation();
    this.setState(
      {
        typeid: this.state.oldtypeid,
        name: this.state.oldname,
        pageindex: 0,
        isShow: false,
        list: []
      },
      () => {
        this.downScorll();
      }
    );
  }
  openJump(url) {
    Taro.navigateTo({
      url: url
    });
  }
  render() {
    return !this.state.list.length & this.state.isnull ? (
      <View className="nullclist">
        <Text className="iconfont icon-tixing" />
        <View>暂无人才</View>
      </View>
    ) : (
      <View>
        <View className="choose" onClick={this.showhide.bind(this)}>
          <View className="choose_left">
            <View className="choose_txt">
              {" "}
              {this.state.typeid ? this.state.name : "选择"}
            </View>
            <View className="iconmore  iconfont icon-xiajiantou " />
          </View>
          {/* <View className="choose_right">
            <View className="choose_txt">选择</View>
            <View className="iconfont icon-xiajiantou" />
          </View> */}
        </View>

        <View className={this.state.isShow ? "show" : "hide"}>
          <View className="choose_sub" onClick={this.showhide.bind(this)}>
            {this.state.filterList.map((x, key) => {
              return (
                <View
                  className="choose_sub_txt"
                  key={key}
                  style={
                    x.id == this.state.oldtypeid ? { color: "#54CAC3" } : ""
                  }
                  onClick={this.tolistFilter.bind(this, x.id, x.Name)}
                >
                  {x.Name}
                </View>
              );
            })}

            <View className="choose_sub_kb" />
            <View className="cf">
              <Button
                className="choose_sub_left"
                onClick={this.comir.bind(this)}
              >
                确认
              </Button>
              <Button
                className="choose_sub_right"
                onClick={this.showhide.bind(this)}
              >
                取消
              </Button>
            </View>
          </View>
        </View>
        <ScrollView
          scrollY
          style={{ height: this.state.containerHeight + "px" }}
          lowerThreshold="30"
          onScrollToLower={this.downScorll}
        >
          {this.state.list.map((x, i) => {
            return (
              <View
                className="people"
                key={i}
                onClick={this.openJump.bind(
                  this,
                  `/pages/talentinfo/index?id=${x.PersonnelId}`
                )}
              >
                <View className="name">{x.PersonnelName}</View>
                <View className="professional">
                  <View>{x.PersonnelPost}</View>
                </View>
                <View className="specialty">
                  <View>匹配岗位:{x.PersonnelIntentionPost}</View>
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
