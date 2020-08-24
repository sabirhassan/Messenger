import React from 'react';
import { FormControl, InputLabel, Input, Button, Paper, withStyles, CssBaseline, Typography } from '@material-ui/core';
import styles from './style';
import axios from 'axios'

class NewChatComponent extends React.Component {

  constructor() {
    super();
    this.state = {
      username: null,
      message: null
    };
  }



  componentWillMount() {
    /*
    if(!firebase.auth().currentUser)
      this.props.history.push('/login');
    */
  }

  userTyping = (inputType, e) => {
    switch (inputType) {
      case 'username':
        this.setState({ username: e.target.value });
        break;
      
      case 'message':
        this.setState({ message: e.target.value });
        break;

      default:
        break;
    }
  }

  submitNewChat = async (e) => {
    e.preventDefault();
    axios.post('http://localhost:9000/checkuser', {username:this.state.username})
    .then(res => {
      console.log(res);
      if(res.data){
        const docKey = this.buildDocKey();
    
        axios.post('http://localhost:9000/checkchat', {id:docKey})
        .then(res => {
          console.log(res);
          if(res.data){
            this.goToChat()
          }
          else{
            this.createChat()
          }
        })


      }
    })
  }

  buildDocKey = () => [this.props.currentuser, this.state.username].sort().join(':');

  createChat = () => {
    this.props.newChatSubmitFn({
      sendTo: this.state.username,
      message: this.state.message
    });
  }

  goToChat = () => this.props.goToChatFn(this.buildDocKey(), this.state.message);

  chatExists = () => {
    const docKey = this.buildDocKey();
    
    axios.post('http://localhost:9000/checkchat', {id:docKey})
    .then(res => {
      console.log(res);
      if(res.data){
        return true
      }
      else{
        return false
      }
    })


  }

  userExists =  () => {

    axios.post('http://localhost:9000/checkuser', {username:this.state.username})
    .then(res => {
      console.log(res);
      if(res.data){
        return true
      }
      else{
        return false
      }
    })
  }

  render() {

    const { classes } = this.props;

    return(
      <main className={classes.main}>
        <CssBaseline/>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">Send A Message!</Typography>
          <form className={classes.form} onSubmit={(e) => this.submitNewChat(e)}>
            <FormControl fullWidth>
              <InputLabel htmlFor='new-chat-username'>
                  Enter Your Friend's Email
              </InputLabel>
              <Input required 
                className={classes.input}
                autoFocus 
                onChange={(e) => this.userTyping('username', e)} 
                id='new-chat-username'>
              </Input>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor='new-chat-message'>
                  Enter Your Message
              </InputLabel>
              <Input required 
                className={classes.input}
                onChange={(e) => this.userTyping('message', e)} 
                id='new-chat-message'>
              </Input>
            </FormControl>
            <Button fullWidth variant='contained' color='primary' className={classes.submit} type='submit'>Send</Button>
          </form>
          {
            this.state.serverError ? 
            <Typography component='h5' variant='h6' className={classes.errorText}>
              Unable to locate the user
            </Typography> :
            null
          }
        </Paper>
      </main>
    );
  }

}

export default withStyles(styles)(NewChatComponent);