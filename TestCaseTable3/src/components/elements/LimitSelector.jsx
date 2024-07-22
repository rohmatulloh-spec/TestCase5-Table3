import React, { useState, useEffect } from "react";

const LimitSelector = ({ value, onChange }) => {
	const [selectedLimit, setSelectedLimit] = useState(value || "60000");

	useEffect(() => {
		setSelectedLimit(value);
	}, [value]);

	const handleChange = (event) => {
		const newValue = event.target.value;
		setSelectedLimit(newValue);
		if (onChange) onChange(newValue);
	};

	return (
		<div className="flex items-center space-x-2">
			<p className="font-semibold text-gray-700">Set time</p>
			<select
				value={selectedLimit}
				onChange={handleChange}
				className="border border-gray-300 h-14 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
			>
				<option value="60000">1 Minute</option>
				<option value="180000">3 Minutes</option>
				<option value="300000">5 Minutes</option>
				<option value="600000">10 Minutes</option>
				<option value="900000">15 Minutes</option>
			</select>
		</div>
	);
};

export default LimitSelector;
