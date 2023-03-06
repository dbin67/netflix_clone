import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
	position: relative;
	top: -100px;
	margin-bottom: 230px;
`;

const Row = styled(motion.div)`
	display: grid;
	gap: 5px;
	grid-template-columns: repeat(6, 1fr);
	position: absolute;
	width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
	background-color: white;
	background-image: url(${(props) => props.bgPhoto});
	background-size: cover;
	background-position: center center;
	height: 200px;
	font-size: 66px;
	cursor: pointer;
	&:first-child {
		transform-origin: center left;
	}
	&:last-child {
		transform-origin: center right;
	}
`;

const Info = styled(motion.div)`
	padding: 10px;
	background-color: ${(props) => props.theme.black.lighter};
	opacity: 0;
	position: absolute;
	width: 100%;
	bottom: 0;
	h4 {
		text-align: center;
		font-size: 18px;
	}
`;

const Category = styled.h3`
	color: white;
	padding: 10px;
	font-size: 35px;
	font-weight: 400;
`;

const rowVariants = {
	hidden: {
		x: window.outerWidth + 5,
	},
	visible: {
		x: 0,
	},
	exit: {
		x: -window.outerWidth - 5,
	},
};

const boxVariants = {
	normal: {
		scale: 1,
	},
	hover: {
		scale: 1.3,
		y: -80,
		transition: {
			delay: 0.5,
			duaration: 0.1,
			type: "tween",
		},
	},
};

const infoVariants = {
	hover: {
		opacity: 1,
		transition: {
			delay: 0.5,
			duaration: 0.1,
			type: "tween",
		},
	},
};

const offset = 6;

interface sliderProps {
	category: string;
	data: IGetMoviesResult;
}

const MovieSlider = (props: sliderProps) => {
	const [index, setIndex] = useState(0);
	const [leaving, setLeaving] = useState(false);
	const history = useHistory();

	const incraseIndex = (data: IGetMoviesResult) => {
		if (data) {
			if (leaving) return;
			toggleLeaving();
			const totalMovies = data.results.length - 1;
			const maxIndex = Math.floor(totalMovies / offset) - 1;
			setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
		}
	};

	const toggleLeaving = () => setLeaving((prev) => !prev);

	const onBoxClicked = (movieId: number) => {
		history.push(`/movies/${props.category}/${movieId}`);
	};

	return (
		<Wrapper>
			<Category
				onClick={() => {
					incraseIndex(props.data!);
				}}
			>
				{props.category}
			</Category>
			<AnimatePresence initial={false} onExitComplete={toggleLeaving}>
				<Row
					variants={rowVariants}
					initial="hidden"
					animate="visible"
					exit="exit"
					transition={{ type: "tween", duration: 1 }}
					key={index}
				>
					{props.data?.results
						.slice(offset * index, offset * index + offset)
						.map((movie) => (
							<Box
								layoutId={props.category + movie.id}
								key={movie.id}
								whileHover="hover"
								initial="normal"
								variants={boxVariants}
								onClick={() => onBoxClicked(movie.id)}
								transition={{ type: "tween" }}
								bgPhoto={
									movie.backdrop_path
										? makeImagePath(movie.backdrop_path, "w500")
										: movie.poster_path
										? makeImagePath(movie.poster_path, "w500")
										: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs8Qc3JQWjYZ1Moimi0xMVLbBrqS2DYvhnzA&usqp=CAU"
								}
							>
								<Info variants={infoVariants}>
									<h4>{movie.title}</h4>
								</Info>
							</Box>
						))}
				</Row>
			</AnimatePresence>
		</Wrapper>
	);
};
export default MovieSlider;
