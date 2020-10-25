import React from 'react';
import { Switch, BrowserRouter as Router,Route } from "react-router-dom";
import { connect } from "react-redux";

// Import Routes all
import { userRoutes , authRoutes } from "./routes/allRoutes";

// Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware";
import http from "./http-common";
// import axios from 'axios';


// layouts Format
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";

// Import scss
import "./assets/scss/theme.scss";





const App = (props) => {

	if (window.localStorage.getItem('authUser')) {

	var accountID = JSON.parse(window.localStorage.getItem('authUser'))
	
	
	http.get(`/users/finduserbyid/${accountID}`)
	.then(res =>{
		setupTime(res.data)
	})

	.catch(error =>{
		window.location.replace('/')
	});
}

const setupTime=(r)=>{
	var account = r;
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	today = dd + '/' + mm + '/' + yyyy;

	http.post(`/users/lastlogindate/${accountID}`, {today})
	.then(res =>{})
	.catch(error =>{console.log(error);});

	var time = new Date().toLocaleTimeString()
	http.post(`/users/lastlogintime/${accountID}`, {time})
	.then(res =>{})
	.catch(error =>{console.log(error);});

	if (account.rememberAccount == false) {
		var hours = 4; // Reset when storage is more than 3.5 hours
		var now = Date.now();
		var getTime = window.localStorage.getItem('setupTime')
		if (getTime == null) {
			window.localStorage.setItem('setupTime', now)}
		else if (now - hours*60*60*1000 > getTime) {
			window.localStorage.clear()
			window.location.replace('/')
		}
		else{
			window.localStorage.setItem('setupTime', now)}
	}
}
	



   function getLayout() {
		let layoutCls = VerticalLayout;

		switch (props.layout.layoutType) {
			case "horizontal":
				layoutCls = HorizontalLayout;
				break;
			default:
				layoutCls = VerticalLayout;
				break;
		}
		return layoutCls;
	};

		const Layout = getLayout();

			const NonAuthmiddleware = ({
				component: Component,
				layout: Layout
			}) => (
					<Route
						render={props => {
						return (
					     	   <Layout>
									<Component {...props} />
								</Layout>
							);
						}}
					/>
				);

		  return (
		  		<React.Fragment>
				<Router>
					<Switch>
						{authRoutes.map((route, idx) => (
							<NonAuthmiddleware
								path={route.path}
								layout={NonAuthLayout}
								component={route.component}
								key={idx}
							/>
						))}

						{userRoutes.map((route, idx) => (
							<Authmiddleware
								path={route.path}
								layout={Layout}
								component={route.component}
								key={idx}
							/>
						))}

					</Switch>
				</Router>
			</React.Fragment>
		
		  );
		}


const mapStateToProps = state => {
	return {
		layout: state.Layout
	};
};

export default connect(mapStateToProps, null)(App);
