import React from "react";
import { ajax } from 'jquery';
import firebase, { auth, provider } from './firebase.js';
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
const dbRefChat = firebase.database().ref('/chatRoom');
const dbRefUser = firebase.database().ref('/userHistory');
/* userHistory
		|____Uid *
			|____event_id *
				  |____link: "event_link" 
				  |____logo: "logo_link"
				  |____start: "start_time"
				  |____end: "end_time"
				  |____tile: "title text"
*/
const token = "LWQIB5TOS27NYBUFO4VW";

class ChatForm extends React.Component {
	render(){
		return(
			<section id="chatSubmission">
				<form id="msgSubmit" onSubmit={this.props.handleSubmit}>
				<input type="text" name="msg" placeholder="Message" onChange={this.props.handleChange} value={this.props.searchq} required/>
				<button>SEND</button>
				</form>
			</section>
		)
	}
}

class EventDetailChat extends React.Component {
	constructor() {
		super();
		this.state = {
			msgs:[], msgIDs:[], event:null, address:"",
			valid: true, time:"",username:"",uid:null, msg:""
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	componentDidMount(){
		//event detail
		ajax({
			url: `https://www.eventbriteapi.com/v3/events/${this.props.match.params.event_id}/?token=${token}`,
			dataType: "json"
		}).then((data) => {
			const infoHolder = [];
			infoHolder.push(data);
			// console.log(infoHolder);
			this.setState({
				event:infoHolder
			})
		}).fail(() => {
			this.setState({
				valid: false
			})
		});
		//location
		ajax({
			url: `https://www.eventbriteapi.com/v3/venues/${this.props.match.params.venue_id}/?token=${token}`,
			dataType: "json"
		}).then((data) => {
			// console.log(data)
			this.setState({
				address: data.address.localized_address_display
			})
		}).fail(() => {
			this.setState({
				valid: false
			})
		});
		//checking user
		auth.onAuthStateChanged((user) => {
			if (user) {
				this.setState({ uid: user});
				//cloning message from firebase
				const foo = firebase.database().ref(`/chatRoom/${this.props.match.params.event_id}`);
				foo.on("value", (snapshot) => {
					const newMsgArray = [];
					const newMsgIDsArray = [];
					const firebaseItems = snapshot.val();
					//const key = snapshot.child.key;
					for (let key in firebaseItems){
						const chatObj = firebaseItems[key];
						const element = {};
						element[`${key}`] = chatObj;
						newMsgArray.push(element);
						newMsgIDsArray.push(key);
					}
					// console.log(newMsgIDsArray);
					// console.log(newMsgArray);
					this.setState({
						msgs: newMsgArray,
						msgIDs: newMsgIDsArray
					})
				})//end of snapshot
			}//end of if 
		});
	}
	//handle message
	handleSubmit(event) {
		event.preventDefault();
		const form = document.getElementById("msgSubmit");
		form.reset();
		const roomID = this.props.match.params.event_id;
		const newMessage = { 
			name: this.state.uid.displayName || this.state.uid.email,
			uid: this.state.uid.uid,
			msg: this.state.msg,
			photo: this.state.uid.photoURL,
			time: Date(Date.now()).toString().slice(4,24).replace(/\s/g,'-') 
			// + Date(Date.now()).toString().substr(34)
		};
		let foo = firebase.database().ref(`/chatRoom/${roomID}`).push(newMessage)
		// console.log(foo.getKey());
		// update count to fireabse
		let count = 1;
		dbRefChat.once("value", (snapshot) => { //note! on will causing infinite loop
			const chatRoomSnapshot = snapshot.val();  //chatRoom snapshot
			// console.log(chatRoomSnapshot[roomID].count)
			if(!chatRoomSnapshot[roomID].hasOwnProperty("count")) {
				dbRefChat.child(`${roomID}`).update({
					"count": count
				})
			} else {
				count = chatRoomSnapshot[roomID].count + 1;
				dbRefChat.child(`${roomID}`).update({
					"count": count
				})
			}
		})
		// setting user, this overwrites the rooomID
		dbRefUser.child(this.state.uid.uid).child(roomID).set({
			"link": "/" + this.props.match.params.event_id + "/" + this.props.match.params.venue_id,
			"logourl": this.state.event[0].logo.url,
			"title": this.state.event[0].name.text,
			"start": this.state.event[0].start.local,
			"end": this.state.event[0].end.local
		});
	}
	handleChange(event) {
		this.setState({//every keypress will render
			[event.target.name]: event.target.value,
		});
	}
	render() {
		var messageID = this.state.msgIDs;
		return (
			<div>
				{this.state.event && this.state.valid ? <h3 id="eventNameChat">{this.state.event[0].name.text}</h3> 
					: 
					<h1>404 event page not found</h1>
				}
				{this.state.event && this.state.valid && this.state.event[0].logo ? 
					<img src={this.state.event[0].logo.url} alt="" />
					: 	null
				}
				{this.state.event && this.state.valid ? 
					<section>
						<div id="descriptionHtml" dangerouslySetInnerHTML={{__html: this.state.event[0].description.html}}></div>
						<a href={this.state.event[0].url}><h4>Click me to the Eventbrite Page</h4></a>
						<p id="locationChat">Location:</p>
						<div>{this.state.address}</div>
					</section>
					: null
				}
				{this.state.uid && this.state.valid ? <section id="messageBox">
					<h2>Chat with people about this event!</h2>
					<ul id="chatcontainer">
						{this.state.msgs.map((msgholder, i)  => {
							return (
								<li key={messageID[i]}>
									{this.state.msgIDs[i] !== "count" ?
									<div className="chat_content">
										{this.state.uid.uid === msgholder[messageID[i]]["uid"] ?
											<div className="self">
												<div className="boo">
													<p>{msgholder[messageID[i]]["time"]}</p>
													<div className="selfImg_holder">
														<img src={`${msgholder[messageID[i]]["photo"]}`} alt=""/>
													</div>
												</div>
											</div>
											:
											<div className="other">
												<p><span>{msgholder[messageID[i]]["name"]}</span>, <span>{msgholder[messageID[i]]["time"]}</span></p>
												<div className="otherImg_holder">
													<img src={`${msgholder[messageID[i]]["photo"]}`} alt=""/>
												</div>
											</div>
										}
										<div className="actualmsg_holder"><p className="actualmsg">{msgholder[messageID[i]]["msg"]}</p></div>
									</div> : null}
								</li>
							)
						})}
					</ul>
					<ChatForm 
						handleChange={this.handleChange} 
						handleSubmit={this.handleSubmit}
						username={this.state.username}
					/>
				</section> : <p>You must login and in valid event to use the chat room</p>}
			</div>
		)
	}
}
/*helper func, convert current time to Month-hours-minites*/
// const timenow = function(){
// 	let d = new Date();
// 	return (d.getMonth() + "-"+ d.getDate() + ", "+ d.getHours() +":"+ d.getMinutes())
// }
export default EventDetailChat;