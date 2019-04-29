import Taro, { Component } from "@tarojs/taro";
import {
  View,
  Button,
  Text,
  Image,
  ScrollView,
  Canvas,
  Radio
} from "@tarojs/components";
import "./index.less";
import Http from "../../server/api";
import { Toast } from "../../utensil";
class Index extends Component {
  config = {
    navigationBarTitleText: "邀请"
  };
  constructor(props) {
    super(props);
    this.state = {
      text: [],
      selectedImg: this.$router.params.img,
      tabindex: 1,
      userid: Taro.getStorageSync("userid"),
      base64: "",
      ctext: "1234",
      imgurl: "",
      qrimgurl: this.$router.params.qrimg,
      isbutton: true
    };
  }
  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps);
  }
  componentDidMount() {
    this.createCanvas();
    Http.get("Members.ashx?t=7", {})
      .then(rec => {
        let textlist = rec.parma[1].Content.map((x, i) => {
          if (i === 0) {
            return (x.checked = true);
          }
          return (x.checked = false);
        });
        this.setState(
          {
            text: rec.parma[1].Content,
            ctext: rec.parma[1].Content[0].Content
          },
          () => {
            this.createCanvas();
          }
        );
      })
      .catch(err => {});
  }
  // getImg() {
  //   Http.post("WXDevelopment.ashx?t=15", {
  //     Scene: this.state.userid
  //   }).then(rec => {
  //     Taro.getImageInfo({
  //       src: rec.parma,
  //       success: res => {
  //         this.setState({ qrimgurl: res.path }, () => {
  //           this.createCanvas();
  //         });
  //       }
  //     });
  //   });
  // }
  createCanvas() {
    const ctx = Taro.createCanvasContext("shareimg", this);
    ctx.setFillStyle("white");
    let url = this.state.imgurl;
    if (typeof url != "undefined" && url != "") {
      ctx.drawImage(url, 0, 0, 225, 300);
    }
    if (
      typeof this.state.qrimgurl != "undefined" &&
      this.state.qrimgurl != ""
    ) {
      ctx.drawImage(this.state.qrimgurl, 0, 300, 225, 60);
      this.setState({
        isbutton: false
      });
    }
    ctx.setFillStyle("#000"); // 文字颜色：黑色
    ctx.font = "12px microsoft yahei";
    let conttext = this.state.ctext;
    let canvasWidth = 200; //计算canvas的宽度
    let lineWidth = 0;
    let initHeight = 100; //绘制字体距离canvas顶部初始的高度
    let lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < conttext.length; i++) {
      lineWidth += ctx.measureText(conttext[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(conttext.substring(lastSubStrIndex, i), 10, initHeight); //绘制截取部分
        initHeight += 15; //15为字体的高度
        lineWidth = 0;
        lastSubStrIndex = i;
      }
      if (i == conttext.length - 1) {
        ctx.fillText(
          conttext.substring(lastSubStrIndex, i + 1),
          10,
          initHeight
        );
      }
    }
    ctx.draw();
  }
  componentWillUnmount() {}

  componentDidShow() {
    let vm = this;
    let url = this.$router.params.img;
    Taro.getImageInfo({
      src: url,
      success: res => {
        var ctx = wx.createCanvasContext("qimg");
        const imgX = res.width; //图片的实际宽度
        const imgY = res.height; //图片的实际高度
        const canH = 250;
        const canvW = 200;
        let dWidth = 0; //图片按比例缩放后的宽
        let dHeight = 0; //图片按比例缩放以后的高
        if (imgX > imgY) {
          dHeight = canH;
          dWidth = imgX / (imgY / canH);
          if (dWidth < canvW) {
            dWidth = canvW;
            dHeight = imgY / (imgX / canvW);
          }
        } else {
          dWidth = canvW;
          dHeight = imgY / (imgX / canvW);
          if (dHeight < canH) {
            dHeight = canH;
            dWidth = imgX / (imgY / canH);
          }
        }
        const dx = (dWidth - canvW) / 2; //图像的左上角在目标canvas上 X 轴的位置
        const dy = (dHeight - canH) / 2; //图像的左上角在目标canvas上 Y 轴的位置
        ctx.drawImage(res.path, -dx, -dy, dWidth, dHeight);
        ctx.draw();
        setTimeout(function() {
          Taro.canvasToTempFilePath({
            canvasId: "qimg",
            success: function(res) {
              vm.setState({ imgurl: res.tempFilePath }, () => {
                vm.createCanvas();
              });
            },
            fail: function(error) {
            }
          });
        }, 500);
      }
    });
  }

  componentDidHide() {}
  roladText({ detail }) {
    this.setState({ ctext: detail.value }, () => {
      this.createCanvas();
    });
  }
  saveImg() {
    Taro.canvasToTempFilePath({
      canvasId: "shareimg",
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
  switchTab(type) {
    this.setState({ tabindex: type });
  }
  completeText({ detail }) {
    this.setState({ ctext: detail.value }, () => {
      this.createCanvas();
    });
  }
  render() {
    let img = this.state.imglist;
    return (
      <View>
        <View className="showimg">
          <Canvas style="width: 225px; height: 360px;" canvasId="shareimg" />
        </View>
        <View style="width:0px;height:0px;overflow:hidden;">
          <Canvas
            style="width: 200px; height: 250px;position: relative;left: 10000rpx;"
            canvasId="qimg"
          />
        </View>
        <View className="tabText">
          <View
            className={`tabitem ${
              this.state.tabindex === 1 ? "tabactive" : null
            }`}
            onClick={this.switchTab.bind(this, 1)}
          >
            选金句
          </View>
          <View
            className={`tabitem ${
              this.state.tabindex === 2 ? "tabactive" : null
            }`}
            onClick={this.switchTab.bind(this, 2)}
          >
            自己写
          </View>
        </View>
        <ScrollView
          scrollY
          style="height: 150px;"
          className={`tabgoodtext ${
            this.state.tabindex === 1 ? "show" : "hide"
          }`}
        >
          <RadioGroup onChange={this.roladText}>
            {this.state.text.map((item, i) => {
              return (
                <Label className="radio-list__label" for={i} key={i}>
                  <Radio
                    className="radio-list__radio"
                    value={item.Content}
                    checked={item.checked}
                  >
                    {item.Content}
                  </Radio>
                </Label>
              );
            })}
          </RadioGroup>
        </ScrollView>
        <View
          className={`tabmyext ${this.state.tabindex === 2 ? "show" : "hide"}`}
        >
          <Textarea
            style={`background:#fff;width:95%;padding:15rpx;height:80px;`}
            maxlength="30"
            hidden={this.state.tabindex === 1}
            onInput={this.completeText}
          />
          {/* <Input onInput={this.completeText}></Input> */}
        </View>
        <View className="dowm-view">
          <Button
            type="primary"
            onClick={this.saveImg}
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
