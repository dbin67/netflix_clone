import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import {
	getAiringTodayTVs,
	getLatestTVs,
	getOnTheAirTVs,
	getPopularTVs,
	getTopRatedTVs,
	IGetTVsResult,
	ITV,
} from "../api";
import { makeImagePath } from "../utils";
import { useHistory, useRouteMatch } from "react-router-dom";
import TVSlider from "../Components/TVSlider";
import {
	Banner,
	BigCover,
	BigOverview,
	BigTitle,
	Loader,
	Overlay,
	Overview,
	Title,
	Vote,
	Wrapper,
} from "./Home";

export const BigTV = styled(motion.div)`
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

function TV() {
	const history = useHistory();
	const bigTVMatch = useRouteMatch<{ category: string; tvId: string }>(
		"/tv/:category/:tvId"
	);
	const { scrollY } = useScroll();
	const { data: latest, isLoading: loadging2 } = useQuery<ITV>(
		["tvs", "latest"],
		getLatestTVs
	);
	const { data: airingToday, isLoading: loadging1 } = useQuery<IGetTVsResult>(
		["tvs", "airing_today"],
		getAiringTodayTVs
	);
	const { data: onTheAir, isLoading: loadging4 } = useQuery<IGetTVsResult>(
		["tvs", "on_the_air"],
		getOnTheAirTVs
	);
	const { data: topRated, isLoading: loadging3 } = useQuery<IGetTVsResult>(
		["tvs", "topRated"],
		getTopRatedTVs
	);
	const { data: popular, isLoading: loadging5 } = useQuery<IGetTVsResult>(
		["tvs", "popular"],
		getPopularTVs
	);

	const onOverlayClick = () => history.push("/tv");
	const clickedTV =
		bigTVMatch?.params.tvId &&
		(airingToday?.results.find((tv) => tv.id === +bigTVMatch.params.tvId) ||
			topRated?.results.find((tv) => tv.id === +bigTVMatch.params.tvId) ||
			onTheAir?.results.find((tv) => tv.id === +bigTVMatch.params.tvId) ||
			popular?.results.find((tv) => tv.id === +bigTVMatch.params.tvId));

	return (
		<Wrapper>
			{loadging1 || loadging2 || loadging3 || loadging4 || loadging5 ? (
				<Loader>Loading...</Loader>
			) : (
				<>
					<Banner
						bgPhoto={
							airingToday?.results[0].backdrop_path
								? makeImagePath(airingToday?.results[0].backdrop_path, "w500")
								: airingToday?.results[0].poster_path
								? makeImagePath(airingToday?.results[0].poster_path, "w500")
								: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs8Qc3JQWjYZ1Moimi0xMVLbBrqS2DYvhnzA&usqp=CAU"
						}
					>
						<Title>{airingToday?.results[0].name}</Title>
						<Overview>
							{airingToday!.results[0].overview.length < 200
								? airingToday?.results[0].overview
								: airingToday?.results[0].overview.slice(0, 200) + "..."}
						</Overview>
					</Banner>
					<TVSlider category="airingToday" data={airingToday!}></TVSlider>
					<TVSlider category="topRated" data={topRated!}></TVSlider>
					<TVSlider category="popular" data={popular!}></TVSlider>
					<TVSlider category="onTheAir" data={onTheAir!}></TVSlider>
					<AnimatePresence>
						{bigTVMatch ? (
							<>
								<Overlay
									onClick={onOverlayClick}
									exit={{ opacity: 0 }}
									animate={{ opacity: 1 }}
								/>
								<BigTV
									style={{ top: scrollY.get() + 100 }}
									layoutId={bigTVMatch.params.category + bigTVMatch.params.tvId}
								>
									{clickedTV && (
										<>
											<BigCover
												style={{
													backgroundImage: `linear-gradient(to top, black, transparent), url(${
														clickedTV.backdrop_path
															? makeImagePath(clickedTV.backdrop_path, "w500")
															: clickedTV.poster_path
															? makeImagePath(clickedTV.poster_path, "w500")
															: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs8Qc3JQWjYZ1Moimi0xMVLbBrqS2DYvhnzA&usqp=CAU"
													})`,
												}}
											/>
											<BigTitle len={clickedTV.name.length}>
												{clickedTV.name}
												<Vote>
													⭐️ {clickedTV.vote_average} ({clickedTV.vote_count})
												</Vote>
											</BigTitle>

											<BigOverview>
												{clickedTV.overview
													? clickedTV.overview.length < 200
														? clickedTV.overview
														: clickedTV.overview.slice(0, 200) + "..."
													: "No overview"}
											</BigOverview>
										</>
									)}
								</BigTV>
							</>
						) : null}
					</AnimatePresence>
				</>
			)}
		</Wrapper>
	);
}
export default TV;
