import React from "react";
import firebase, { auth, provider } from './firebase.js';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
/* chatRoom
		|____event_id *
			|____pushID *
				  |____msg: "hello world!"
				  |____name: "username"
				  |____time: "local time"
				  |____uid: "user id from auth"
				  |____photo: "photo url"
			|____count: # of pushIDs
*/
/* userHistory
		|____Uid *
			|____event_id *
				  |____link: "event_link" 
				  |____logo: "logo_link"
				  |____start: "start_time"
				  |____end: "end_time"
				  |____tile: "title text"
*/
class History extends React.Component {
	constructor() {
		super();
		this.state = {
			history:[], msgcount:[]
		};
	}
	componentDidMount(){
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				//console.log(user.uid);
				const foo = firebase.database().ref(`/userHistory/${user.uid}`);
				const bar = firebase.database().ref(`/chatRoom/`);
				//retriving value from userhistory and chatRoom
				foo.on("value", (snapshot) => {
					const firebaseItems = snapshot.val(); //user snapshot
					const newHistory = []; //for setstate
					const newMsgcountHolder = []; //for setstate
					bar.on("value", (snapshot) => {
						const chatRoomSnapshot = snapshot.val();  //chatRoom snapshot
						const newMsgcount = {};
						for (let items in firebaseItems){
							//console.log(items)
							newMsgcount[items] = chatRoomSnapshot[items].count; // retrive count
							firebaseItems[items].eventid = items;//adding temp id state
							newHistory.push(firebaseItems[items])
						}
						newMsgcountHolder.push(newMsgcount)
						this.setState({
							history: newHistory,
							msgcount: newMsgcountHolder
						})
					})//end of chat snapshot
				})//end of user snapshot 
			}//end of if user
		});
	}
	render() {
		//console.log(this.state.history)
		return (
			<div>
				<p>When login, your chatted event will appear here</p>
				{this.state.history.map((event) => {
					return (
						<Link to={event.link} key={event.link}>
							<div className="resultCard" id={event.venue_id}>
								<h2>{event.title}</h2>
								<img src={`${event.logourl}`} alt=""/>
								<h5>Start: {event.start}</h5>
								<h5>End: {event.end}</h5>
								<h5>Total Message: {this.state.msgcount[0][event.eventid]}</h5>
							</div>
						</Link>
					)
				})}
			</div>
		)
	}
}

export default History;