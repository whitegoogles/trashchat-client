import React, { Component } from 'react';
import {FormGroup,ControlLabel,	FormControl, Modal,Button} from 'react-bootstrap'; 
import logo from './logo.svg';
import './App.css';
const uuidv4 = require('uuid/v4');
var qs = require('qs');
const io = require('socket.io-client');

class Chat extends Component {
	
  constructor(){
	super();
	this.sendMessage = this.sendMessage.bind(this);
	this.close = this.close.bind(this);
	var queryStr = window.location.href.split('?')[1];
	var room = "";
	if(queryStr){
		room = qs.parse(queryStr).room;
	}
	var storedId = window.sessionStorage.getItem("id");
	var storedName = window.sessionStorage.getItem("name");
	var id = storedId;
	if(!storedId){
		id = uuidv4();
	}
	this.state = {
		name:storedName ? storedName : "Anonymous",
		setName:!storedId,
		messages:[],
		message:"",
		room:room,
		charLimit:2000,
		nameLimit:20,
		roomClosed:false,
		autoScroll:true,
		id:id,
		messagesIndex:0,
		mouseDown:false
	};
	if(!room){
		fetch("/room").then(resp=>resp.json()).then(resp=>{
			window.location.href = window.location.href+"?room="+resp.roomId;
		});
	}
	this.getLast50Messages = this.getLast50Messages.bind(this);
  }
  
  componentDidMount(){
	  if(this.state.room){
		//We've got a room, get me that socket
		const socket = io();
		socket.on('message-received',(data)=>{
			var messages = this.state.messages.slice();
			messages.push(data);
			this.setState({messages});
		});
		socket.on('room-closed',()=>{this.setState({roomClosed:true});});
		socket.on('room-joined-at',(data)=>{
			this.setState({messagesIndex:data.index},this.getLast50Messages);	
		});
		socket.on('last-50-messages',(data)=>{
			console.log("GOT EM");
			var messages = data.messages.concat(this.state.messages);	
			var messagesIndex = data.index;
			this.setState({messages,messagesIndex});
		});
		socket.emit('room-opened',{room:this.state.room});
		this.socket = socket;
	  }
  }
  
  close(){
	window.sessionStorage.setItem("id",this.state.id);
	window.sessionStorage.setItem("name",this.state.name);
	this.setState({setName:false});
  }
  
  sendMessage(){
	var that = this;
	var message= this.state.message.substring(0,that.state.charLimit).trim();
	if(this.socket && message){
		this.setState({message:""});
		this.socket.emit('message-sent',{
			room:this.state.room,
			message:message,
			name:this.state.name,
			id:this.state.id
		});
	}
	else if(!this.socket){
		//Show some error and display a reconnect button?
	}
  }
  
  componentDidUpdate(){
	if(this.state.autoScroll && this.messagesDiv){
		this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
	}
  }
  
  getLast50Messages(){
	var index = this.state.messagesIndex;
	this.setState({messagesIndex:0});
	console.log("getting the last 50 messages");
	this.socket.emit('get-last-50-messages',{index:index,room:this.state.room});
  }
  
  render() {
    return this.state.room ?(
      <div className='bodyDiv'>
		<Modal show = {this.state.setName} onHide = {this.close}>
			<Modal.Header closeButton>
				<Modal.Title> Enter trash chat </Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<FormGroup>
					<FormControl maxLength = {""+this.state.nameLimit} type= 'text' placeholder='Screen name' onKeyPress = {(e)=>{
						if(e.key === 'Enter'){
							this.close();
						}
					}} onChange={(e)=>{
						this.setState({name:e.target.value.substring(0,this.state.nameLimit).trim()});
					}}/>  
				</FormGroup>
			</Modal.Body>
			<Modal.Footer>
				<span> Disclaimer - Don't enter this room if you don't want people saying mean things to you on the Internet. </span>
				<a href="/about.html"> About? </a>
				<Button onClick={this.close}> Close </Button>
			</Modal.Footer>
		</Modal>
		<h2> Trash chat </h2>
		<div id='messages' ref = {(messagesDiv)=>{this.messagesDiv = messagesDiv}} onMouseDown = {()=>{
			this.setState({
				mouseDown:true,
				autoScroll:false
			});
		}}
		onMouseUp = {()=>{
			var div = this.messagesDiv;
			var autoScroll = Math.ceil(div.scrollTop+div.offsetHeight) === div.scrollHeight;
			this.setState({autoScroll:autoScroll,mouseDown:false});	
		}}onScroll = {(e)=>{
			var div = this.messagesDiv;
			if(div){
				if(!div.scrollTop && this.state.messagesIndex){
					this.getLast50Messages();
				}
			}
		}}>
			{
			this.state.messages.map((data,i)=>{
				return <div key = {""+i} className={'message '+ (data.id===this.state.id ? 'my-message':'')}> 
						<strong><span className='author'> {data.name} </span></strong>
						<span className='time'> {data.time}</span>
						<br/>
						<span className='text'> {data.message}</span>
					   </div>;
			})
			}
		</div>	
		<FormControl maxLength = {""+this.state.charLimit} componentClass= 'textArea' placeholder='Message trash' value = {this.state.message} onKeyUp = {(e)=>{
			if(e.key === 'Enter'){
				this.sendMessage();
			}
		}} onChange={(e)=>{
			this.setState({message:e.target.value});
		}}/> 
	  </div>
    ) : null;
  }
}

export default Chat;
