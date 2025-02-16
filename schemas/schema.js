const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Upload

  type Employee {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    gender: String!
    position: String!
    salary: Float!
    joinDate: String!
    department: String!
    profileImage: String
  }

  type User {
    id: ID!
    username: String!
    email: String!
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Query {
    getAllEmployees: [Employee]
    findEmployeeById(id: ID!): Employee
    findEmployeesByPositionOrDepartment(position: String, department: String): [Employee]
    
    # ✅ Moved login to Query instead of Mutation
    login(email: String!, password: String!): AuthPayload
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): User
    addEmployee(
      firstName: String!,
      lastName: String!,
      email: String!,
      gender: String!,
      position: String!,
      salary: Float!,
      joinDate: String!,
      department: String!,
      profileImage: Upload
    ): Employee
    updateEmployee(
      id: ID!,
      firstName: String,
      lastName: String,
      email: String,
      gender: String,
      position: String,
      salary: Float,
      joinDate: String,
      department: String,
      profileImage: Upload
    ): Employee
    removeEmployee(id: ID!): String
  }
`;

module.exports = typeDefs;
