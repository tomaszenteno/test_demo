const asyncHandler = require("express-async-handler");
const { getAllStudents, addNewStudent, getStudentDetail, setStudentStatus, updateStudent, deleteStudent } = require("./students-service");

// GET /api/v1/students?name=...&className=...&section=...&roll=...
const handleGetAllStudents = asyncHandler(async (req, res) => {
    const { name, className, section, roll } = req.query;

  const payload = {
    ...(name && { name }),
    ...(className && { className }),
    ...(section && { section }),
    ...(roll && { roll }),
  };

  const students = await getAllStudents(payload);
  res.json({ students });

});

// POST /api/v1/students
const handleAddStudent = asyncHandler(async (req, res) => {
    const payload = req.body;

    const result = await addNewStudent(payload);
    res.status(201).json(result);
});

// PUT /api/v1/students/:id
const handleUpdateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = {
    ...req.body,

    userId: req.body.userId ?? id,
  };

  const result = await updateStudent(payload);
  res.json(result);
});

// GET /api/v1/students/:id
const handleGetStudentDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const student = await getStudentDetail(id);
    res.json(student);
});

// POST /api/v1/students/:id/status
const handleStudentStatus = asyncHandler(async (req, res) => {
    const { id: userId } = req.params;
    const { id: reviewerId } = req.user; 
    const { status } = req.body;

    let normalizedStatus;
    if (typeof status === "boolean") {
    normalizedStatus = status;
    } else if (typeof status === "string") {
    normalizedStatus = status.toLowerCase() === "true";
    } else if (typeof status === "number") {
    normalizedStatus = status === 1;
    } else {
    normalizedStatus = !!status;
    }

    const result = await setStudentStatus({
    userId,
    reviewerId,
    status: normalizedStatus,
  });

  res.json(result);

});

// DELETE /api/v1/students/:id
const handleDeleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await deleteStudent(id);
  res.json(result);
});

module.exports = {
    handleGetAllStudents,
    handleGetStudentDetail,
    handleAddStudent,
    handleStudentStatus,
    handleUpdateStudent,
    handleDeleteStudent,
};
