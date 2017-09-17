import React from "react";
import firebase, { auth, provider } from './firebase.js';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class Header extends React.Component {
	constructor() {
		super();
		this.state = {
			uid:null
		};
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
	}

	componentDidMount(){
		auth.onAuthStateChanged((user) => {
			if (user) {
				// console.log(user);
				this.setState({ uid: user});
				this.props.updateUser(user, true);
			}
		});
	}
	logout() {
		auth.signOut().then(() => {
			this.setState({
				uid: null
			});
			this.props.updateUser("", false);
		});
	}
	login() {
		auth.signInWithPopup(provider).then((result) => {
			const user = result.user;
			this.setState({
				uid: user
			});
		});
	}
	render() { //<p>{this.state.uid.displayName}</p>
		return (
			<nav>
				<div className="wrapper">
					<h1 id="logo"><Link to="/">EventChat<i className="fa fa-commenting" aria-hidden="true"></i></Link></h1>
					{this.state.uid ? 
						<section id="usersection">
							<Link to="/"><button id="homebtn">Home</button></Link>
							<Link to="/history/"><button id="historybtn">History</button></Link>
							<Link to="/"><button id="logoutbtn" onClick={this.logout}>Log Out</button></Link>
							<div className="profile_holder">
								<div className="selfImg_holder">
									<img src={this.state.uid.photoURL} alt=""/>
								</div>
							</div>
						</section>
						:
						<section id="usersection">
							<button id="loginbtn" onClick={this.login}>Login with <i className="fa fa-google" aria-hidden="true"></i>oogle</button>
						</section>
					}
				</div>
			</nav>
		)
	}
}

export default Header;