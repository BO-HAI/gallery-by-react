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
        )
    }
});

var GalleryByReactApp = React.createClass({
    render: function() {
        var controllerUnits = [],
            imgFigures = [];

        imageData.forEach(function (value) {
            imgFigures.push(<ImgFigure data={value}/>);
        });

        return (
            <section className="stage">
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
