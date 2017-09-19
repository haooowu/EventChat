import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { ajax } from 'jquery';
import $ from "jquery"
import EventDetailChat from "./Chatroom.js";
import Header from "./Header.js";
import History from "./Userhistory.js";
import EventGenerator from "./Formgenerator.js";
/*
Strech goal in future: 
-user can delete their own chats (thus message count has to -1 too), also upload image to chat using storage 
-grab lat and long from venue ajax call and ust it to implement map
-enable all searching features from eventbrite api (location within, sort, price)
*/
const token = "LWQIB5TOS27NYBUFO4VW";

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			events: [], counts: 0, location: "", //required
			searchq: "", within:"", price:"", //optional (strech goal)
			page:1, totalpage:1, sort:"best",//default
			showResults: false, showEvent: true, //flags for ternary 
			tempsearchq: "", templocation:"", //temp value before reset form
			sth: null // usr name retrive from header by updateUser method()
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handlePrevious = this.handlePrevious.bind(this);
		this.updateUser = this.updateUser.bind(this);
		this.handleAutofill = this.handleAutofill.bind(this);
	}
	updateUser(user, flag){ //pass to Eventgenerator
		if (flag){ //flag to check auth status from header
			//console.log(user.displayName)
			this.setState({
				sth: user.displayName
			});
		} else {
			this.setState({
				sth: null
			});
		}
	}

	handleChange(input){ //name property on form
		input.preventDefault();
		this.setState({
			[input.target.name]: input.target.value,
		});
	}
	handleAutofill(address){ //handle data from autocomplete package
		if (address.formatted_address != undefined){
			//console.log(address.formatted_address)
			this.setState({
				"location":address.formatted_address
			});
		}
	}

	handlePrevious(){
		this.setState({
			showEvent: false 
		});
		if (this.state.page > 1) {
			ajax({
				url: `https://www.eventbriteapi.com/v3/events/search/?token=${token}`,
				data: {
					q: this.state.tempsearchq, //keyword requrire either q or location to search
					"location.address": this.state.templocation, //evenbrite search city/country/region
					sort_by: this.state.sort,   //"date", "distance" and "best" , - to reverse
					"page": this.state.page - 1 //query next, default 50 from pagination
				},
				dataType: "json"
			}).then((data) => {
				//console.log(data)
				data.events.map((event) =>{
					//if (!event.hasOwnProperty("logo")) {
					if (event.logo === null) {
						event.logo = {}
						event.logo.url = "https://unsplash.it/440/240/?random";
					}
				})
				this.setState({
					events:data.events,
					page: this.state.page - 1,
					counts:data.pagination.object_count,
					showResults: true, showEvent: true// display adiitional info
				})
			})//end of ajax
		} else {
			this.setState({
				showEvent: true
			});
			alert("Sorry, this is the first page")
		}
	}
	handleClick(){
		this.setState({
			showEvent: false 
		});
		if (this.state.page < this.state.totalpage) {
			ajax({
				url: `https://www.eventbriteapi.com/v3/events/search/?token=${token}`,
				data: {
					q: this.state.tempsearchq, //keyword requrire either q or location to search
					"location.address": this.state.templocation, //evenbrite search city/country/region
					sort_by: this.state.sort,   //"date", "distance" and "best" , - to reverse
					"page": this.state.page + 1 //query next, default 50 from pagination
				},
				dataType: "json"
			}).then((data) => {
				//console.log(data)
				data.events.map((event) =>{
					//if (!event.hasOwnProperty("logo")) {
					if (event.logo === null) {
						event.logo = {}
						event.logo.url = "https://unsplash.it/500/200";
					}
				})
				this.setState({
					events:data.events,
					page: this.state.page + 1,
					counts:data.pagination.object_count,
					showResults: true, showEvent: true// display adiitional info
				})
			})//end of ajax
		} else {
			this.setState({
				showEvent: true
			});
			alert("Sorry, this is the last page")
		}//end of pagination check
	}

	handleSubmit(event) {
		event.preventDefault();
		$("footer").remove();
		const form = document.getElementById("locationInput");
		//console.log(form.value);
		this.setState({
			showEvent: false,
			tempsearchq: this.state.searchq,
			templocation: form.value,
			page: 1
		})
		ajax({ //ajax to call search
			url: `https://www.eventbriteapi.com/v3/events/search/?token=${token}`,
			data: {
				q: this.state.searchq, //keyword requrire either q or location to search
				"location.address": form.value, //evenbrite search city/country/region
				sort_by: this.state.sort,   //"date", "distance" and "best" , - to reverse
				"location.within":"", //recommand up to 150km
				"price":"", //deafult all, or either "paid" or "free"
				"page": this.state.page //query next, default 50 from pagination
			},
			dataType: "json"
		}).then((data) => {
			//console.log(data)
			data.events.map((event) =>{
				//if (!event.hasOwnProperty("logo")) {
				if (event.logo === null) {
					event.logo = {}
					event.logo.url = "https://unsplash.it/500/200";
				}
			})
			this.setState({
				searchq: "",
				location: "", 
				totalpage: data.pagination.page_count,
				events:data.events,
				counts:data.pagination.object_count,
				showResults: true, showEvent: true// display adiitional info
			})// for (let i=0; i<50; i++){
		}).fail(() => {
			this.setState({ // Re: Clear
				events: [], counts: 0, 
				searchq: "", location: "",
				showResults: false, showEvent: true, 
				tempsearchq: "", templocation:""
			})
			alert("Sorry, there is no event for this");
		});// console.log(i + ":"+ this.state.events[i].logo)
	}
    render() {
        return (<Router>
	        <div>
		        <Header updateUser={this.updateUser} />
	        	<section id="maincontent_holder">
	        		<div id="maincontent" className="wrapper">
	        		<Route exact path="/" render={()=>(
	                	<EventGenerator
	                		handleChange={this.handleChange}
	                		handleSubmit={this.handleSubmit}
	                		handleClick={this.handleClick}
	                		handleAutofill={this.handleAutofill}
	                		handlePrevious={this.handlePrevious}
	                		state={this.state}
	                		/>
	        			)} />
	                <Route exact path="/:event_id/:venue_id" component={EventDetailChat}/>
	                <Route exact path="/history" component={History}/>
	                </div>
	        	</section>
				<footer>HEY</footer>
	        </div>
	    </Router>)
    }
}

ReactDOM.render(<App />, document.getElementById('app'));