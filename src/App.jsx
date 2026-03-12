import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
	const [level, setLevel] = useState("");
	const [department, setDepartment] = useState("");
	const [degree, setDegree] = useState("");
	const [errors, setErrors] = useState({});
	const [progress, setProgress] = useState(0);
	const [showModal, setShowModal] = useState(false);
	const [submittedData, setSubmittedData] = useState(null);
	const formRef = useRef(null);

	// Degree programs organized by department
	const degreePrograms = {
		Undergraduate: {
			"College of Engineering and Architecture": [
				"BS Architecture",
				"BS Chemical Engineering",
				"BS Civil Engineering",
				"BS Computer Engineering",
				"BS Electrical Engineering",
				"BS Electronics Engineering",
				"BS Industrial Engineering",
				"BS Mechanical Engineering",
			],
			"College of Computer Studies": [
				"BS Computer Science",
				"BS Data Science and Analytics",
				"BS Entertainment and Multimedia Computing",
				"BS Information Technology",
			],
			"College of Business Education": [
				"BS Accountancy",
				"BS Accounting Information System",
				"BS Business Administration - Financial Management",
				"BS Business Administration - Human Resource Management",
				"BS Business Administration - Logistics and Supply Chain Management",
				"BS Business Administration - Marketing Management",
			],
			"College of Arts": [
				"Bachelor of Arts in English Language",
				"Bachelor of Arts in Political Science",
			],
		},
		Graduate: {
			"Doctorate Degrees": [
				"Doctor in Information Technology",
				"Doctor of Engineering (Computer Engineering)",
				"Doctor of Philosophy in Computer Science",
			],
			"Master's Degrees": [
				"Master in Information Systems",
				"Master in Information Technology",
				"Master in Logistics and Supply Chain Management",
				"Master of Engineering (Civil Engineering)",
				"Master of Engineering (Computer Engineering)",
				"Master of Engineering (Electrical Engineering)",
				"Master of Engineering (Electronics Engineering)",
				"Master of Engineering (Industrial Engineering)",
				"Master of Engineering (Mechanical Engineering)",
				"Master of Science in Computer Science",
			],
		},
	};

	const handleLevelChange = (e) => {
		setLevel(e.target.value);
		setDepartment("");
		setDegree("");
	};

	const handleDepartmentChange = (e) => {
		setDepartment(e.target.value);
		setDegree("");
	};

	const handleBlur = (e) => {
		const { name, value, required } = e.target;
		// DOB validation (no future dates)
		if (name === "dob" && value) {
			const today = new Date().toISOString().split("T")[0];
			if (value > today) {
				setErrors((prev) => ({ ...prev, dob: true }));
				return;
			}
		}
		if (required) {
			setErrors((prev) => ({
				...prev,
				[name]: value.toString().trim() === "" ? true : false,
			}));
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const form = formRef.current || e.target;
		const newErrors = {};
		Array.from(form.elements).forEach((el) => {
			if (el.required && !el.value) {
				newErrors[el.name] = true;
			}
		});
		setErrors(newErrors);
		if (Object.keys(newErrors).length === 0) {
			// collect form data and show modal summary
			const fd = new FormData(form);
			const data = {};
			for (let [k, v] of fd.entries()) {
				data[k] = v;
			}
			setSubmittedData(data);
			setShowModal(true);
		}
	};

	const RequiredMark = ({ fieldName }) =>
		errors[fieldName] ? <span className="error">*</span> : null;

	const availableDepartments = level ? Object.keys(degreePrograms[level]) : [];
	const availableDegrees = department && level ? degreePrograms[level][department] || [] : [];

	useEffect(() => {
		const updateProgress = () => {
			const form = formRef.current;
			if (!form) return;
			const required = Array.from(form.elements).filter((el) => el.required && el.type !== "hidden");
			const filled = required.filter((el) => el.value && el.value.toString().trim() !== "");
			const pct = required.length === 0 ? 0 : Math.round((filled.length / required.length) * 100);
			setProgress(pct);
		};
		updateProgress();
		// listen to input events
		const form = formRef.current;
		if (form) {
			form.addEventListener("input", updateProgress);
			form.addEventListener("change", updateProgress);
		}
		return () => {
			if (form) {
				form.removeEventListener("input", updateProgress);
				form.removeEventListener("change", updateProgress);
			}
		};
	}, []);

	return (
		<div className="container">
			<div className="card">
				<header className="card-header">
					<h1>ADEi University Digital Registrar</h1>
					<div className="progress-wrap">
						<div className="progress-bar" style={{ width: `${progress}%` }} />
						<div className="progress-label">{progress}% complete</div>
					</div>
				</header>

			<form ref={formRef} onSubmit={handleSubmit}>
				{/* PERSONAL INFORMATION */}
				<h2>Personal Information</h2>
				<fieldset>
					<legend>Student Identity</legend>
					<div className="grid-4">
						<div>
							<label>
								First Name <RequiredMark fieldName="firstName" />
							</label>
							<input type="text" name="firstName" required onBlur={handleBlur} />
						</div>
						<div>
							<label>
								Middle Name <RequiredMark fieldName="middleName" />
							</label>
							<input type="text" name="middleName" required onBlur={handleBlur} />
						</div>
						<div>
							<label>
								Last Name <RequiredMark fieldName="lastName" />
							</label>
							<input type="text" name="lastName" required onBlur={handleBlur} />
						</div>
						<div>
							<label>Suffix</label>
							<input type="text" name="suffix" />
						</div>
					</div>
					<div className="grid-3">
						<div>
							<label>
								Date of Birth <RequiredMark fieldName="dob" />
							</label>
							<input
								type="date"
								name="dob"
								max={new Date().toISOString().split("T")[0]}
								required
								onKeyDown={(e) => e.preventDefault()}
								onBlur={handleBlur}
							/>
						</div>
						<div>
							<label>
								Gender <RequiredMark fieldName="gender" />
							</label>
							<select name="gender" required onBlur={handleBlur}>
								<option value="">Select</option>
								<option>Male</option>
								<option>Female</option>
								<option>Non-binary</option>
							</select>
						</div>
						<div>
							<label>
								Nationality <RequiredMark fieldName="nationality" />
							</label>
							<select name="nationality" required onBlur={handleBlur}>
								<option value="">Select</option>
								<option>Filipino</option>
								<option>American</option>
								<option>Other</option>
							</select>
						</div>
					</div>
					<div className="grid-2">
						<div>
							<label>
								Religion <RequiredMark fieldName="religion" />
							</label>
							<input type="text" name="religion" required onBlur={handleBlur} />
						</div>
					</div>
				</fieldset>

				{/* CONTACT DETAILS */}
				<h2>Contact Details</h2>
				<fieldset>
					<legend>Communication Information</legend>
					<div className="grid-3">
						<div>
							<label>
								Email <RequiredMark fieldName="email" />
							</label>
							  <input type="email" name="email" required onBlur={handleBlur} />
							  {errors.email && <small className="help error-msg">Please enter a valid email.</small>}
						</div>
						<div>
							<label>
								Mobile <RequiredMark fieldName="mobile" />
							</label>
							<input
								type="tel"
								name="mobile"
								required
								onInput={(e) => {
									if (e.target.value.length > 11) e.target.value = e.target.value.slice(0, 11);
								}}
								onBlur={handleBlur}
							/>
							{errors.mobile && <small className="help error-msg">Mobile number is required.</small>}
						</div>
						<div>
							<label>Landline</label>
							<input
								type="tel"
								name="landline"
								onInput={(e) => {
									if (e.target.value.length > 10) e.target.value = e.target.value.slice(0, 10);
								}}
							/>
						</div>
					</div>

					<div className="grid-4">
						<div>
							<label>
								Street <RequiredMark fieldName="street" />
							</label>
							<input type="text" name="street" required onBlur={handleBlur} />
						</div>
						<div>
							<label>
								Barangay <RequiredMark fieldName="barangay" />
							</label>
							<input type="text" name="barangay" required onBlur={handleBlur} />
						</div>
						<div>
							<label>
								City <RequiredMark fieldName="city" />
							</label>
							<input type="text" name="city" required onBlur={handleBlur} />
						</div>
						<div>
							<label>
								Province <RequiredMark fieldName="province" />
							</label>
							<input type="text" name="province" required onBlur={handleBlur} />
						</div>
					</div>

					<div className="grid-2">
						<div>
							<label>
								Zip Code <RequiredMark fieldName="zip" />
							</label>
							<input
								type="tel"
								name="zip"
								required
								onInput={(e) => {
									if (e.target.value.length > 4) e.target.value = e.target.value.slice(0, 4);
								}}
								onBlur={handleBlur}
							/>
						</div>
						<div>
							<label>
								Preferred Contact Time 8am - 5pm <RequiredMark fieldName="time" />
							</label>
							<input type="time" name="time" min="08:00" max="17:00" required onBlur={handleBlur} />
						</div>
					</div>
				</fieldset>

				{/* ACADEMIC HISTORY */}
				<h2>Academic History</h2>
				{/* Elementary */}
				<fieldset>
					<legend>Elementary School</legend>
					<div className="grid-3">
						<div>
							<label>
								Name <RequiredMark fieldName="elemName" />
							</label>
							<input type="text" name="elemName" required onBlur={handleBlur} />
						</div>
						<div>
							<label>
								Year Graduated <RequiredMark fieldName="elemYear" />
							</label>
							<input type="number" name="elemYear" min="1900" max="2026" required onBlur={handleBlur} />
						</div>
						<div>
							<label>
								Address <RequiredMark fieldName="elemAddress" />
							</label>
							<input type="text" name="elemAddress" required onBlur={handleBlur} />
						</div>
					</div>
				</fieldset>

				{/* Junior High */}
				<fieldset>
					<legend>Junior High School</legend>
					<div className="grid-3">
						<div>
							<label>
								Name <RequiredMark fieldName="jhsName" />
							</label>
							<input type="text" name="jhsName" required onBlur={handleBlur} />
						</div>
						<div>
							<label>
								Year Graduated <RequiredMark fieldName="jhsYear" />
							</label>
							<input type="number" name="jhsYear" min="1900" max="2026" required onBlur={handleBlur} />
						</div>
						<div>
							<label>
								Address <RequiredMark fieldName="jhsAddress" />
							</label>
							<input type="text" name="jhsAddress" required onBlur={handleBlur} />
						</div>
					</div>
				</fieldset>

				{/* Senior High */}
				<fieldset>
					<legend>Senior High School</legend>
					<div className="grid-4">
						<div>
							<label>
								Name <RequiredMark fieldName="shsName" />
							</label>
							<input type="text" name="shsName" required onBlur={handleBlur} />
						</div>
						<div>
							<label>
								Year Graduated <RequiredMark fieldName="shsYear" />
							</label>
							<input type="number" name="shsYear" min="1900" max="2026" required onBlur={handleBlur} />
						</div>
						<div>
							<label>
								Grade Average <RequiredMark fieldName="shsAverage" />
							</label>
							<input type="text" name="shsAverage" required onBlur={handleBlur} />
						</div>
						<div>
							<label>
								Address <RequiredMark fieldName="shsAddress" />
							</label>
							<input type="text" name="shsAddress" required onBlur={handleBlur} />
						</div>
					</div>
				</fieldset>

				{/* ENROLLMENT CHOICES */}
				<h2>Enrollment Choices</h2>
				<fieldset>
					<legend>Program Selection</legend>
					<h3>Academic Level</h3>
					<div className="radio-group">
						<label>
							<input
								type="radio"
								name="level"
								value="Undergraduate"
								required
								checked={level === "Undergraduate"}
								onChange={handleLevelChange}
								onBlur={handleBlur}
							/>
							Undergraduate <RequiredMark fieldName="level" />
						</label>
						<label>
							<input
								type="radio"
								name="level"
								value="Graduate"
								required
								checked={level === "Graduate"}
								onChange={handleLevelChange}
								onBlur={handleBlur}
							/>
							Graduate <RequiredMark fieldName="level" />
						</label>
					</div>
					<h3>Semester</h3>
					<div className="radio-group">
						<label>
							<input type="radio" name="semester" value="1st" required onBlur={handleBlur} />
							1st <RequiredMark fieldName="semester" />
						</label>
						<label>
							<input type="radio" name="semester" value="2nd" required onBlur={handleBlur} />
							2nd <RequiredMark fieldName="semester" />
						</label>
					</div>
					<h3>Campus</h3>
					<div className="radio-group">
						<label>
							<input type="radio" name="campus" value="Manila" required onBlur={handleBlur} />
							Manila <RequiredMark fieldName="campus" />
						</label>
						<label>
							<input type="radio" name="campus" value="Quezon City" required onBlur={handleBlur} />
							Quezon City <RequiredMark fieldName="campus" />
						</label>
					</div>
					<h3>College Department</h3>
					<select name="department" required value={department} onChange={handleDepartmentChange} onBlur={handleBlur} disabled={!level}>
						<option value="">Select Department</option>
						{availableDepartments.map((dep) => (
							<option key={dep} value={dep}>{dep}</option>
						))}
					</select>
					<h3>Degree Program</h3>
					<select name="degree" required value={degree} onChange={(e) => setDegree(e.target.value)} onBlur={handleBlur} disabled={!department}>
						<option value="">Select Degree Program</option>
						{availableDegrees.map((deg) => (
							<option key={deg} value={deg}>{deg}</option>
						))}
					</select>
				</fieldset>
				<div className="form-actions">
					<button type="submit" className="submit-btn">Submit Registration</button>
				</div>
			</form>

			{showModal && (
				<div className="modal-overlay" onClick={() => setShowModal(false)}>
					<div className="modal" onClick={(e) => e.stopPropagation()}>
						<h2>Submission Preview</h2>
						<pre>{JSON.stringify(submittedData, null, 2)}</pre>
						<div className="modal-actions">
							<button onClick={() => { setShowModal(false); setSubmittedData(null); }}>Close</button>
						</div>
					</div>
				</div>
			)}

			</div>
		</div>
	);
}

export default App;