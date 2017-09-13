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
					<Autocomplete //Credit: Anson :) 
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
				<div>
					{this.props.templocation != "" ?
						<span>Location: {this.props.templocation} </span> : null
					}
					{this.props.tempsearchq != "" ?
						<span>keyword: {this.props.tempsearchq}</span> : null
					}
				</div>
				<h1>Total {this.props.counts} events, 
					 <span onClick={this.props.handlePrevious}><i className="fa fa-arrow-left" aria-hidden="true"></i></span> 
					 PAGE: {this.props.page} 
					 <span onClick={this.props.handleClick}><i className="fa fa-arrow-right" aria-hidden="true"></i></span> 
				</h1> 
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
									<h2>Greetings! {this.props.state.sth}</h2> : null 
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
										<h2>{event.name.text}</h2>
										<img src={`${event.logo.url}`} alt=""/>
										<h5>Start: {event.start.local}</h5>
										<h5>End: {event.end.local}</h5>
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