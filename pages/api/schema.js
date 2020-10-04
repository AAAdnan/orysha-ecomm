const { gql } = require('apollo-server');

const typeDefs = gql`
    type Product {
        id: ID!,
        name: String,
        description: String,
        price: String,
        size: String,
        user: User
    }
    type User {
        id: ID!
        name: String!,
        email: String!
    }
    type AuthPayload {
        token: String!
        tokenExpiration: Int!
        user: User
    }
    type Basket {
        id: ID!,
        user: User,
        items: [BasketItem],
        quantity: Int,
        displayPrice: Int
    }
    type BasketItem {
        product: Product,
        quantity: Int 
    }
    type Query {
        allProducts(first: Int): [Product]
        users: [User]
    }
    type Mutation {
        updateProduct(id: Int!, name: String!, description: String, price: String, size: String): Product
        addProduct(name: String!, description: String!, price: String!, size: String!): Product
        deleteProduct(id: Int!): Product
        createBasket: Basket
        #updateQuantity
        signup (email:String!, password: String!, name: String! ): AuthPayload
        login (email: String!, password: String! ): AuthPayload
    }
`;

module.exports = typeDefs;

