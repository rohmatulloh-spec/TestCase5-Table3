import React from "react";
import TableKaryawan from "../components/fragments/Table";

const MainPage = () => {
	return (
		<div className="bg-background min-h-screen">
			<div className="flex flex-col justify-center items-center p-1">
				<h1 className="text-3xl font-bold mb-6 "> list Karyawan</h1>
				<TableKaryawan />
			</div>
		</div>
	);
};

export default MainPage;
