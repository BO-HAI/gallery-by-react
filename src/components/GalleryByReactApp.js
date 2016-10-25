'use strict';

var React = require('react/addons');
//var ReactTransitionGroup = React.addons.TransitionGroup;

// CSS
require('normalize.css');
require('../styles/main.scss');

var imageData = require('../data/imageData.json');

imageData = (function (data) {
    var i, len;

    for (i = 0, len = data.length; i < len; i++) {
        var singleImageData = data[i];
        singleImageData.imageUrl = require('../images/' + singleImageData.fileName);

        data[i] = singleImageData;
    }

    return data;
}(imageData));

var ImgFigure = React.createClass({
    render: function () {
        return (
            <figure className="img-figure">
                <img src={this.props.data.imageUrl} alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">
                        {this.props.data.title}
                    </h2>
                </figcaption>
            </figure>
        );
    }
});

var GalleryByReactApp = React.createClass({
    Constant: {
        centerPos: {
            left: 0,
            right: 0
        },

        // 水平方向取值范围
        hPosRange: {
            leftSecX: [0, 0],
            rightSecX: [0, 0],
            y: [0, 0]
        },

        // 垂直方向取值范围
        vPosRange: {
            x: [0, 0],
            topY: [0, 0]
        }
    },

    /**
     * 重新布局所有图片
     * @param centerIndex
     */
    rearrange: function (centerIndex) {
        var imagesArrangeArr = this.state.imgArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos;
    },

    getInitialState: function () {
        return {
            imgArrangeArr: [
                {
                    pos: {
                        left: 0,
                        top: 0
                    }
                }
            ]
        }
    },

    // 组件加载以后，为每张图片计算位置范围
    componentDidMount: function () {

        // 舞台大小
        var stageDOM = React.findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);

        // 拿到imgFigure的大小
        var imgFigureDOM = React.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);

        // 中心图片位置
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgW
        };


        // 计算左侧，右侧区域图片排布位置取值范围
        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfImgW - halfImgW * 3;
        this.Constant.hPosRange.rightSecX[0] = halfImgW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;

        // 计算上侧区域图片排布位置取值范围
        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;

        this.rearrange(0);
    },

    render: function() {
        var controllerUnits = [],
            imgFigures = [];

        imageData.forEach(function (value, index) {
            if (!this.state.imgArrangeArr[index]) {
                this.state.imgArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    }
                }
            }
            imgFigures.push(<ImgFigure data={value} ref={'imgFigure-' + index}/>);
        }.bind(this));

        return (
            <section className="stage" ref="stage">
                <section className="img-sec">
                    {imgFigures}
                </section>
                <nav className="controller-nav">
                    {controllerUnits}
                </nav>
            </section>
        );
    }
});
React.render(<GalleryByReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryByReactApp;
