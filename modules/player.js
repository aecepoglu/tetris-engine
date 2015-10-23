var ipc = require('ipc');
var React = require('react');
var ReactDOM = require('react-dom');

var Fields = require('./fields');
var BlockView = require('./block-view');
var Points = require('./points');

module.exports = React.createClass({
	render: function() {
		return (
			<div>
				<h1>{this.props.name}</h1>
				<Fields player={this.props.name}/>
				<NextBlockView/>
				<Points player={this.props.name}/>
			</div>
		);
	}
});
