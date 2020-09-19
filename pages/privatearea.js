import React from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { gql } from 'apollo-boost'
import { Query } from 'react-apollo'

const PrivateArea = () => {
    if (!Cookies.get('signedin')) {
        router.push('/')
    }

    return (
        <div>
          <Query
            query={gql`
              {
                products {
                  id
                  name
                }
              }
            `}
          >
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>
              if (error) {
                navigate('/')
                return <p></p>
              }
              return <ul>{data.todos.map(item => <li key={item.id}>{item.name}</li>)}</ul>
            }}
          </Query>
        </div>
      )
}

export default PrivateArea