import './App.css';
import React, { Component} from 'react';
import ReactDOM from 'react-dom';
import Chat from './Chat.js';
import About from './About.js';
import Footer from './Footer.js';

class App extends Component {
	constructor(){
		super();
		var urlParts = window.location.href.replace('//',"").split("/");
		var component = Chat;
		if(urlParts.length && urlParts[1].toLowerCase() == 'about'){
			component = About;
		}
		this.state= {component};
	}
	render(){
		return (<div id='pageDiv'>
		{React.createElement(this.state.component)}
		<Footer/>
		</div>);
	}
}

export default App;