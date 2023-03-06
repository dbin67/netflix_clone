import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import {
	getLatestMovies,
	getNowPlayingMovies,
	getPopularMovies,
	getTopRatedMovies,
	getUpcommingMovies,
	IGetMoviesResult,
	IMovie,
} from "../api";
import { makeImagePath } from "../utils";
import { useHistory, useRouteMatch } from "react-router-dom";
import MovieSlider from "../Components/MovieSlider";

export const Wrapper = styled.div`
	background: black;
	padding-bottom: 200px;
`;

export const Loader = styled.div`
	height: 20vh;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const Banner = styled.div<{ bgPhoto: string }>`
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 60px;
	background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
		url(${(props) => props.bgPhoto});
	background-size: cover;
`;

export const Title = styled.h2`
	font-size: 68px;
	margin-bottom: 20px; ;
`;

export const Overview = styled.p`
	font-size: 30px;
	width: 50%;
`;

export const Overlay = styled(motion.div)`
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	opacity: 0;
`;

export const BigMovie = styled(motion.div)`
	position: absolute;
	width: 40vw;
	height: 80vh;
	left: 0;
	right: 0;
	margin: 0 auto;
	border-radius: 15px;
	overflow: hidden;
	background-color: ${(props) => props.theme.black.lighter};
`;

export const BigCover = styled.div`
	width: 100%;
	background-size: cover;
	background-position: center center;
	height: 400px;
`;

export interface BigTitleProps {
	len: number;
}
export const BigTitle = styled.h3<BigTitleProps>`
	color: ${(props) => props.theme.white.lighter};
	padding: 20px;
	font-size: ${(props) =>
		props.len < 17 ? "40px" : props.len > 35 ? "18px" : "23px"};
	position: relative;
	top: -80px;
	margin-top: ${(props) =>
		props.len < 20 ? "0px" : props.len > 35 ? "20px" : "14px"};
`;

export const BigOverview = styled.p`
	padding: 20px;
	position: relative;
	top: -80px;
	color: ${(props) => props.theme.white.lighter};
`;

export const Vote = styled.span`
	font-size: 17px;
	padding: 10px;
`;

function Home() {
	const history = useHistory();
	const bigMovieMatch = useRouteMatch<{ category: string; movieId: string }>(
		"/movies/:category/:movieId"
	);
	const { scrollY } = useScroll();
	const { data: nowPlaying, isLoading: loadging1 } = useQuery<IGetMoviesResult>(
		["movies", "nowPlaying"],
		getNowPlayingMovies
	);
	const { data: latest, isLoading: loadging2 } = useQuery<IMovie>(
		["movies", "latest"],
		getLatestMovies
	);
	const { data: topRated, isLoading: loadging3 } = useQuery<IGetMoviesResult>(
		["movies", "topRated"],
		getTopRatedMovies
	);
	const { data: upcomming, isLoading: loadging4 } = useQuery<IGetMoviesResult>(
		["movies", "upcomming"],
		getUpcommingMovies
	);
	const { data: popular, isLoading: loadging5 } = useQuery<IGetMoviesResult>(
		["movies", "popular"],
		getPopularMovies
	);

	const onOverlayClick = () => history.push("/");
	const clickedMovie =
		bigMovieMatch?.params.movieId &&
		(nowPlaying?.results.find(
			(movie) => movie.id === +bigMovieMatch.params.movieId
		) ||
			topRated?.results.find(
				(movie) => movie.id === +bigMovieMatch.params.movieId
			) ||
			upcomming?.results.find(
				(movie) => movie.id === +bigMovieMatch.params.movieId
			) ||
			popular?.results.find(
				(movie) => movie.id === +bigMovieMatch.params.movieId
			));
	return (
		<Wrapper>
			{loadging1 || loadging2 || loadging3 || loadging4 || loadging5 ? (
				<Loader>Loading...</Loader>
			) : (
				<>
					<Banner
						bgPhoto={
							popular?.results[0].backdrop_path
								? makeImagePath(popular?.results[0].backdrop_path, "w500")
								: popular?.results[0].poster_path
								? makeImagePath(popular?.results[0].poster_path, "w500")
								: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs8Qc3JQWjYZ1Moimi0xMVLbBrqS2DYvhnzA&usqp=CAU"
						}
					>
						<Title>{popular?.results[0].title}</Title>
						<Overview>
							{popular!.results[0].overview.length < 200
								? popular?.results[0].overview
								: popular?.results[0].overview.slice(0, 200) + "..."}
						</Overview>
					</Banner>
					<MovieSlider category="nowPlaying" data={nowPlaying!}></MovieSlider>
					<MovieSlider category="topRated" data={topRated!}></MovieSlider>
					<MovieSlider category="popular" data={popular!}></MovieSlider>
					<MovieSlider category="upcomming" data={upcomming!}></MovieSlider>
					<AnimatePresence>
						{bigMovieMatch ? (
							<>
								<Overlay
									onClick={onOverlayClick}
									exit={{ opacity: 0 }}
									animate={{ opacity: 1 }}
								/>
								<BigMovie
									style={{ top: scrollY.get() + 100 }}
									layoutId={
										bigMovieMatch.params.category + bigMovieMatch.params.movieId
									}
								>
									{clickedMovie && (
										<>
											<BigCover
												style={{
													backgroundImage: `linear-gradient(to top, black, transparent), url(${
														clickedMovie.backdrop_path
															? makeImagePath(
																	clickedMovie.backdrop_path,
																	"w500"
															  )
															: clickedMovie.poster_path
															? makeImagePath(clickedMovie.poster_path, "w500")
															: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs8Qc3JQWjYZ1Moimi0xMVLbBrqS2DYvhnzA&usqp=CAU"
													})`,
												}}
											/>
											<BigTitle len={clickedMovie.title.length}>
												{clickedMovie.title}
												<Vote>
													⭐️ {clickedMovie.vote_average} (
													{clickedMovie.vote_count})
												</Vote>
											</BigTitle>
											<BigOverview>
												{clickedMovie.overview
													? clickedMovie.overview.length < 200
														? clickedMovie.overview
														: clickedMovie.overview.slice(0, 200) + "..."
													: "No overview"}
											</BigOverview>
										</>
									)}
								</BigMovie>
							</>
						) : null}
					</AnimatePresence>
				</>
			)}
		</Wrapper>
	);
}
export default Home;
