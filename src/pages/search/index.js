import Taro, { Component } from "@tarojs/taro";
import { View, Input, Button } from "@tarojs/components";
import "./index.less";
import Http from "../../server/api";
import { Toast } from "../../utensil/index";
class Index extends Component {
  config = {
    navigationBarTitleText: "搜索"
  };
  constructor(props) {
    super(props);
    this.state = {
      userid: Taro.getStorageSync("userid"),
      list: [],
      pagesize: 10,
      pageindex: 1,
      value: "",
      isload: true
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }
  componentDidMount() {
    this.setContainerHeight();
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
  getSerData() {
    Http.post("WXDevelopment.ashx?t=27", {
      pagesize: this.state.pagesize,
      pageindex: this.state.pageindex,
      Keyword: this.state.value
    })
      .then(rec => {
        if (rec.state === 200 && rec.parma.length) {
          this.setState({
            list: this.state.list.concat(rec.parma),
            isload: true
          });
        } else if (!rec.parma.length) {
          this.setState({
            isload: false
          });
        }
      })
      .catch(err => {});
  }
  onInput(e) {
    this.setState({
      value: e.detail.value
    });
  }
  handleSearch() {

    this.setState(
      {
        pageindex: 1,
        list: [],
        isload: true
      },
      () => {
        this.getSerData();
      }
    );
  }
  openJump(url) {
    if (this.state.userid) {
      Taro.navigateTo({
        url: url
      });
    } else {
      Toast("请先登录");
    }
  }
  downScorll() {
    if (this.state.isload) {
      this.setState(
        {
          pageindex: this.state.pageindex + 1
        },
        () => {
          this.getSerData();
        }
      );
    }
  }
  render() {
    let indexlist = this.state.list;
    return this.state.pageindex===1&&!this.state.list?(
      <View>没有更多了</View>
    ):(
      <View>
        <View className="searchbar">
          <Input
            placeholder="请输入关键字"
            vlaue={this.state.value}
            onInput={this.onInput}
          />
          <Button onClick={this.handleSearch.bind(this)}>搜索</Button>
        </View>
        <ScrollView
          scrollY
          className="index-list"
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
                <View className="list-title">{x.Name}</View>
                <View className="list-price">{x.Salary}</View>
                <View className="list-info">{x.ShowAddress}</View>
                <View className="list-name">{x.ManagerName}</View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}
export default Index;
