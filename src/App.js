import axios from "axios";
import { Button, Jumbotron } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import "./App.css";
require("dotenv").config();

function App() {
	const [details, setDetails] = useState({});
	const [place, setPlace] = useState("");
	const [api, setApi] = useState(`${process.env.REACT_APP_API_KEY}`);
	const [validated, setValidated] = useState(false);
	const [error, setError] = useState(false);
	const [lat, setLat] = useState("");
	const [lon, setLong] = useState("");
	const [locationError, setLocationError] = useState(false);

	const fetchWeather = () => {
		axios
			.get(
				`http://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${api}`
			)
			.then(function (response) {
				// handle success
				setDetails(response.data.main);
				console.log(response.data);
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
	const detectLocation = async (event) => {
		event.preventDefault();
		if (lat === "" || lon === "") {
			setLocationError(true);
		} else {
			await axios
				.get(
					`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api}`
				)
				.then(function (response) {
					setDetails(response.data.main);
					console.log(response.data);
					setValidated(true);
				})
				.catch(function (error) {
					alert(error);
					setValidated(false);
				});
		}
	};
	useEffect(() => {
		async function fetchCoordinates() {
			await navigator.geolocation.getCurrentPosition(function (position) {
				setLat(position.coords.latitude);
				setLong(position.coords.longitude);
			});
		}
		fetchCoordinates();
		console.log("Latitude is:", lat);
		console.log("Longitude is:", lon);
	}, []);
	if (place !== "" && validated && typeof details.temp === "undefined") {
		return (
			<Container>
				<div class="text-center">
					<div class="spinner-border" role="status">
						<span class="sr-only">Loading...</span>
					</div>
				</div>
			</Container>
		);
	} else if (place !== "" && validated && typeof details.temp !== "undefined") {
		return (
			<Container>
				<Jumbotron className="mt-3">
					<h1 style={{ textAlign: "center" }}>
						Temperature of {place} is: {details?.temp} K
					</h1>
					<div>
						<div className="alert alert-warning">
							Max Temperature: {details?.temp_max} K
						</div>
						<div className="alert alert-info">
							Min Temperature: {details?.temp_min} K
						</div>
					</div>
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
					{(lat === "" || lon === "") && locationError && (
						<div className="alert alert-danger alert-dismisable fade show mt-4">
							Sorry, couldnot fetch your Location coordinates!
							<button
								type="button"
								class="close"
								data-dismiss="alert"
								aria-label="Close"
								onClick={() => {
									setLocationError(false);
								}}
							>
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
					)}
					<Form className="card p-4 mt-3" onSubmit={handleSubmit}>
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
					<div className="d-flex" style={{ marginTop: "30px" }}>
						<button
							className="btn m-auto w-50 btn-danger"
							onClick={detectLocation}
							type="submit"
						>
							Auto-detect the Location!
						</button>
					</div>

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
