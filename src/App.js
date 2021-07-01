import axios from "axios";
import { Button, Jumbotron } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import "./App.css";
require("dotenv").config();

function App() {
	const [temp, setTemp] = useState([]);
	const [place, setPlace] = useState("");
	const [api, setApi] = useState(`${process.env.REACT_APP_API_KEY}`);
	const [validated, setValidated] = useState(false);
	const [error, setError] = useState(false);
	
	const fetchWeather = () => {
		axios
			.get(
				`http://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${api}`
			)
			.then(function (response) {
				// handle success
				setTemp(response.data.main.temp);
				console.log(response.data);
				console.log(process.env)
			})
			.catch(function (error) {
				// handle error
				alert(error);
				setValidated(false);
			});
	};
	const handleSubmit = (event) => {
		event.preventDefault();

		if (place !== "") {
			fetchWeather();
			setValidated(true);
		} else {
			setError(true);
		}
	};
	if (place !== "" && validated) {
		return (
			<Container>
				<Jumbotron>
					<h1 style={{ textAlign: "center" }}>
						Temperature of {place} is: {temp} K
					</h1>
					<Form className="m-auto w-50">
						<Button
							className="btn-warning btn"
							onClick={() => {
								setValidated(false);
							}}
						>
							Find for another place
						</Button>
					</Form>
				</Jumbotron>
			</Container>
		);
	} else {
		return (
			<div className="App">
				<Container>
					<Form className="card p-4" onSubmit={handleSubmit}>
						<Form.Group>
							<Form.Label>Enter the city</Form.Label>
							<Form.Control
								type="text"
								required
								onChange={(event) => {
									setPlace(event.target.value);
								}}
								placeholder="ex: london"
							/>
							<Form.Text className="text-muted">
								This is not case sensititve.
							</Form.Text>
						</Form.Group>
						<Button className="m-auto w-50" type="submit" variant="success">
							get me the weather!
						</Button>
					</Form>
					<footer className="footer mt-auto py-3">
						<div className="container">
							<span className="text-muted">Built by Ujjwal</span>
						</div>
					</footer>
				</Container>
			</div>
		);
	}
}

export default App;
