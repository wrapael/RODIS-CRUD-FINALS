import { useState, useEffect } from 'react'
import './App.css'
import axios from "axios";

function App() {
  const [students, setStudents] = useState([]);
  const [formID, setFormID] = useState(null);
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [age, setAge] = useState('');

  const handleChange = (id) => {
    const studentForm = students.find(student => student._id === id);
    setName(studentForm.name);
    setCourse(studentForm.course);
    setAge(studentForm.age);
    setFormID(id);
  }

  useEffect(() => {
    axios.get('http://localhost:5000/students')
      .then((response) => {
        setStudents(response.data);
      });
  }, []);

  return (
    <div>
      <h1>Student Management System</h1>

      <h2>Students</h2>

      <input placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} /><br /><br />

      <input placeholder="Course" value={course} onChange={(event) => setCourse(event.target.value)} /><br /><br />

      <input placeholder="Age" value={age} onChange={(event) => setAge(event.target.value)} /><br /><br />

      <button onClick={()=>{
        if (formID){
          axios.put(`http://localhost:5000/students/${formID}`, {name, course, age })
          .then(response => {
            setStudents(students.map(student =>
              student._id === formID ? response.data : student
            ));
            setFormID(null);
            setName('');
            setCourse('');
            setAge('');
          })
        } else{
          axios.post('http://localhost:5000/students', { name, course, age })
          .then(response => {
            setStudents([...students, response.data]);
            setName('');
            setCourse('');
            setAge('');
          });
        }
      }}>{formID ? "Update Student" : "Add Student"}</button><br /><br />

      <h2>Students</h2>
      {students.map((student) => (
        <div>
          <p>Name: {student.name}</p>
          <p>Course: {student.course}</p>
          <p>Age: {student.age}</p><br /><br />
          <button onClick={() => { handleChange(student._id); }}>Edit</button>
          <button onClick={() => {
            axios.delete(`http://localhost:5000/students/${student._id}`)
              .then(() => {
                setStudents(students.filter(event => event._id !== student._id));
              });
          }}>Delete</button>
        </div>))}

    </div>
  );
}

export default App