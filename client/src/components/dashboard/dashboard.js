import React from 'react';
import axios from 'axios';

import socketIOClient from "socket.io-client";


import NewChatComponent from '../NewChat/newChat';
import ChatListComponent from '../ChatList/chatList';
import ChatViewComponent from '../ChatView/chatView';
import ChatTextBoxComponent from '../ChatTextBox/chatTextBox';

import styles from './style';

import { Button, withStyles } from '@material-ui/core';


// I need to investigate why sometimes
// two messages will send instead of just
// one. I dont know if there are two instances
// of the chat box component or what...

// I will be using both .then and async/await
// in this tutorial to give a feel of both.

class DashboardComponent extends React.Component {

  constructor() {
    super();
    this.state = {
      endpoint : 'http://localhost:9000/',
      selectedChat: null,
      newChatFormVisible: false,
      email: null,
      friends: [],
      chats: []
    };
  }


  signOut = () => {
      //implemention for signout request
  };

  submitMessage = (msg) => {
    
    const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat]
      .users
      .filter(_usr => _usr !== this.state.email)[0])

    const user ={
      id:docKey,
      message:{message:msg,sender:this.state.email}
    }

    axios.post('http://localhost:9000/sendmessage', user)
    .then(res => {
      console.log(res);
      if(res.data){
        console.log("message sent")

      }
      
      
    })

  }

  // Always in alphabetical order:
  // 'user1:user2'
  buildDocKey = (friend) => [this.state.email, friend].sort().join(':');

  newChatBtnClicked = () => this.setState({ newChatFormVisible: true, selectedChat: null });

  newChatSubmit = async (chatObj) => {
    const docKey = this.buildDocKey(chatObj.sendTo);
    
    const obj ={id:docKey,user:this.state.email,friend:chatObj.sendTo,message:{message:chatObj.message,sender:this.state.email}}
    axios.post('http://localhost:9000/createroom', obj)
    .then(res => {
      console.log(res);
      if(res.data){

        this.setState({ newChatFormVisible: false });
    
      }
    })

  }

  selectChat = async (chatIndex) => {
    await this.setState({ selectedChat: chatIndex, newChatFormVisible: false });
    this.messageRead();
  }

  goToChat = async (docKey, msg) => {
    const usersInChat = docKey.split(':');
    const chat = this.state.chats.find(_chat => usersInChat.every(_user => _chat.users.includes(_user)));
    this.setState({ newChatFormVisible: false });
    await this.selectChat(this.state.chats.indexOf(chat));
    this.submitMessage(msg);
  }

  // Chat index could be different than the one we are currently on in the case
  // that we are calling this function from within a loop such as the chatList.
  // So we will set a default value and can overwrite it when necessary.
  messageRead = () => {
    const chatIndex = this.state.selectedChat;
    const docKey = this.buildDocKey(this.state.chats[chatIndex].users.filter(_usr => _usr !== this.state.email)[0]);
    if(this.clickedMessageWhereNotSender(chatIndex)) {

       axios.post('http://localhost:9000/readmessage', {id:docKey})
       .then(res => {
         console.log(res);
       })

    } 
    else {
      console.log('Clicked message where the user was the sender');
    }
  }

  clickedMessageWhereNotSender = (chatIndex) => this.state.chats[chatIndex].messages[this.state.chats[chatIndex].messages.length - 1].sender !== this.state.email;


  componentDidMount = () => {

    console.log("component did mount");
    
    const {endpoint} = this.state;
    const socket = socketIOClient(endpoint);

    socket.on("update collection", data => {

      const usersInChat = data.id.split(':')

      if(this.state.email!==''){
        const user = usersInChat.includes(this.state.email)
        if(user){
          
          axios.post('http://localhost:9000/getchat', {username:this.state.email})
          .then(res => {
            console.log(res);
            if(res.data)
            {
              this.setState({
                chats: res.data,
                friends: []
              });
            }
          })
        }

      }

    });

    socket.on("chat added", data => {

      const usersInChat = data.id.split(':')

      if(this.state.email!==''){
        const user = usersInChat.includes(this.state.email)
        if(user){
          
          axios.post('http://localhost:9000/getchat', {username:this.state.email})
          .then(res => {
            console.log(res);
            if(res.data)
            {
              this.setState({
                chats: res.data,
                friends: []
              });
            }
          })
        }

      }

    });

  }

  componentWillMount = () => {


    const user ={
      username:localStorage.getItem("username"),
      password:localStorage.getItem("password")
    }

    axios.post('http://localhost:9000/login', user)
    .then(res => {
      console.log(res);
      if(!(res.data)){

        this.props.history.push('/login');
      }
      else{

        axios.post('http://localhost:9000/getchat', user)
        .then(res => {
          console.log(res);
          if(res.data){
            this.setState({
              email: user.username,
              chats: res.data,
              friends: []
            });
    
          }
        })
      
      }
    })

  }

  render() {

    const { classes } = this.props;

    if(this.state.email) 
    {
      return(
        <div className='dashboard-container' id='dashboard-container'>

          <ChatListComponent history={this.props.history} 
            userEmail={this.state.email} 
            selectChatFn={this.selectChat} 
            chats={this.state.chats} 
            selectedChatIndex={this.state.selectedChat}
            newChatBtnFn={this.newChatBtnClicked}>
          </ChatListComponent>

          {
            this.state.newChatFormVisible ? null : <ChatViewComponent 
              user={this.state.email} 
              chat={this.state.chats[this.state.selectedChat]}>
            </ChatViewComponent>
          }

          { 
            this.state.selectedChat !== null && !this.state.newChatFormVisible ? <ChatTextBoxComponent userClickedInputFn={this.messageRead} submitMessageFn={this.submitMessage}></ChatTextBoxComponent> : null 
          }

          {
            this.state.newChatFormVisible ? <NewChatComponent currentuser={this.state.email}  goToChatFn={this.goToChat} newChatSubmitFn={this.newChatSubmit}></NewChatComponent> : null
          }
          <Button onClick={this.signOut} className={classes.signOutBtn}>Sign Out</Button>
        </div>
      );
    } 
    
    else {
      return(<div>LOADING....</div>);
    }
  }


}

export default withStyles(styles)(DashboardComponent);