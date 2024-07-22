import React, { useState, useEffect } from "react";
import Button from "../elements/Button";
import axios from "axios";
import Toast from "../elements/Toast";
import ToggleSwitch from "../elements/ToogleSwitch";
import LimitSelector from "../elements/LimitSelector";

const TableKaryawan = () => {
	const [tableData, setTableData] = useState([]);
	const [newRows, setNewRows] = useState([]);
	const [data, setData] = useState([]);
	const [newKaryawan, setNewKaryawan] = useState([]);
	const [editedData, setEditedData] = useState([]);
	const [deletedId, setDeletedId] = useState([]);
	const [deletedRows, setDeletedRows] = useState(new Set());
	const [toastMessage, setToastMessage] = useState("");
	const [toggleState, setToggleState] = useState(false);
	const [limit, setLimit] = useState("60000");

	const addRow = () => {
		const newRow = { id: "", firstName: "", lastName: "", email: "", age: "" };
		setTableData((prevTableData) => [...prevTableData, newRow]);
		setNewRows((prevNewRows) => [...prevNewRows, newRow]);
	};

	const getAllKaryawan = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/karyawan`
			);
			if (response.data) {
				setData(response.data);
				setTableData(
					response.data.map((row) => ({
						id: row.id || "",
						firstName: row.firstName || "",
						lastName: row.lastName || "",
						email: row.email || "",
						age: row.age || "",
					}))
				);
				setNewRows([]);
			} else {
				console.error("No data returned from API");
			}
		} catch (error) {
			console.error("Error fetching groups:", error);
		}
	};

	const handleInputChange = (e, rowIndex, field) => {
		const newValue = e.target.value;

		const newData = tableData.map((row, rIndex) => {
			if (rIndex === rowIndex) {
				return { ...row, [field]: newValue };
			}
			return row;
		});
		setTableData(newData);

		const updatedNewRows = newRows.map((row) => {
			if (row.id === tableData[rowIndex].id) {
				return { ...row, [field]: newValue };
			}
			return row;
		});
		setNewRows(updatedNewRows);
		setNewKaryawan(updatedNewRows);

		const updatedEditedData = editedData.filter(
			(data) => data.index !== rowIndex
		);
		const rowData = { ...newData[rowIndex], index: rowIndex };
		setEditedData([...updatedEditedData, rowData]);
	};

	const saveAllData = async () => {
		const formattedData = deletedId.map((id) => ({ id }));

		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/karyawan`,
				newKaryawan
			);
			console.log("Data successfully posted:", response.data);

			setNewKaryawan([]);

			getAllKaryawan();
		} catch (error) {
			console.error("Error posting newKaryawan data:", error);
		}

		try {
			const response = await axios.put(
				`${import.meta.env.VITE_API_URL}/karyawan`,
				editedData
			);
			console.log("Data successfully updated:", response.data);

			setEditedData([]);

			getAllKaryawan();
		} catch (error) {
			console.error("Error updating editedData:", error);
			setEditedData([]);
		}

		try {
			const response = await axios.delete(
				`${import.meta.env.VITE_API_URL}/karyawan`,
				{
					headers: {
						"Content-Type": "application/json",
					},
					data: formattedData,
				}
			);
			console.log("Data successfully deleted:", response.data);

			setDeletedId([]);
			getAllKaryawan();
		} catch (error) {
			console.error("Error updating deleted:", error);
			setDeletedId([]);
		}
		if (toggleState) {
			setToastMessage("Data saved successfully, auto save is active");
		} else {
			setToastMessage("Data saved successfully");
		}
	};

	const handleDelete = (id) => {
		setDeletedRows((prev) => new Set(prev).add(id));

		setDeletedId((prevDeletedIds) => {
			if (!prevDeletedIds.includes(id)) {
				return [...prevDeletedIds, id];
			}
			return prevDeletedIds;
		});
	};

	useEffect(() => {
		getAllKaryawan();
	}, []);

	useEffect(() => {
		let intervalId;

		if (toggleState) {
			intervalId = setInterval(saveAllData, limit);
		}

		return () => clearInterval(intervalId);
	}, [toggleState, deletedId, newKaryawan, editedData]);

	const handleToggle = (newState) => {
		setToggleState(newState);
		console.log(newState);
	};

	const handleLimitChange = (newLimit) => {
		setLimit(newLimit);
	};

	return (
		<div className="container mx-auto p-4">
			<div className="flex flex-col md:flex-row md:justify-between items-center w-full gap-2">
				<div className="w-full max-w-md mb-2 flex justify-center">
					<Button className="h-10" onClick={addRow}>
						Add Row
					</Button>
				</div>

				<div className="w-full max-w-md mb-2 flex justify-center">
					<Button className="h-10" onClick={saveAllData}>
						Save
					</Button>
				</div>

				<div className="w-full max-w-md mb-2 flex justify-center">
					<LimitSelector value={limit} onChange={handleLimitChange} />
				</div>

				<div className="w-full max-w-md mb-2 flex justify-center">
					<ToggleSwitch initialState={toggleState} onToggle={handleToggle} />
				</div>
			</div>
			<div className="overflow-x-auto">
				<table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
					<thead className="bg-gray-100 border-b border-gray-200">
						<tr>
							<th className="p-3 text-left">Id</th>
							<th className="p-3 text-left">First Name</th>
							<th className="p-3 text-left">Last Name</th>
							<th className="p-3 text-left">Email</th>
							<th className="p-3 text-left">Age</th>
							<th className="p-3 text-left">Actions</th>
						</tr>
					</thead>
					<tbody>
						{tableData.map((row, rowIndex) => (
							<tr
								key={rowIndex}
								className={`border-b border-gray-200 ${
									deletedRows.has(row.id) ? "bg-red-500 text-white" : ""
								}`}
							>
								<td className="p-3">
									<input
										type="text"
										value={row.id || ""}
										disabled
										className="bg-gray-100 text-gray-600 border border-gray-300 rounded-md px-2 py-1 w-full"
									/>
								</td>
								<td className="p-3">
									<input
										type="text"
										value={row.firstName || ""}
										onChange={(e) =>
											handleInputChange(e, rowIndex, "firstName")
										}
										className="border border-gray-300 rounded-md px-2 py-1 w-full"
									/>
								</td>
								<td className="p-3">
									<input
										type="text"
										value={row.lastName || ""}
										onChange={(e) => handleInputChange(e, rowIndex, "lastName")}
										className="border border-gray-300 rounded-md px-2 py-1 w-full"
									/>
								</td>
								<td className="p-3">
									<input
										type="text"
										value={row.email || ""}
										onChange={(e) => handleInputChange(e, rowIndex, "email")}
										className="border border-gray-300 rounded-md px-2 py-1 w-full"
									/>
								</td>
								<td className="p-3">
									<input
										type="text"
										value={row.age || ""}
										onChange={(e) => handleInputChange(e, rowIndex, "age")}
										className="border border-gray-300 rounded-md px-2 py-1 w-full"
									/>
								</td>
								<td className="p-3 text-center">
									<Button
										onClick={() => handleDelete(row.id)}
										className="bg-red-500 text-white hover:bg-red-600 rounded-md px-4 py-2"
									>
										Delete
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="">
				{toastMessage && (
					<Toast message={toastMessage} onClose={() => setToastMessage("")} />
				)}
			</div>
		</div>
	);
};

export default TableKaryawan;
