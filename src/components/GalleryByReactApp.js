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

var GalleryByReactApp = React.createClass({
  render: function() {
    return (
        <section className="stage">
            <section className="img-sec">

            </section>
            <nav className="controller-nav">

            </nav>
        </section>
    );
  }
});
React.render(<GalleryByReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryByReactApp;
