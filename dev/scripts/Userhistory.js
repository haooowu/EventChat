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
			history:[], msgcount:[], uid:""
		};
	}
	handleDelete(id){
		if (confirm("Removed this event showing from history?")){
			firebase.database().ref(`/userHistory/${this.state.uid}/${id}`).remove();
		} else {
			//nothing
		};
	}
	//warning.js:35 Warning: setState(...): Can only update a mounted or mounting component. This usually means you called setState() on an unmounted component. This is a no-op. Please check the code for the EventDetailChat component.
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
							msgcount: newMsgcountHolder,
							uid: user.uid
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
				<p id="attension">When login, your chatted event will appear here</p>
				{this.state.history.map((event) => {
					return (
						<Link to={event.link} key={event.link}>
							<div className="resultCard" id={event.venue_id}>
								<div className="eventlogo_holder">
									<img src={`${event.logourl}`} alt=""/>
								</div>
								<div className="titledate_holder bar">
									<button onClick={(e) => {this.handleDelete(event.link.match(/\/(.*?)\//)[1]);e.preventDefault()}} 
										className="removehistory">
										<i className="fa fa-trash-o" aria-hidden="true"></i>
									</button>
									<h5>Total Message: <span id="msgCount"> {this.state.msgcount[0][event.eventid]}</span></h5>
									<h2>{event.title}</h2>
									<div>
										<h5>Start: {event.start}</h5>
										<h5>End: {event.end}</h5>
									</div>
								</div>
							</div>
						</Link>
					)
				})}
			</div>
		)
	}
}

export default History;