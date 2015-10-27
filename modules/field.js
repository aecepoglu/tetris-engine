var React = require('react');
var ReactDOM = require('react-dom');
var settings = require('../settings');
var config = require('../config');

module.exports = React.createClass({
	componentDidMount: function() {
		var context = ReactDOM.findDOMNode(this).getContext('2d');
		this.paint(context);
	},
	componentDidUpdate: function() {
		var context = ReactDOM.findDOMNode(this).getContext('2d');
		//context.clearRect(0,0,settings.width,settings.height);
		this.paint(context);
	},
	paint: function(context) {
		context.save();

		if(this.props.tiles !== undefined) {
			this.props.tiles.forEach(function(row, rowIndex) {
				row.forEach(function(tile, colIndex) {
					if(tile === 0) {
						context.fillStyle="black";
					}
					else {
						context.fillStyle="red";
					}

					context.fillRect(
						colIndex * config.TILE_LEN,
						rowIndex * config.TILE_LEN,
						config.TILE_LEN, config.TILE_LEN
					);
				});
			});
		}

		context.restore();
	},
	render: function() {
		return <canvas width={settings.field_width * config.TILE_LEN} height={settings.field_height * config.TILE_LEN} />
	}
});
