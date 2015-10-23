var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
	getInitialState: function getInitialState() {
		return { name: 'default-name' };
	},
	render: function render() {
		return <b>{this.props.name}</b>
	}
});
