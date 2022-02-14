import { gql } from 'apollo-boost';

export const GET_PERSONS = gql`
  {
    getPersons {
      id,
      name,
      age
    }
  }
`;

export const GET_PERSON_BY_ID = gql`
  query ($id: Int){
    getPerson(personId: $id) {
      id,
      name,
      age
    }
  }
`;

export const CREATE_PERSON = gql`
  mutation($name: String, $age: Int) {
    createUser (name: $name, age: $age)
  }
`;

export const UPDATE_PERSON = gql`
  mutation($id: Int, $name:String,$age:Int) {
    updatePerson (personId: $id, name: $name, age: $age)
  }
`;

export const DELETE_PERSON = gql`
  mutation($id: Int) {
    deleteUser(personId: $id)
  }
`