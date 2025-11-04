import { useContext } from "react";
import { AdminStudentContext } from "../contexts/admin-student-context";
// ----------------------------------------------------------------------

const useStudent = () => useContext(AdminStudentContext);

export default useStudent;
