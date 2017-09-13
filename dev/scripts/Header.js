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
					<h1 id="logo"><Link to="/">Eventbrite Chatter</Link></h1>
					{this.state.uid ? 
						<section id="usersection">
							<Link to="/">Home</Link>
							<Link to="/history/">History</Link>
							<Link to="/"><button onClick={this.logout}>Log Out</button></Link>
							<div className="profile_holder">
								<div className="selfImg_holder">
									<img src={this.state.uid.photoURL} alt=""/>
								</div>
							</div>
						</section>
						:
						<section id="usersection">
							<button onClick={this.login}>Log In</button>
						</section>
					}
				</div>
			</nav>
		)
	}
}

export default Header;