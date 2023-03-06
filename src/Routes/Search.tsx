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
import {
	BigCover,
	BigOverview,
	BigTitle,
	Overlay,
	Vote,
	Wrapper,
} from "./Home";

const Result = styled.div`
	height: 50vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding: 50px;
	font-size: 40px;
	font-weight: 400;
`;

const BigItem = styled(motion.div)`
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
								<BigItem
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
								</BigItem>
							</>
						) : null}
					</AnimatePresence>
				</Wrapper>
			)}
		</>
	);
}
export default Search;
