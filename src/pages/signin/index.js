import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView, Button } from "@tarojs/components";
import "./index.less";
import Http from "../../server/api";
import { Toast } from "../../utensil/index";
class Index extends Component {
  config = {
    navigationBarTitleText: "签到",
    usingComponents: {
      calendar: "plugin://calendar/calendar"
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      userid: Taro.getStorageSync("userid"),
      days: []
    };
  }

  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps);
  }
  componentDidMount() {
    this.getData();
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  getData() {
    let today = new Date(); //获得当前日期
    let year = today.getFullYear(); //获得年份
    let month = today.getMonth() + 1; //此方法获得的月份是从0---11，所以要加1才是当前月份
    Http.post("WXDevelopment.ashx?t=25", {
      MemberId: this.state.userid,
      Year: year,
      Month: month
    }).then(rec => {
      if (rec.state === 200) {
        let data = rec.parma.map(x => {
          return {
            month: "current",
            day: x,
            color: "#54CAC3",
            background: "#000000"
          };
        });
        this.setState({ days: data });
      }
    });
  }
  handleSign() {

    let today = new Date(); //获得当前日期
    let year = today.getFullYear(); //获得年份
    let month = today.getMonth() + 1; //此方法获得的月份是从0---11，所以要加1才是当前月份
    let day = today.getDate(); //获得当前日期
    Http.post("WXDevelopment.ashx?t=24", {
      MemberId: this.state.userid,
      Year: year,
      Month: month,
      Day: day
    }).then(rec => {
      if(rec.state === 200 ){
        Toast(rec.msg)
        let data=this.state.days
        data.push({month: "current", day: day, color: "#54CAC3", background: "#000000"})
        this.setState({ days:data});
      }else{
        Toast(rec.msg) ;
      }

    });
  }
  render() {
    return (
      <View>
        <calendar
          weeks-type="cn"
          next="{{false}}"
          prev="{{false}}"
          days-color={this.state.days}
        />
        <View className="signview">
          <Button onClick={this.handleSign}>签到</Button>
        </View>
      </View>
    );
  }
}
export default Index;
