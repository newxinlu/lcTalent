import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text, Image, Picker, Form } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import "./index.less";
import Http from "../../server/api";
import { Toast } from "../../utensil/index";
class Index extends Component {
  config = {
    navigationBarTitleText: "推荐合作"
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      alllist: [],
      text: [],
      selectedImg: "",
      citySel: [],
      cityText: [],
      cooper: {},
      post: {},
      name: "",
      managername:'',
      tel: "",
      details: "",
      tid: this.$router.params.tid | 0,
      userid: Taro.getStorageSync("userid"),
      animationAddressMenu: false
    };
  }
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }
  componentDidMount() {
    Http.post("WXDevelopment.ashx?t=16", {})
      .then(rec => {
        this.setState({
          alllist: rec.parma,
          citylist: rec.parma.ProvinceList[0].CityList,
          isLoading: false
        });
      })
      .catch(err => {});
  }
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}


  onCooperChange = e => {
    this.setState({
      cooper: this.state.alllist.CooperationList[e.detail.value]
    });
  };
  onPostChange = e => {
    this.setState({
      post: this.state.alllist.PositionList[e.detail.value]
    });
  };
  onChange = e => {
      let index = e.detail.value[0];
      let index2 = e.detail.value[1];
      let data = this.state.alllist.ProvinceList[index];
      let data2 = data.CityList[index2];
      this.setState({
        citylist: this.state.alllist.ProvinceList[index].CityList,
        citySel: [data.Id, data2.Id],
        cityText: [data.Title, data2.Title]
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
            Toast("请输入公司名称");
            return;
          case "Contact":
            Toast("请输入电话号码");
            return;
          case "Cooperation":
            Toast("请选择合作意向");
            return;
            case "ManagerName":
            Toast("请输入联系人名称");
            return;
            // case "Remark":
            // Toast("请输入合作需求描述");
            // return;
        }
      }
    }
    e.target.value["MemberId"] = this.state.userid;
    if (!this.state.citySel.length) {
      Toast("请选择省市");
      return;
    }
    if (!/^1[34578]\d{9}$/.test(e.target.value.Contact)) {
      Toast("请输入正确的手机号码");
      return;
    }
    e.target.value["Province"] = this.state.citySel[0];
    e.target.value["City"] = this.state.citySel[1];
    Http.post("WXDevelopment.ashx?t=3", e.target.value)
      .then(rec => {
        if (rec.state === 200) {
          Toast(`添加成功
          请等待后台工作人员审核。`);
          setTimeout(() => {
            Taro.navigateBack();
          }, 2000);
        } else {
          Toast(rec.msg);
        }
      })
      .catch(err => {
        // console.log(err);
      });
  };
  openCity() {
    if (!this.state.citySel.length) {
      let data = this.state.alllist.ProvinceList[0];
      let data2 = data.CityList[0];
      this.setState({
        citySel: [data.Id, data2.Id],
        cityText: [data.Title, data2.Title]
      });
    }
    this.setState({
      animationAddressMenu: !this.state.animationAddressMenu
    });
  }
  render() {
    return !this.state.isLoading ? (
      <View>
        <Form onSubmit={this.handleSubmit}>
          <View className="usercell" onClick={this.openCity.bind(this)}>
            <View className="celltitle">所在省市*</View>
            <View className="cellvalue">
              <View className="color-gary">
                {this.state.cityText[0] + this.state.cityText[1] || "请选择"}
              </View>
            </View>
          </View>
          <View className="usercell">
            <View className="celltitle">联系人*</View>
            <View className="cellvalue">
              <Input
                type="text"
                name="ManagerName"
                value={this.state.managername}
                placeholder="请填写姓名"
              />
            </View>
          </View>
          <View className="usercell">
            <View className="celltitle">联系人职位</View>
            <View className="cellvalue">
              <View className="color-gary">
                <Picker
                  mode="selector"
                  range={this.state.alllist.PositionList}
                  rangeKey="Name"
                  onChange={this.onPostChange}
                  name="AMemberPosition"
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
            <View className="celltitle">联系方式*</View>
            <View className="cellvalue">
              <Input
                type="text"
                name="Contact"
                value={this.state.tel}
                placeholder="请填写联系方式"
              />
            </View>
          </View>
          <View className="usercell">
            <View className="celltitle">公司名称*</View>
            <View className="cellvalue">
              <Input
                type="text"
                name="Name"
                value={this.state.name}
                placeholder="请填写公司名称"
              />
            </View>
          </View>
          <View className="usercell">
            <View className="celltitle">合作意向*</View>
            <View className="cellvalue">
              <View className="color-gary">
                <Picker
                  mode="selector"
                  range={this.state.alllist.CooperationList}
                  rangeKey="Name"
                  onChange={this.onCooperChange}
                  name="Cooperation"
                  value={this.state.cooper.id}
                >
                  <View className="picker">
                    {this.state.cooper.Name || "请选择"}
                    <text class="iconfont icon-youjiantou font-gary" />
                  </View>
                </Picker>
              </View>
            </View>
          </View>
          <View className="celltext">
            <Textarea
              className="color-gary"
              placeholder="合作需求概述"
              name="Remark"
              value={this.state.details}
              autoHeight
            />
          </View>
          <View
            className="closecity"
            onClick={this.openCity.bind(this)}
            style={`visibility:${animationAddressMenu ? "visible" : "hidden"}`}
          />
          <View
            className="picker-view"
            style={`visibility:${animationAddressMenu ? "visible" : "hidden"}`}
          >
            <View style="height:10% ;width:95%;margin-top:10rpx">
              <Text onClick={this.openCity.bind(this)}>取消</Text>
              <Text style="float: right" onClick={this.openCity.bind(this)}>
                确定
              </Text>
            </View>
            <PickerView
              indicatorStyle="height: 50px;"
              style="width: 100%; height: 300px;"
              value={this.state.value}
              onChange={this.onChange}
            >
              <PickerViewColumn>
                {this.state.alllist.ProvinceList.map((item,i) => {
                  return <View className="picker-item" key={i}>{item.Title}</View>;
                })}
              </PickerViewColumn>
              <PickerViewColumn>
                {this.state.citylist.map((item,i) => {
                  return <View key={i}>{item.Title}</View>;
                })}
              </PickerViewColumn>
            </PickerView>
          </View>

          <View className="com-botton">
            <Button formType="submit">提交</Button>
          </View>
        </Form>
      </View>
    ) : (
      " "
    );
  }
}

export default Index;
