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
import { Toast } from "../../utensil";
class Index extends Component {
  config = {
    navigationBarTitleText: "邀请好友"
  };
  constructor(props) {
    super(props);
    this.state = {
      imglist: [],
      text: [],
      selectedImg: "",
      userid: Taro.getStorageSync("userid"),
      qrimgurl: "",
      nickName: "",
      isbutton: true,
      crtqrimg: "",
      downloadimg:'',
    };
    this.nextStep = this.nextStep.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }
  componentDidMount() {
    Http.get("Members.ashx?t=7", {})
      .then(rec => {
        this.setState({
          imglist: rec.parma[1].Content,
          text: rec.parma[1].Content,
          selectedImg: rec.parma[1].Content[0].Content
        },()=>{
          this.downulr(this.state.selectedImg);
        });
      })
      .catch(err => {});
    let vm = this;
    Taro.getSetting({
      success(res) {
        if (res.authSetting["scope.userInfo"]) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          Taro.getUserInfo({
            success(res) {
              vm.setState({ nickName: res.userInfo.nickName });
            }
          });
        }
      }
    });
    this.getImg();
  }
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  handleImg(img) {
    this.setState({ selectedImg: img.Content },()=>{
      this.downulr(this.state.selectedImg);
      // this.createCanvas();
    });
  }

  nextStep() {
    Taro.canvasToTempFilePath({
      canvasId: "qimg",
      success(res) {
        Taro.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(rec) {
            Toast(`保存成功
            图片已保存至手机相册，
            您可前往分享图片至朋友圈`);
          }
        });
      }
    });
  }
  getImg() {
    Http.post("WXDevelopment.ashx?t=15", {
      Scene: this.state.userid
    }).then(rec => {
      Taro.getImageInfo({
        src: rec.parma,
        success: res => {
          this.setState({ qrimgurl: res.path,isbutton: false}, () => {
            this.createCanvas();
          });
        }
      });
    });
  }
  // saveImg() {
  //   let vm = this;
  //   Taro.canvasToTempFilePath({
  //     canvasId: "qimg",
  //     success(res) {
  //       console.log(res.tempFilePath);
  //       vm.setState({ crtqrimg: res.tempFilePath, isbutton: false }, () => {
  //         console.log(vm.state.crtqrimg);
  //       });
  //     }
  //   });
  // }
  downulr(url){
    let vm=this;
    wx.getImageInfo({
      src: url,
      success: function (res) {
        vm.setState({downloadimg:res.path},()=>{
          vm.createCanvas();
        })
      }
    })
  }


  createCanvas(url) {
    const ctx = Taro.createCanvasContext("qimg", this);
    ctx.setFillStyle("#fff");
    ctx.fillRect(0, 0, 225, 360);
      if (
        typeof this.state.downloadimg!= "undefined" &&
        this.state.downloadimg != ""
      ) {
        ctx.drawImage(this.state.downloadimg, 0, 0, 225, 300);
      }

    if (
      typeof this.state.qrimgurl != "undefined" &&
      this.state.qrimgurl != ""
    ) {
      ctx.drawImage(this.state.qrimgurl, 170, 305, 50, 50);
    }
    ctx.setFillStyle("#000"); // 文字颜色：黑色
    ctx.font = "11px 宋体";
    ctx.fillText(`我是${this.state.nickName}`, 10, 320);
    ctx.setFillStyle("#000"); // 文字颜色：黑色
    ctx.font = "10px 宋体";
    ctx.fillText(`邀您一起快乐分享`, 10, 335);
    ctx.fillText(`让天下没有难招的人`, 10, 350);
    ctx.draw();
  }
  openchooseImage() {
    let vm = this;
    Taro.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success(res) {
        console.log(res.tempFilePaths);
        // tempFilePath可以作为img标签的src属性显示图片
        vm.setState({ downloadimg: res.tempFilePaths[0] },()=>{
          vm.createCanvas();
        });
        const tempFilePaths = res.tempFilePaths;
      }
    });
  }
  render() {
    let img = this.state.imglist;
    return (
      <View>
        <View className="showimg">
          {/* <Image src={this.state.selectedImg} mode="aspectFill" /> */}
          <Canvas style="width: 225px; height: 360px;" canvasId="qimg" />
        </View>
        <ScrollView
          className="imglist"
          scrollX
          scrollTop="0"
          scrollWithAnimation
          // lowerThreshold="20"
          // upperThreshold="110"
        >
          <View className="addimg" onClick={this.openchooseImage.bind(this)} />
          {img.map((x, i) => {
            return (
              <View onClick={this.handleImg.bind(this, x)} key={i}>
                <Image src={x.Content} />
              </View>
            );
          })}
        </ScrollView>
        <View className="dowm-view">
          <Button
            onClick={this.nextStep}
            type="primary"
            disabled={this.state.isbutton}
          >
            完成
          </Button>
        </View>
      </View>
    );
  }
}

export default Index;
