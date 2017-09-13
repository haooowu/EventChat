import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import firebase, { auth, provider } from './firebase.js';
import Autocomplete from 'react-google-autocomplete';
//https://www.npmjs.com/package/react-google-autocomplete
//https://developers.google.com/maps/documentation/javascript/get-api-key

class Form extends React.Component{
	render(){
		return(
			<section id="formSubmission">
				<form id="form_search" onSubmit={this.props.handleSubmit}>
				<div id="locationInput_holder">
					<Autocomplete
						id="locationInput"
						onPlaceSelected={this.props.handleAutofill}
						types={['(regions)']}
						name="location"
						value={this.props.location}
						onChange={this.props.handleChange}
					/>
				</div>
				<div id="keyInput_holder"><input id="keyInput" type="text" name="searchq" placeholder="Keyword" onChange={this.props.handleChange} value={this.props.searchq} /></div>
				<button>SEARCH</button>
				</form>
			</section>
		)
	}
}

class AdditionalResult extends React.Component{
	render(){
		return(
			<section id="formSubmission">
				<div id="formHint">
					{this.props.templocation != "" ?
						<span>Location: {this.props.templocation} </span> : null
					}
					{this.props.tempsearchq != "" ?
						<span>keyword: {this.props.tempsearchq}</span> : null
					}
				</div>
					 <h3 id="pagination"> <span onClick={this.props.handlePrevious}><i className="fa fa-arrow-left" aria-hidden="true"></i></span> Total {this.props.counts} events | Page: {this.props.page}
					 <span onClick={this.props.handleClick}> <i className="fa fa-arrow-right" aria-hidden="true"></i></span> </h3>
			</section>
		)
	}
}

class EventGenerator extends React.Component {
	render() { //<h5>{event.description.text}</h5>
		return (
			<div>
				<Form 
					handleChange={this.props.handleChange} 
					handleSubmit={this.props.handleSubmit}
					handleAutofill={this.props.handleAutofill}
				/>
				<section id="displayResults">
					<div id="additional_info">
						{this.props.state.showResults ? 
							<AdditionalResult 
								counts={this.props.state.counts}
								page={this.props.state.page}
								handleClick={this.props.handleClick}
								handlePrevious={this.props.handlePrevious}
								templocation = {this.props.state.templocation}
								tempsearchq = {this.props.state.tempsearchq}
							/> : 
							<div>
								{this.props.state.sth ?
									<div>
										<h3 id="greet">Greetings! {this.props.state.sth}</h3>
										<h1 id="landingText">Welcome to EventChat</h1>
										<h3>This site is an Eventbrite viewer with chatroom functionality for each event</h3>
										<h3>Type into either inputs to start search events!</h3>
										<h3>You can login to use chat room, and view your chat history for every event</h3>
									</div>
									 : 
									<div>
										<h1 id="landingText">Welcome to EventChat</h1>
										<h3>This site is an Eventbrite viewer with chatroom functionality for each event</h3>
										<h3>Type into either inputs to start search events!</h3>
										<h3>You can login to use chat room, and view your chat history for every event</h3>
									</div>
								}
							</div>
							}
					</div>
					{this.props.state.showEvent ? 
						<div>
						{this.props.state.events.map((event) => {
							return (
								<Link to={`/${event.id}/${event.venue_id}`} key={event.id}>
									<div className="resultCard" id={event.venue_id}>
										<div className="eventlogo_holder">
											<img src={`${event.logo.url}`} alt=""/>
										</div>
										<div className="titledate_holder">
											<h5>Start: {event.start.local.replace(/T/g , " ")}</h5>
											<h3 className = "title">{event.name.text}</h3>
											<h5>End: {event.end.local.replace(/T/g , " ")}</h5>
										</div>
									</div>
								</Link>
							)
						})}
						</div> 
					: <div id="loading_holder"><div id="loader"></div></div>}
				</section>
			</div>
		)//end of return
	}//end of render
}

export default EventGenerator;