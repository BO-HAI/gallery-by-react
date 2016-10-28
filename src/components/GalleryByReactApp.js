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

/**
 * 获取区间内的随机值
 * @param low
 * @param high
 */
function getRangeRandom(low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
}

/**
 *  获取 0～30度之间的任意正负值
 */
function get30DegRandom() {
    return Math.random() > 0.5 ? '' : '-' + Math.ceil(Math.random() * 30);
}

var ImgFigure = React.createClass({
    render: function () {
        var styleObj = {};
        // 如果props属性中指定了这张图片的位置，则使用
        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }

        // 如果图片的旋转角度有值并且不等于0，添加旋转角度
        if (this.props.arrange.rotate) {
            ['-moz-', '-ms-', '-webkit-', ''].forEach(function (prefix) {
                styleObj[prefix + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
            }.bind(this));
        }

        return (
            <figure className="img-figure" style={styleObj}>
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
        var imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPorRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,
            imgsArrangeTopArr = [],
            topImgNum = Math.ceil(Math.random() * 2),
            topImgSpliceIndex,
            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        // 首先剧中centerIndex的图片
        imgsArrangeCenterArr[0].pos = centerPos;
        // 剧中的centerIndex的图片不需要旋转
        imgsArrangeCenterArr[0].rotate = 0;

        // 取出要布局上侧的图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));

        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        // 布局位于上侧的图片
        imgsArrangeTopArr.forEach(function (value, index) {
            imgsArrangeTopArr[index] = {
                pos: {
                    top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                    left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                },
                rotate: get30DegRandom()
            };
        });

        // 布局左右两侧的图片
        for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            var hPosRangeLORX = null;

            // 前半部分布局左边，右边部分布局右边
            if (i < k) {
                hPosRangeLORX = hPosRangeLeftSecX;
            } else {
                hPosRangeLORX = hPosRangeRightSecX;
            }

            imgsArrangeArr[i] = {
                pos: {
                    top: getRangeRandom(hPorRangeY[0], hPorRangeY[1]),
                    left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                },
                rotate: get30DegRandom()

            };
        }

        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
           imgsArrangeArr: imgsArrangeArr
        });
    },

    getInitialState: function () {
        return {
            imgsArrangeArr: [
                {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0
                }
            ]
        };
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
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = halfStageH - halfImgH;

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
            if (!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0
                };
            }
            imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]}/>);
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
