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
        quantity: Int,
        items: [BasketItem],
        status: String,
        cost: Int
        chargeId: String
        date: String
    }
    type BasketItem {
        id: ID,
        product: Product,
        basket_quantity: Int,
        name: String,
        description: String,
        size: Int,
        image: String,
        price: Int,
    }
    type Order {
        orderId: String!
    }
    type Query {
        products(pageSize: Int, cursor: String, name:String, gender:String, id: Int ): ProductConnection!
        findUser: User
        findGuest: Basket
        users: [User]
        basket(id: ID, user: Int, cost: Int, quantity: Int, status: String): Basket
        order(id: ID): Basket
    }
    enum BasketItemOperations {
        INCREMENT, DECREMENT, RESET, REMOVE
    }
    type Mutation {
        updateProduct(id: Int!, name: String!, description: String, price: String, size: String): Product
        addProduct(name: String!, description: String!, price: String!, size: String!, image: String!, gender: String!): Product
        deleteProduct(id: Int!): Product
        addItemToBasket(productId:String!, quantity: Int, id: String ): Basket
        changeItemQuantityBasket(id:ID, direction: Boolean): BasketItem
        updateBasketItem(id:ID!, operation: BasketItemOperations! ): BasketItem
        removeItemFromBasket(id:ID): BasketItem
        signUpUser(email:String!, password: String!, name: String! ): AuthPayload
        loginUser(email: String!, password: String! ): AuthPayload
        checkoutBasket(id: ID, token: String!) : Order
    }
`

module.exports = typeDefs;

