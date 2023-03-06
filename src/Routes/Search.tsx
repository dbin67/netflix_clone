import { useEffect, useState } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router";
import {
	IGetMoviesResult,
	IGetTVsResult,
	searchMovies,
	searchTVs,
} from "../api";
import styled from "styled-components";
import SearchMovieSlider from "../Components/SearchMovieSlider";
import SearchTVSlider from "../Components/SearchTVSlider";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
	background: black;
	padding-bottom: 200px;
`;

const Result = styled.div`
	height: 50vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 50px;
	font-size: 40px;
	font-weight: 400;
`;

const Overlay = styled(motion.div)`
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	opacity: 0;
`;

const BigTV = styled(motion.div)`
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

const BigCover = styled.div`
	width: 100%;
	background-size: cover;
	background-position: center center;
	height: 400px;
`;

interface BigTitleProps {
	len: number;
}

const BigTitle = styled.h3<BigTitleProps>`
	color: ${(props) => props.theme.white.lighter};
	padding: 20px;
	font-size: ${(props) =>
		props.len < 20 ? "40px" : props.len > 35 ? "18px" : "23px"};
	position: relative;
	top: -80px;
	margin-top: ${(props) =>
		props.len < 20 ? "0px" : props.len > 35 ? "20px" : "14px"};
`;

const BigOverview = styled.p`
	padding: 20px;
	position: relative;
	top: -80px;
	color: ${(props) => props.theme.white.lighter};
`;

const Vote = styled.span`
	font-size: 17px;
	padding: 10px;
`;

function Search() {
	const location = useLocation();
	const keyword = new URLSearchParams(location.search).get("keyword");
	const [movieResults, setMovieResults] = useState<IGetMoviesResult>();
	const [tvResults, setTvResults] = useState<IGetTVsResult>();
	const { scrollY } = useScroll();
	const history = useHistory();
	const bigItemMatch = useRouteMatch<{ id: string }>("/search/:id");
	const clickedItem =
		bigItemMatch?.params.id &&
		(movieResults?.results.find(
			(item) => item.id === +bigItemMatch.params.id
		) ||
			tvResults?.results.find((item) => item.id === +bigItemMatch.params.id));

	const onOverlayClick = () => history.push("/search");

	useEffect(() => {
		async function getData(keyword: string) {
			const movieData = await searchMovies(keyword!);
			const tvData = await searchTVs(keyword!);
			setMovieResults(movieData);
			setTvResults(tvData);
		}
		if (keyword) {
			getData(keyword!);
		}
	}, [keyword]);

	console.log(movieResults, tvResults);
	return (
		<>
			{movieResults && tvResults && (
				<Wrapper>
					<Result>
						🔎 Found {movieResults.results.length + tvResults.results.length}{" "}
						Results
					</Result>
					<SearchMovieSlider
						category="Movies"
						data={movieResults!}
					></SearchMovieSlider>
					<SearchTVSlider
						category="TV Shows"
						data={tvResults!}
					></SearchTVSlider>
					<AnimatePresence>
						{bigItemMatch ? (
							<>
								<Overlay
									onClick={onOverlayClick}
									exit={{ opacity: 0 }}
									animate={{ opacity: 1 }}
								/>
								<BigTV
									style={{ top: scrollY.get() + 100 }}
									layoutId={bigItemMatch.params.id}
								>
									{clickedItem && (
										<>
											<BigCover
												style={{
													backgroundImage: `linear-gradient(to top, black, transparent), url(${
														clickedItem.backdrop_path
															? makeImagePath(clickedItem.backdrop_path, "w500")
															: clickedItem.poster_path
															? makeImagePath(clickedItem.poster_path, "w500")
															: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs8Qc3JQWjYZ1Moimi0xMVLbBrqS2DYvhnzA&usqp=CAU"
													})`,
												}}
											/>
											<BigTitle
												len={
													"name" in clickedItem
														? clickedItem.name.length
														: clickedItem.title.length
												}
											>
												{"name" in clickedItem
													? clickedItem.name
													: clickedItem.title}
												<Vote>
													⭐️ {clickedItem.vote_average} (
													{clickedItem.vote_count})
												</Vote>
											</BigTitle>

											<BigOverview>
												{clickedItem.overview.length
													? clickedItem.overview.length < 200
														? clickedItem.overview
														: clickedItem.overview.slice(0, 200) + "..."
													: "No Overview"}
											</BigOverview>
										</>
									)}
								</BigTV>
							</>
						) : null}
					</AnimatePresence>
				</Wrapper>
			)}
		</>
	);
}
export default Search;
