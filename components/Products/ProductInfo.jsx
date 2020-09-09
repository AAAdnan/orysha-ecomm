import { gql, useQuery, useMutation } from '@apollo/client';

const GET_PRODUCT_DETAILS = gql `
    query {
        product {
            product_id,
            name,
            description,
            price,
            size,
            user_id
        }
    }
`

const SET_PRODUCT_DETAILS = gql`
mutation UpdateProduct($name: String!, $description:String!) {
    updateProduct(name: $name, description: $description) {
        name, 
        description
    }
}
`;

const ProductInfo = () => {
    const { loading, error, data} = useQuery(GET_PRODUCT_DETAILS);

    const updateCache = (cache, { data: { updateProduct  }}) => {
        const existingProduct = cache.readQuery({
            query: GET_PRODUCT_DETAILS,
        });

        cache.writeQuery({
            query: GET_PRODUCT_DETAILS,
            data: { product: updateProduct },
        });
    };

    const [updateProduct] = useMutation(SET_PRODUCT_DETAILS, { update: updateCache });

    if(loading) return <p>Loading...</p>;
    if(error) return <p>Error :(</p>;

        const updateProductDetails = () => {
            updateProduct({
                variables: { name: 'Trousers', description: 'a pair of trousers' }
            })
        };

        return (
            <div>
                <p>
                    {data.product.name} - {data.product.description}
                </p>
                <button onClick={updateProductDetails}>Update Product</button>
            </div>
        );
};

export default ProductInfo;
