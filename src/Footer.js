import './App.css';
import React, { Component} from 'react';

class Footer extends Component {
	constructor(){
		super();
	}
	render(){
		var curRoom = this.props.roomId ? <a href = {"/room?"+this.props.roomId}> Back to room </a> : null;
		return <div id='footerDiv'> 
			<a href = "/about"> About </a>
			<a href = "/room"> New Room </a>
			{curRoom}
		</div>
	}
}

export default Footer;