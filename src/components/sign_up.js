import { Link } from 'react-router';
import { connect } from  'react-redux';
import React, { Component } from 'react';
import * as actions from '../actions/index';


class SignUp extends Component {

	constructor(props) {
		super(props);

		this.state = { 
			name: "",
			pwd: ""
		};

		this.onFormSubmit = this.onFormSubmit.bind(this);
	}
	

	onFormSubmit(event) {
		//this.props.search(this.state.term);
		this.setState({ 
			name: "", 
			pwd: ""
		});
	}

    render() {
	    return (
	    	<div id='signup'>
  				<h1>signin</h1>
  				<form name="signinForm" >
    				<input 
    					type='text'
    					placeholder="type your username"
		      			value={this.state.name}
		      			onChange={(event)=> this.setState({ name: event.target.value })}
		      		/>
    				<input 
    					type="password" 
    					placeholder="Type your password"
		      			value={this.state.pwd}
		      			onChange={(event)=> this.setState({ pwd: event.target.value })}
    				/>
    				<button onClick={this.onFormSubmit} type='submit' >signin</button>
 				 </form>
 				<Link to={'sign_in'}>
  				<a href="">Don't have an account? <strong>Signup</strong> ...</a>
  				</Link>
			</div>
	    );
    };
};


function mapStateToProps(state) {
	return {};
}

export default connect(mapStateToProps, actions)(SignUp);