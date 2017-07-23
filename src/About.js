import React, { Component } from 'react';
import './App.css';

class About extends Component {
	constructor(){
		super();
	}
	render(){
		return(
		<div className='bodyDiv'>
			<h2> About Trash Chat </h2>
			<p> Trash chat was created to allow people to easily chat with others online without having to add them
			as friends or requiring them to share any information. The hope is that strangers on the Internet who want to have arguments
			in comments sections or after a team videogame can do that through here instead. The chat is fairly basic, but there
			isn't any censoring or moderating so you can say what you need to say. Please keep everything legal (if you say I'm going
			to kill you thats illegal), and please don't enter a trash chat if you don't want someone saying something mean to you.
			</p>
		</div>);
	}
}

export default About;