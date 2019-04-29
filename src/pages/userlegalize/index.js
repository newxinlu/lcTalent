import Taro, { Component } from "@tarojs/taro";
import { View, Text, Form } from "@tarojs/components";
import "./index.less";
import Http from "../../server/api";
import { Toast } from "../../utensil/index";
class Index extends Component {
  config = {
    navigationBarTitleText: "用户认证"
  };
  constructor(props) {
    super(props);
    this.state = {
      userid: Taro.getStorageSync("userid"),
      tel: "",
      code: "",
      name: "",
      now: 0,
      timer: 180,
      isLegalize: false
    };
  }
  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps);
  }
  componentDidMount() {
    this.handleLegalize();
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
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
          case "Code":
            Toast("请输入验证码");
            return;
        }
      }
    }
    Http.post("WXDevelopment.ashx?t=20", {
      MemberId: this.state.userid,
      Tel: this.state.tel,
      Code: e.target.value.Code,
      Name: this.state.name
    }).then(rec => {
      Toast(rec.msg);
      if (rec.state == 200) {
        Taro.setStorageSync("isUserCard", 2);
        setTimeout(() => {
          Taro.navigateBack({ changed: true });
        }, 1500);
      }
    });
  };
  phone = e => {
    this.setState({
      tel: e.target.value
    });
  };
  setname = e => {
    this.setState({
      name: e.target.value
    });
  };
  confirmUse = () => {
    setTimeout(() => {
      if (!/^1[1-9]\d{9}$/.test(this.state.tel)) {
        Toast("手机号码有误，请重填");
        return;
      }
      Http.post("WXDevelopment.ashx?t=19", {
        Tel: this.state.tel
      }).then(rec => {
        Toast(rec.msg);
        if (rec.state == 200) {
          this.setState({
            now: 1
          });
          this.time();
        }
      });
    }, 300);
  };
  time = () => {
    if (this.state.timer > 0) {
      this.setState({
        timer: this.state.timer - 1
      });
      setTimeout(this.time, 1000);
    } else {
      this.setState({
        now: 0
      });
    }
  };
  handleLegalize = () => {
    Http.post("WXDevelopment.ashx?t=23", {
      MemberId: this.state.userid
    }).then(rec => {
      if (rec.state === 200) {
        this.setState({ isLegalize: true });
      } else {
        this.setState({ isLegalize: false });
      }
    });
  };
  render() {
    return !this.state.isLegalize ? (
      <View>
        <Form onSubmit={this.handleSubmit}>
          <View className="usercell">
            <View className="celltitle">姓名</View>
            <View className="cellvalue">
              <Input
                type="text"
                name="Name"
                value={this.state.name}
                onChange={this.setname}
                placeholder="请输入姓名"
              />
            </View>
          </View>
          <View className="usercell">
            <View className="celltitle">联系方式</View>
            <View className="cellvalue">
              <Input
                type="text"
                name="Contact"
                value={this.state.tel}
                onChange={this.phone}
                placeholder="请输入手机号码"
              />
            </View>
          </View>
          <View className="usercell">
            <View className="celltitle">验证码</View>
            <View className="cellvalue">
              <Input
                type="text"
                name="Code"
                className="code"
                value={this.state.code}
                placeholder="请输入验证码"
              />
              {
                <Button
                  onClick={this.confirmUse}
                  disabled={this.state.now == 1 ? "true" : ""}
                  className="mycode"
                >
                  {this.state.now == 1 ? this.state.timer : "获取验证码"}
                </Button>
              }
            </View>
          </View>
          <View className="com-botton">
            <Button formType="submit">提交</Button>
          </View>
        </Form>
      </View>
    ) : (
      <View className="oklegalize">
        <Text className="iconfont icon-renzheng" />
        <View>恭喜你,认证成功!</View>
      </View>
    );
  }
}
export default Index;
