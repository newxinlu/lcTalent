import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text, Image, Picker, Form } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import "./index.less";
import Http from "../../server/api";
import { Toast } from "../../utensil/index";
class Index extends Component {
  config = {
    navigationBarTitleText: "举荐人才"
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      alllist: [],
      text: [],
      selectedImg: "",
      selSel: {},
      dateSel: "",
      industry: {},
      post: {},
      rank: {},
      username: "",
      tel: "",
      details: "",
      tid: this.$router.params.tid | 0,
      userid: Taro.getStorageSync("userid"),
      resumeurl:'',
    };
  }
  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps);
  }
  componentDidMount() {
    Http.post("Setup.ashx?t=7", {})
      .then(rec => {
        this.setState({
          alllist: rec.parma,
          isLoading: false
        });
      })
      .catch(err => {});
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  onsexChange = e => {
    this.setState({
      selSel: this.state.alllist[3].List[e.detail.value]
    });
  };
  onDateChange = e => {
    this.setState({
      dateSel: e.detail.value
    });
  };
  onIndustryChange = e => {
    this.setState({
      industry: this.state.alllist[0].List[e.detail.value]
    });
  };
  onPostChange = e => {
    this.setState({
      post: this.state.alllist[1].List[e.detail.value]
    });
  };

  onRankChange = e => {
    this.setState({
      rank: this.state.alllist[2].List[e.detail.value]
    });
  };
  handleSubmit = e => {
    for (let prop in e.target.value) {
      if (
        e.target.value[prop] === null ||
        e.target.value[prop].toString().replace(/(^\s*)|(\s*$)/g, "") === ""
      ) {
        switch (prop) {
          case "Name":
            Toast("请输入姓名");
            return;
          case "Contact":
            Toast("请输入电话号码");
            return;
          // case "Sex":
          //   Toast("请选择性别");
          //   return;
          // case "DateOfBirth":
          //   Toast("请选择出生日期");
          //   return;
          // case "Industry":
          //   Toast("请选择当前所在行业");
          //   return;
          // case "Post":
          //   Toast("请选择当前岗位类别");
          //   return;
          // case "Rank":
          //   Toast("请选择当前职级");
          //   return;
        }
      }
    }
    e.target.value["Id"] = 0;
    e.target.value["MemberId"] = this.state.userid;
    e.target.value["PostId"] = this.state.tid;
    e.target.value["Enclosure"] = this.state.resumeurl;
    if (!/^1[345789]\d{9}$/.test(e.target.value.Contact)) {
      Toast("请输入正确的手机号码");
      return;
    }
if(!this.state.resumeurl){
  Taro.showModal({
    title: '提示',
    content: '发现您还没提交简历,是否需要去提交',
    cancelText:'否',
    confirmText:'是',
    success(res) {
      if (res.confirm) {
        return;
      } else if (res.cancel) {
        Http.post("WXDevelopment.ashx?t=6", e.target.value)
        .then(rec => {
          if(rec.state===200){
            Toast('感谢您成功举荐该人才，自即日起180天内该人才的所有权归您所有');
            setTimeout(()=>{
              Taro.navigateBack()
            },1000);

          }else{
            Toast(rec.msg);
          }
        })
        .catch(err => {

        });
      }
    }
  })
}else{
  Http.post("WXDevelopment.ashx?t=6", e.target.value)
  .then(rec => {
    if(rec.state===200){
      Toast('感谢您成功举荐该人才，自即日起180天内该人才的所有权归您所有');
      setTimeout(()=>{
        Taro.navigateBack()
      },1000);

    }else{
      Toast(rec.msg);
    }
  })
  .catch(err => {
    console.log(err);
  });
}

  };
openWord=()=>{
  let vm = this;
  Taro.chooseImage({
    count: 1,
    sizeType: ["original", "compressed"],
    sourceType: ["album", "camera"],
    success(res) {
      Taro.showLoading({
        title: '上传中',
      })
      wx.uploadFile({
        url: 'http://tthappy.wzxlkj.cn/admin/ashx/WXDevelopment.ashx?t=17', // 仅为示例，非真实的接口地址
        filePath:res.tempFilePaths[0],
        name: 'file',
        success(res) {
          // do something
          Taro.hideLoading();
          if(res.statusCode===200){
            let data=JSON.parse(res.data);
            vm.setState({ resumeurl:data.parma });
            Toast('上传成功');
          }
        }
      })
      // vm.setState({ resumeurl: res.tempFilePaths[0] });

    }
  });
}
  render() {
    return !this.state.isLoading ? (
      <View>
        <Form onSubmit={this.handleSubmit}>
          <View className="usercell">
            <View className="celltitle">姓名*</View>
            <View className="cellvalue">
              <Input
                type="text"
                name="Name"
                value={this.state.username}
                placeholder="请输入姓名"
              />
            </View>
          </View>
          <View className="usercell">
            <View className="celltitle">联系方式*</View>
            <View className="cellvalue">
              <Input
                type="text"
                name="Contact"
                value={this.state.tel}
                placeholder="请输入联系方式"
              />
            </View>
          </View>

          <View className="usercell">
            <View className="celltitle">性别</View>
            <View className="cellvalue">
              <View className="color-gary">
                <Picker
                  mode="selector"
                  range={this.state.alllist[3].List}
                  rangeKey="Name"
                  onChange={this.onsexChange}
                  name="Sex"
                  value={this.state.selSel.id}
                >
                  <View className="picker">
                    {this.state.selSel.Name || "请选择"}
                    <text class="iconfont icon-youjiantou font-gary" />
                  </View>
                </Picker>
              </View>
            </View>
          </View>
          <View className="usercell">
            <View className="celltitle">出生日期</View>
            <View className="cellvalue">
              <View className="color-gary">
                <Picker
                  mode="date"
                  onChange={this.onDateChange}
                  value="YYYY-MM-DD"
                  name="DateOfBirth"
                  value={this.state.dateSel}
                >
                  <View className="picker">
                    {this.state.dateSel || "请选择"}
                    <text class="iconfont icon-youjiantou font-gary" />
                  </View>
                </Picker>
              </View>
            </View>
          </View>
          <View className="usercell">
            <View className="celltitle">当前行业</View>
            <View className="cellvalue">
              <View className="color-gary">
                <Picker
                  mode="selector"
                  range={this.state.alllist[0].List}
                  rangeKey="Name"
                  onChange={this.onIndustryChange}
                  name="Industry"
                  value={this.state.industry.id}
                >
                  <View className="picker">
                    {this.state.industry.Name || "请选择"}
                    <text class="iconfont icon-youjiantou font-gary" />
                  </View>
                </Picker>
              </View>
            </View>
          </View>
          <View className="usercell">
            <View className="celltitle">当前类别</View>
            <View className="cellvalue">
              <View className="color-gary">
                <Picker
                  mode="selector"
                  range={this.state.alllist[1].List}
                  rangeKey="Name"
                  onChange={this.onPostChange}
                  name="Post"
                  value={this.state.post.id}
                >
                  <View className="picker">
                    {this.state.post.Name || "请选择"}
                    <text class="iconfont icon-youjiantou font-gary" />
                  </View>
                </Picker>
              </View>
            </View>
          </View>
          <View className="usercell">
            <View className="celltitle">当前职级</View>
            <View className="cellvalue">
              <View className="color-gary">
                <Picker
                  mode="selector"
                  range={this.state.alllist[2].List}
                  rangeKey="Name"
                  onChange={this.onRankChange}
                  name="Rank"
                  value={this.state.rank.id}
                >
                  <View className="picker">
                    {this.state.rank.Name || "请选择"}
                    <text class="iconfont icon-youjiantou font-gary" />
                  </View>
                </Picker>
              </View>
            </View>
          </View>
          <View className="usercell">
            <View className="celltitle">求职意向</View>
            {/* <View className="cellvalue">
            <Input type="text" placeholder="请输入求职意向" />
          </View> */}
          </View>
          <View className="celltext">
            <Textarea
              className="color-gary"
              placeholder="请输入求职意向"
              name="Details"
              value={this.state.details}
              autoHeight
            />
          </View>
          <View className="fixed-botton">
            <Button formType="submit">提交</Button>
            <Button onClick={this.openWord}>提交简历</Button>
          </View>
        </Form>
      </View>
    ) : (
      " "
    );
  }
}

export default Index;
