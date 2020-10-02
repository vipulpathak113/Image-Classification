import React from "react";
import "./App.css";
import * as ml5 from "ml5";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      predictedImage: "",
      showVideo: false,
      showImage: true,
    };
    this.videoRef = React.createRef();
  }

  modelLoaded(video) {
    console.log("Model Loaded!");
    var canvas = document.getElementById("canvas");
    if (canvas == null) {
      this.classifier.predict(video, this.gotResults.bind(this));
    } else {
      this.classifier.predict(canvas, this.gotImageResults.bind(this));
    }
  }

  gotResults(error, results) {
    if (error) {
      console.error(error);
    } else {
      let newResults = results[0];
      this.setState({
        predictedImage: newResults.label,
      });
      this.classifier.predict(this.gotResults.bind(this));
    }
  }

  gotImageResults(error, results) {
    if (error) {
      console.error(error);
    } else {
      let newResults = results[0];
      this.setState({
        predictedImage: newResults.label,
      });
    }
  }

  componentDidMount() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    var img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);
    };
    img.src = "/baby_yoda.jpg";
  }

  handleChange() {
    this.setState(
      {
        showImage: true,
        showVideo: false,
      },
      () => {
        var file = document.getElementById("avatar").files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = function (event) {
          setTimeout(() => {
            var canvas = document.getElementById("canvas");
            var context = canvas.getContext("2d");

            var img = new Image();
            img.onload = function () {
              canvas.width = img.width;
              canvas.height = img.height;
              context.drawImage(img, 0, 0);
            };
            img.src = reader.result;
          });
        };
        this.classifier = ml5.imageClassifier(
          "MobileNet",
          this.modelLoaded.bind(this)
        );
      }
    );
  }

  handleVideo() {
    this.setState(
      {
        showVideo: true,
        showImage: false,
      },
      () => {
        let video = this.videoRef.current;
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          video.srcObject = stream;
        });
        this.classifier = ml5.imageClassifier(
          "MobileNet",
          video,
          this.modelLoaded.bind(this, video)
        );
      }
    );
  }

  render() {
    var { showVideo, showImage } = this.state;
    return (
      <div className="App">
        <div className="App-header">Image Classification</div>
        {showVideo ? (
          <video
            autoPlay={true}
            width="600"
            height="600"
            style={{ inlineSize: "auto" }}
            ref={this.videoRef}
          />
        ) : null}
        {showImage ? <canvas id="canvas" /> : null}
        <div style={{margin:"4px"}}>
          <input
            type="button"
            value="Start Video"
            className="inputButton"
            onClick={this.handleVideo.bind(this)}
          ></input>
        <label for="avatar" className="label">
          Upload Image
          <input
            type="file"
            style={{display:"none"}}
            id="avatar"
            name="avatar"
            accept="image/png, image/jpeg"
            onChange={this.handleChange.bind(this)}
          />
          </label>
        </div>
        <div className="predict-text" id="text">
          {this.state.predictedImage.length > 0
            ? `Predicted Image : ${this.state.predictedImage}`
            : "Predicted Image : Baby Yoda"}
        </div>
      </div>
    );
  }
}

export default App;
