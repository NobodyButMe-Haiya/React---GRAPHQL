import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faArrowsRotate, faPlus, faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { GET_PERSONS, CREATE_PERSON, UPDATE_PERSON, DELETE_PERSON } from './Query';
import { useQuery } from '@apollo/react-hooks';

function App() {


  let [listDataFromServer, defineMeTheList] = useState([]);
  let [inputName, setName] = useState("");
  let [inputAge, setAge] = useState("");

  let [inputSearch, setSearch] = useState("");

  let nameRef = useRef(null);
  let ageRef = useRef(null);
  let searchRef = useRef(null);
  
    // calling constructor to get some value 
  useEffect(() => {
    console.log("use effect");
    const getPersons = useQuery(GET_PERSONS);
    // is this will work ? 
    getPersons.then(items => {
      console.log(items);
      defineMeTheList(items);
    });
  }, []);

  const searchRecord = () => {
    console.log("searchRecord");
    // manual search inputSearch ? 
    var data = [];
    listDataFromServer.map((row) => {
      if (row.name.toLowerCase().includes(inputSearch.toLowerCase())) {
        var row = { personId: row.personId, name: newName, age: row.age };
        data.push(row);
      } else {
        data.push(row);
      }
    });
    defineMeTheList(data);
  }
  const resetRecord = () => {
    console.log("Resetting record");
    searchRef.current.value = "";
    getList().then(items => {
      console.log(items);
      defineMeTheList(items);
    });
  }
  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  }
  const handleChangeName = (e) => {
    setName(e.target.value);
  }
  const handleChangeAge = (e) => {
    setAge(e.target.value);
  }
  const handleChangeNameRow = (e, rowCurrent) => {
    let newName = e.target.value;
    var data = [];
    listDataFromServer.map((row) => {
      if (row.personId === rowCurrent.personId && row.name !== newName) {
        var row = { personId: row.personId, name: newName, age: row.age };
        data.push(row);
      } else {
        data.push(row);
      }
    });
    defineMeTheList(data);
  }
  const handleChangeAgeRow = (e, rowCurrent) => {
    let newAge = e.target.value;
    var data = [];
    listDataFromServer.map((row) => {
      if (row.personId === rowCurrent.personId && row.age !== newAge) {
        var row = { personId: row.personId, name: row.name, age: newAge };
        data.push(row);
      } else {
        data.push(row);
      }
    });
    defineMeTheList(data);
  }
  const createRecord = () => {
    console.log("addRecord");
    try {
      const createMutation = useQuery(CREATE_PERSON, { variables: { name: inputName, age: inputAge } });
    } catch (error) {
      console.log(error);
    }

  }
  const updateRecord = (row) => {
    console.log("update record");
    try {
      const updateMutation = useQuery(UPDATE_PERSON, { variables: { name: row.name, age: row.age, personId: row.personId } });
    } catch (error) {
      console.log(error);
    }

  }
  const deleteRecord = (row) => {
    console.log("deleteRecord");

    try {
      const deleteMutation = useQuery(DELETE_PERSON, { variables: { personId: row.personId } });
    } catch (error) {
      console.log(error);
    }
  }
  const anyData = () => {
    return (
      listDataFromServer.map((row) => {
        let name = row.personId + "-Name";
        let age = row.personId + "-Age";
        return (<tr id={row.personId} key={row.personId}>
          <td> {row.personId} </td>
          <td>
            <input type="text" placeholder="Name" id={name} className="form-control" defaultValue={row.name} onChange={(e) => handleChangeNameRow(e, row)} />
          </td>
          <td>
            <input type="text" placeholder="Age" id={age} className="form-control" defaultValue={row.age} onChange={(e) => handleChangeAgeRow(e, row)} />

          </td>
          <td>
            <button type="button" className="btn btn-warning" onClick={(e) => updateRecord(row)}>
              <FontAwesomeIcon icon={faPenToSquare} />&nbsp;
              UPDATE</button>
            &nbsp;
            <button type="button" className="btn btn-danger" onClick={() => deleteRecord(row)}>
              <FontAwesomeIcon icon={faTrash} />&nbsp;
              DELETE</button>
          </td>
        </tr>)
      }));
  }
  const emptyData = () => {
    return (<tr><td colSpan={4}>No Record Available</td></tr>);
  }
  return (
    <Container>
      <h1>This is sample react app with bootstrap inline</h1>
      <div className="card">
        <div className="card-body">
          <label>
            <input ref={searchRef} type="text" className="form-control" id="search" placeholder="Search Here" onChange={(e) => handleChangeSearch(e)} />
          </label>
        </div>
        <div className="card-footer">
          <button className="btn btn-info" onClick={searchRecord}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      </div>
      <br />
      <table className="table table-striped">
        <thead>
          <tr>
            <th>
              <button type="button" onClick={resetRecord} className="btn btn-primary">
                <FontAwesomeIcon icon={faArrowsRotate} />
              </button>
            </th>
            <th><input type="text" ref={nameRef} id="name" placeholder="Name" className="form-control" onChange={(e) => handleChangeName(e)} /></th>
            <th><input type="text" ref={ageRef} id="age" placeholder="Age" className="form-control" onChange={(e) => handleChangeAge(e)} /> </th>
            <th>
              <button type="button" className="btn btn-primary" onClick={createRecord}>
                <FontAwesomeIcon icon={faPlus} />&nbsp;
                Create </button>
            </th>
          </tr>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Age</th>
            <th>Command</th>
          </tr>
        </thead>
        <tbody id="tbody">
          {(listDataFromServer?.length > 0) ? anyData() : emptyData()}
        </tbody>
      </table>
    </Container>
  );
}

export default App;
