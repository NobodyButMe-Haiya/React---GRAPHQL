import { gql } from '@apollo/client';

export const GET_PERSONS = gql`
  {
    getPersons {
      personId,
      name,
      age
    }
  }
`;

export const GET_PERSON_BY_ID = gql`
  query ($id: Int){
    getPerson(personId: $id) {
      personId,
      name,
      age
    }
  }
`;

export const CREATE_PERSON = gql`
  mutation($name: String, $age: Int) {
    createPerson (name: $name, age: $age)
  }
`;

export const UPDATE_PERSON = gql`
  mutation($personId: Int, $name:String,$age:Int) {
    updatePerson (personId: $personId, name: $name, age: $age)
  }
`;

export const DELETE_PERSON = gql`
  mutation($personId: Int) {
    deletePerson(personId: $personId)
  }
`