import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import firebase, { auth, provider } from './firebase.js';
import Autocomplete from 'react-google-autocomplete';
//https://www.npmjs.com/package/react-google-autocomplete
//https://developers.google.com/maps/documentation/javascript/get-api-key

const Form = (props) =>{
	return(
		<section id="formSubmission">
			<form id="form_search" onSubmit={props.handleSubmit}>
			<div id="locationInput_holder">
				<Autocomplete
					id="locationInput"
					onPlaceSelected={props.handleAutofill}
					types={['(regions)']}
					name="location"
					value={props.location}
					onChange={props.handleChange}
				/>
			</div>
			<div id="keyInput_holder"><input id="keyInput" type="text" name="searchq" placeholder="Keyword" onChange={props.handleChange} value={props.searchq} /></div>
			<button>SEARCH</button>
			</form>
		</section>
	)
}

const AdditionalResult = (props) =>{
	return(
		<section id="formSubmission">
			<div id="formHint">
				{props.templocation != "" ?
					<span>Location: {props.templocation} </span> : null
				}
				{props.tempsearchq != "" ?
					<span>keyword: {props.tempsearchq}</span> : null
				}
			</div>
					<h3 id="pagination"> <span onClick={props.handlePrevious}><i className="fa fa-arrow-left" aria-hidden="true"></i></span> Total {props.counts} events | Page: {props.page}
					<span onClick={props.handleClick}> <i className="fa fa-arrow-right" aria-hidden="true"></i></span> </h3>
		</section>
	)
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
										<p>This site is an Eventbrite viewer with chatroom functionality for each event</p>
										<p>You can login to use chat room, and view your chat history for your events</p>
										<p>Type into either inputs to start search events!</p>
									</div>
									 : 
									<div>
										<h1 id="landingText">Welcome to EventChat</h1>
										<p>This site is an Eventbrite viewer with chatroom functionality for each event</p>
										<p>You can login to use chat room, and view your chat history for your events</p>
										<p>Type into either inputs to start search events!</p>
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
											{event.is_free ? <h5 className="fees">Free event</h5> : <h5>Fees may apply</h5>} 
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