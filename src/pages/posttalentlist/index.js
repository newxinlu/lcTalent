import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView } from "@tarojs/components";
import "./index.less";
import Http from "../../server/api";
import { Toast } from "../../utensil/index";
class Index extends Component {
  config = {
    navigationBarTitleText: "选择人才"
  };
  constructor(props) {
    super(props);
    this.state = {
      userid: Taro.getStorageSync("userid"),
      pagesize: 10,
      pageindex: 1,
      mlist: [],
      containerHeight: 0,
      value: "",
      istalent: ""
    };
  }
  setContainerHeight() {
    const systemInfo = Taro.getSystemInfoSync();
    this.setState({
      containerHeight: systemInfo.windowHeight - 60
    });
  }
  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps);
  }
  componentDidMount() {
    this.setContainerHeight();
    this.getMsgData();
  }
  onInput(e) {
    this.setState({
      value: e.detail.value
    });
  }
  getMsgData() {
    Http.post("WXDevelopment.ashx?t=42", {
      MemberId: this.state.userid,
      Keyword: this.state.value
    })
      .then(rec => {

        this.setState({
          mlist: rec.parma
        });


      })
      .catch(err => {
      });
  }
  handleSearch() {
    this.getMsgData();
  }
  handleTalent(tid) {
    this.setState({ istalent: tid });
  }
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  handelSubmit() {
    Http.post("WXDevelopment.ashx?t=43", {
      MemberId: this.state.userid,
      PersonnelId: this.state.istalent,
      PostId: this.$router.params.PostId
    })
      .then(rec => {
        if (rec.state === 200) {
          setTimeout(() => {
            Taro.navigateBack();
          }, 1000);
        }
        Toast(rec.msg);
      })
      .catch(err => {});
  }
  render() {
    let data = this.state.mlist;
    return (
      <View>
        <View className="searchbar">
          <Input
            placeholder="请输入关键字"
            vlaue={this.state.value}
            onInput={this.onInput}
          />
          <Button onClick={this.handleSearch.bind(this)}>搜索</Button>
        </View>
        {!data.length ? (
          <View className="nonelist">没有更多了</View>
        ) : (
          <View>
            <ScrollView
              className="bg"
              scrollY
              style={{
                height: this.state.containerHeight + "px",
                marginTop: 60 + "px",
                marginBottom: 80 + "px"
              }}
              lowerThreshold="30"
            >
              {data.map((x, i) => {
                return (
                  <View
                    className="people"
                    key={i}
                    onClick={this.handleTalent.bind(this, x.PersonnelId)}
                  >
                    <View className="name">
                      {x.Name}
                      <Text
                        className={`iconfont icon-duihao iconflotc ${
                          this.state.istalent === x.PersonnelId
                            ? "show"
                            : "hide"
                        }`}
                      />
                    </View>

                    <View className="professional">
                      <View>{x.Post}</View>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
            <View className="dowm-view">
              <Button
                onClick={this.handelSubmit.bind(this)}
                type="primary"
                disabled={!this.state.istalent}
              >
                确定
              </Button>
            </View>
          </View>
        )}
      </View>
    );
  }
}
export default Index;
