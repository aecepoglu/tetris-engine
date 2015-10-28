var ipc = require('ipc');
var React = require('react');
var ReactDOM = require('react-dom');

var Field = require('./field');
var BlockView = require('./block-view');
var Points = require('./points');

module.exports = React.createClass({
	render: function() {
		return (
			<div className="player">
				<h1>{this.props.name}</h1>
				<BlockView shape={this.props.next_piece_type}/>
				<Field tiles={this.props.field}/>

				<div>{this.props.row_points} Points</div>
				<div>X{this.props.row_points} Combo</div>
			</div>
		);
	}
});