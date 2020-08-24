import { Link } from 'react-router-dom';
import React from 'react';
import axios from 'axios';


import styles from './style';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


class Login extends React.Component {

  constructor() {
    super();
    this.state = {
      email: null,
      password: null,
      serverError: false
    };
  }


  userTyping = (whichInput, event) => {
    switch (whichInput) {
      case 'email':
        this.setState({ email: event.target.value });
        break;

      case 'password':
        this.setState({ password: event.target.value });
        break;

      default:
        break;
    }
  }

  submitLogin = async (e) => {
    e.preventDefault(); // This is to prevent the automatic refreshing of the page on submit.

    const user = {
      username:this.state.email,
      password:this.state.password
    }

    axios.post('http://localhost:9000/login', user)
    .then(res => {
      console.log(res);
      if(res.data){

        localStorage.setItem("username",res.data.username);
        localStorage.setItem("password",res.data.password);
        this.props.history.push('/dashboard');
      }
      else{
        this.setState({ serverError: true });
      }
    })

  };

  render() {

    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseline/>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Log In!
          </Typography>
          <form onSubmit={(e) => this.submitLogin(e)} className={classes.form}>
            <FormControl required fullWidth margin='normal'>
              <InputLabel htmlFor='login-email-input'>Enter Your Email</InputLabel>
              <Input autoComplete='email' autoFocus onChange={(e) => this.userTyping('email', e)} id='login-email-input'></Input>
            </FormControl>
            <FormControl required fullWidth margin='normal'>
              <InputLabel htmlFor='login-password-input'>Enter Your Password</InputLabel>
              <Input autoComplete="current-password" type="password" onChange={(e) => this.userTyping('password', e)} id='login-password-input'></Input>
            </FormControl>
            <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>Log In</Button>
          </form>
          { this.state.serverError ? 
            <Typography className={classes.errorText} component='h5' variant='h6'>
              Incorrect Login Information
            </Typography> :
            null
          }
          <h5 className={classes.noAccountHeader}>Don't Have An Account?</h5>
          <Link className={classes.signUpLink} to='/signup'>Sign Up!</Link>
        </Paper>
      </main>
    );
  }


}

export default withStyles(styles)(Login);