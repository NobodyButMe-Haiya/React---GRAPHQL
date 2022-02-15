import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faArrowsRotate, faPlus, faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { GET_PERSONS, CREATE_PERSON, UPDATE_PERSON, DELETE_PERSON } from './Query';
import { useQuery, useMutation } from '@apollo/client';

function App() {


  let [listDataFromServer, defineMeTheList] = useState([]);
  // input change
  let [inputName, setName] = useState("");
  let [inputAge, setAge] = useState("");
  let [inputSearch, setSearch] = useState("");
  // replacement for id 
  let nameRef = useRef(null);
  let ageRef = useRef(null);
  let searchRef = useRef(null);

  const { data, loading, error,refetch } = useQuery(GET_PERSONS);
  const [createMutation] = useMutation(CREATE_PERSON);
  const [updateMutation] = useMutation(UPDATE_PERSON);
  const [deleteMutation] = useMutation(DELETE_PERSON);
  // calling constructor to get some value 

  useEffect(() => {
    if (loading === false && data) {
      console.log(data.getPersons);
      // not this console.log(data.getPersons.data);
      defineMeTheList(data.getPersons);

    }
  }, [loading, data])
  // start search
  const searchRecord = () => {
    console.log("searchRecord");
    // manual search inputSearch ? 
    var dataFilter = [];
    if (inputSearch !== "") {
      listDataFromServer.map((row) => {
        // so should loop here 
        if (row.name.toLowerCase().includes(inputSearch.toLowerCase())) {
          let newRow = { personId: row.personId, name: row.name, age: row.age };
          dataFilter.push(newRow);
        }
      });

      console.log(dataFilter);
      defineMeTheList(dataFilter);
    }
    return "";
  }
  const resetRecord = () => {
    console.log("Resetting record");
    searchRef.current.value = "";
    refetch();
  }
  // end search
  // form event
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
    let dataSort = [];
    listDataFromServer.map((row) => {
      if (row.personId === rowCurrent.personId && row.name !== newName) {
        let newRow = { personId: row.personId, name: newName, age: row.age };
        dataSort.push(newRow);
      } else {
        dataSort.push(row);
      }
    });
    defineMeTheList(dataSort);
  }
  const handleChangeAgeRow = (e, rowCurrent) => {
    let newAge = e.target.value;
    let dataSort = [];
    listDataFromServer.map((row) => {
      if (row.personId === rowCurrent.personId && row.age !== newAge) {
        let newRow = { personId: row.personId, name: row.name, age: newAge };
        dataSort.push(newRow);
      } else {
        dataSort.push(row);
      }
    });
    defineMeTheList(dataSort);
  }
  // end form event
  // start crud
  async function CreateRecord() {
    console.log("addRecord");

    try {
      await createMutation({ variables: { name: inputName, age: parseInt(inputAge) },refetchQueries: [{ query: GET_PERSONS }] });
      console.log(createMutation);
      defineMeTheList(data.getPersons);
      nameRef.current.value = "";
      ageRef.current.value = "";
  
    } catch (error) {
      console.log(error);
    }

  }
  async function UpdateRecord(row) {
    console.log("update record");
    try {
      await updateMutation({ variables: { name: row.name, age: parseInt(row.age), personId: parseInt(row.personId) } });
      console.log(updateMutation)
    } catch (error) {
      console.log(error);
    }

  }
  async function DeleteRecord(row) {
    console.log("deleteRecord");

    try {
      await deleteMutation({ variables: { personId: parseInt(row.personId) },refetchQueries: [{ query: GET_PERSONS }] });
      console.log(deleteMutation)
    } catch (error) {
      console.log(error);
    }
  }
  // end crud
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
            <button type="button" className="btn btn-warning" onClick={() => UpdateRecord(row)}>
              <FontAwesomeIcon icon={faPenToSquare} />&nbsp;
              UPDATE</button>
            &nbsp;
            <button type="button" className="btn btn-danger" onClick={() => DeleteRecord(row)}>
              <FontAwesomeIcon icon={faTrash} />&nbsp;
              DELETE</button>
          </td>
        </tr>)
      }));
  }
  const emptyData = () => {
    return (<tr><td colSpan={4}>No Record Available</td></tr>);
  }
  const loadingData = () => {
    return (<tr><td colSpan={4}>Loading .. </td></tr>);
  }
  return (
    <Container>
      <h1>Sample Testing React With GraphQL + MySQL</h1>
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
              <button type="button" className="btn btn-primary" onClick={CreateRecord}>
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

          {(loading) ? loadingData() : (listDataFromServer.length > 0) ? anyData() : emptyData()}
        </tbody>
      </table>

    </Container>
  );
}

export default App;
