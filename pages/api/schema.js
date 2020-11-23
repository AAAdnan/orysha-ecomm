const { gql } = require('apollo-server');

const typeDefs = gql`
    type Product {
        id: ID!,
        name: String,
        description: String,
        price: String,
        size: String,
        image: String,
        gender: String,
        user: User
    }
    type ProductEdge {
        node: Product!
    }
    type ProductConnection {
        edges: [ProductEdge]!
        pageInfo: PageInfo!
    }
    type PageInfo {
        endCursor: String,
    }
    type User {
        id: ID!
        name: String!,
        email: String!
    }
    type AuthPayload {
        token: String!
        tokenExpiration: Int!
        userId: ID!
    }
    type Basket {
        id: ID!,
        user: User,
        items: [BasketItem],
        cost: Int
    }
    type BasketItem {
        product: Product,
        quantity: Int 
        price: Int
    }
    type Query {
        products(pageSize: Int, cursor: String, name:String, gender:String, id: Int ): ProductConnection!
        findUser: User
        users: [User]
        me: User
    }
    type Mutation {
        updateProduct(id: Int!, name: String!, description: String, price: String, size: String): Product
        addProduct(name: String!, description: String!, price: String!, size: String!, image: String!, gender: String!): Product
        deleteProduct(id: Int!): Product
        addItemToBasket(productId:String!, quantity: Int!): Basket
        signUpUser(email:String!, password: String!, name: String! ): AuthPayload
        loginUser(email: String!, password: String! ): AuthPayload
    }
`;

module.exports = typeDefs;

