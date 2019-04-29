import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.less";
import Http from "../../server/api";
import { Toast } from "../../utensil/index";
class Index extends Component {
  config = {
    navigationBarTitleText: "发布岗位"
  };
  constructor(props) {
    super(props);
    this.state = {
      userid: Taro.getStorageSync("userid"),
      name: "",
      experience: "",
      manageName: "",
      contact: "",
      showaddress: "",
      salary: "",
      companyid: "",
      clist: [],
      cName: "",
      education: "",
      typelist: [],
      selSel: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps);
  }
  openJunm() {
    Taro.navigateTo({
      url: '/pages/createcombine/index'
    });
  }
  componentDidMount() {
    this.getTypedata();
  }
  getTypedata() {
    Http.post("WXDevelopment.ashx?t=29", {})
      .then(rec => {
        this.setState({ typelist: rec.parma });
      })
      .catch(err => {

      });
  }
  componentWillUnmount() {}

  componentDidShow() {
    Http.post("WXDevelopment.ashx?t=13", {
      MemberId: this.state.userid,
      Type:1
    })
      .then(rec => {
        this.setState({
          clist: rec.parma
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentDidHide() {}
  handleSubmit(e) {
    for (let prop in e.target.value) {
      if (
        e.target.value[prop] === null ||
        e.target.value[prop].toString().replace(/(^\s*)|(\s*$)/g, "") === ""
      ) {
        switch (prop) {
          case "Name":
            Toast("请输入岗位名称");
            return;
          case "Contact":
            Toast("请输入联系方式");
            return;
          case "JobCategory":
            Toast("请选择岗位类型");
            return;
          case "Experience":
            Toast("请输入工作经验");
            return;
          case "Education":
            Toast("请输入学历");
            return;
          case "Salary":
            Toast("请输入薪资");
            return;
          case "ManageName":
            Toast("请输入联系人");
            return;
          case "ShowAddress":
            Toast("请输入地址");
            return;
          case "CompanyId":
            Toast("请选择公司");
            return;
        }
      }
    }
    e.target.value["MemberId"] = this.state.userid;
    if (!/^1[345789]\d{9}$/.test(e.target.value.Contact)) {
      Toast("请输入正确的手机号码");
      return;
    }
    Http.post("WXDevelopment.ashx?t=14", e.target.value).then(rec => {
      if (rec.state === 200) {
        Toast(`添加成功
        请等待后台工作人员审核。`);
        setTimeout(() => {
          Taro.navigateBack();
        }, 1000);
      } else {
        Toast(rec.msg);
      }
    });
  }
  oncompanyChange(e) {
    this.setState({
      cName: this.state.clist[e.detail.value].CompanyName,
      companyid: this.state.clist[e.detail.value].CompanyId
    });
  }
  onTypeChange(e) {
    this.setState({ selSel: this.state.typelist[e.detail.value] });
  }
  render() {
    return this.state.clist.length ? (
      <View>
        <Form onSubmit={this.handleSubmit}>
          <View className="usercell">
            <View className="celltitle">岗位名称*</View>
            <View className="cellvalue">
              <Input
                type="text"
                name="Name"
                value={this.state.name}
                placeholder="请输入岗位名称"
              />
            </View>
          </View>
          <View className="usercell">
            <View className="celltitle">岗位类型*</View>
            <View className="cellvalue">
              <View className="color-gary">
                <Picker
                  mode="selector"
                  range={this.state.typelist}
                  rangeKey="Name"
                  onChange={this.onTypeChange}
                  name="JobCategory"
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
            <View className="celltitle">工作经验*</View>
            <View className="cellvalue">
              <Input
                type="text"
                name="Experience"
                value={this.state.experience}
                placeholder="请输入工作经验"
              />
            </View>
          </View>
          <View className="usercell">
            <View className="celltitle">学历*</View>
            <View className="cellvalue">
              <Input
                type="text"
                name="Education"
                value={this.state.education}
                placeholder="请输入学历"
              />
            </View>
          </View>
          <View className="usercell">
            <View className="celltitle">薪资*</View>
            <View className="cellvalue">
              <Input
                type="text"
                name="Salary"
                value={this.state.salary}
                placeholder="请输入薪资"
              />
            </View>
          </View>
          <View className="usercell">
            <View className="celltitle">联系人*</View>
            <View className="cellvalue">
              <Input
                type="text"
                name="ManageName"
                value={this.state.manageName}
                placeholder="请输入联系人姓名"
              />
            </View>
          </View>
          <View className="usercell">
            <View className="celltitle">联系方式*</View>
            <View className="cellvalue">
              <Input
                type="text"
                name="Contact"
                value={this.state.contact}
                placeholder="请输入联系方式"
              />
            </View>
          </View>
          <View className="usercell">
            <View className="celltitle">工作地址*</View>
            <View className="cellvalue">
              <Input
                type="text"
                name="ShowAddress"
                value={this.state.showaddress}
                placeholder="请输入工作地址"
              />
            </View>
          </View>
          <View className="usercell">
            <View className="celltitle">公司*</View>
            <View className="cellvalue">
              <View className="color-gary">
                <Picker
                  mode="selector"
                  range={this.state.clist}
                  rangeKey="CompanyName"
                  onChange={this.oncompanyChange}
                  name="CompanyId"
                  value={this.state.companyid}
                >
                  <View className="picker">
                    {this.state.cName || "请选择"}
                    <text class="iconfont icon-youjiantou font-gary" />
                  </View>
                </Picker>
              </View>
            </View>
          </View>
          <View className="com-botton">
            <Button formType="submit">提交</Button>
          </View>
        </Form>
      </View>
    ) : (
      <View className="nullclist">
        <Text className="iconfont icon-tixing" />
        <View>发布岗位前，请提交岗位所在公司的基本信息。</View>
        <Button
          className="gobutton"
          size="mini"
          onClick={this.openJunm.bind(this)}
        >
          立即推荐
        </Button>
      </View>
    );
  }
}
export default Index;
