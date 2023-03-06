const API_KEY = "c4fb509b36ffc813598ce8e572322cd6";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
	id: number;
	backdrop_path: string;
	poster_path: string;
	title: string;
	overview: string;
	vote_average: number;
	vote_count: number;
}

export interface IGetMoviesResult {
	dates: {
		maximum: string;
		minimum: string;
	};
	page: number;
	results: IMovie[];
	total_pages: number;
	total_results: number;
}

export interface ITV {
	id: number;
	backdrop_path: string;
	poster_path: string;
	name: string;
	overview: string;
	vote_average: number;
	vote_count: number;
}

export interface IGetTVsResult {
	page: number;
	results: ITV[];
	total_pages: number;
	total_results: number;
}

export function getNowPlayingMovies() {
	return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
		(response) => response.json()
	);
}

export function getLatestMovies() {
	return fetch(`${BASE_PATH}/movie/latest?api_key=${API_KEY}`).then(
		(response) => response.json()
	);
}

export function getPopularMovies() {
	return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(
		(response) => response.json()
	);
}

export function getTopRatedMovies() {
	return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
		(response) => response.json()
	);
}

export function getUpcommingMovies() {
	return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
		(response) => response.json()
	);
}

export function getLatestTVs() {
	return fetch(`${BASE_PATH}/tv/latest?api_key=${API_KEY}`).then((response) =>
		response.json()
	);
}

export function getAiringTodayTVs() {
	return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
		(response) => response.json()
	);
}
export function getOnTheAirTVs() {
	return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(
		(response) => response.json()
	);
}

export function getTopRatedTVs() {
	return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
		(response) => response.json()
	);
}

export function getPopularTVs() {
	return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((response) =>
		response.json()
	);
}

export function searchMovies(query: string) {
	return fetch(
		`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${query}`
	).then((response) => response.json());
}

export function searchTVs(query: string) {
	return fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${query}`).then(
		(response) => response.json()
	);
}
