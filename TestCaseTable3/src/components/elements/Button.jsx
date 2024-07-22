import React from "react";
import { useNavigate } from "react-router-dom";

const Button = ({ to, className, children, type, onClick }) => {
	const navigate = useNavigate();

	const handleClick = () => {
		if (to) {
			navigate(to);
		}
		if (onClick) {
			onClick();
		}
	};

	return (
		<button
			type={type}
			className={`transition ease-in-out delay-150 hover:scale-105 duration-300 bg-gradient-to-r from-green-400 to-blue-500 text-white w-full rounded ${className}`}
			onClick={handleClick}
		>
			{children}
		</button>
	);
};

export default Button;
