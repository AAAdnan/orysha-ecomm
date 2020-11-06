import React, { useState, useEffect } from 'react';
import { CloudinaryContext, Image } from "cloudinary-react";
import { fetchPhotos, openUploadWidget } from "./api/CloudinaryService";
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import { useApolloClient } from '@apollo/client';
import { gql } from 'apollo-boost';
import Head from "next/head";
import Nav from '../components/Nav';
import Router from 'next/router';

export const getServerSideProps = async ctx => {

  const cookies = parseCookies(ctx)

  console.log(cookies)

  if(!cookies) return { props: { loggedIn: false } }

  if(cookies) return { props: { loggedIn: true } }
  
}


const add_product_mutation = gql `
mutation($name:String!, $description:String!, $price: String!, $size: String!, $image: String) {
    addProduct(name: $name, description: $description, price: $price, size: $size, image: $image) {
        name, description, image
    }
}`


const addProduct = (props) => {

    const apolloClient = useApolloClient()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [size, setSize] = useState('')
    const [images, setImages] = useState([]);
    const [image, setUrl] = useState([]);
    const [success, setSuccess ] = useState(false);

    const beginUpload = tag => {
      const uploadOptions = {
        cloudName: "dpenuk5fh",
        tags: [tag],
        uploadPreset: "bx0pyqii"
      };


      openUploadWidget(uploadOptions, (error, photos) => {
        if (!error) {
          if(photos.event === 'success'){
            setImages([...images, photos.info.public_id])
            setUrl(photos.info.url)
          }
        } else {
          console.log(error);
        }
      })

    }

    useEffect( () => {
      fetchPhotos("image", setImages);
    }, [])


    const submitForm = async (event) => {
        event.preventDefault()

        const data = await apolloClient.mutate(
            {
              mutation: add_product_mutation, variables : {
                name,
                description,
                price,
                size,
                image
              }
            }
          )

          

          setSuccess('success')

        //  Router.reload();
    }

    return (
    <>
    <Head>
      <title>Add Product</title>
      <link rel="icon" href="/orysha_template.jpg" />
      <script src="https://widget.cloudinary.com/v2.0/global/all.js" type="text/javascript"></script>
    </Head>
    <Nav loggedIn={props.loggedIn} />
    <CloudinaryContext cloudName="dpenuk5fh">
      <div className="flex items-center justify-center">
          <form className="mt-24" onSubmit={submitForm} >
              <h1 className="text-3xl text-center font-bold text-white mb-2">Add Product</h1>
              <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-name">
                  Name
                  </label>
                  <input onChange={event => setName(event.target.value)} value={name} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Cap" />
                  <p className="text-red-500 text-xs italic">Please enter a name</p>
              </div>
              <div className="w-full md:w-1/2 px-3">
                  <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
                  Price
                  </label>
                  <input onChange={event => setPrice(event.target.value)} value={price} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Doe" />
                  <p className="text-red-500 text-xs italic">Please enter a price</p>
              </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-description">
                  Description
                  </label>
                  <input onChange={event => setDescription(event.target.value)} value={description} class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="description" placeholder="******************" />
                  <p className="text-gray-600 text-xs italic">Please enter a description</p>
              </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                    Size
                    </label>
                    <input onChange={event => setSize(event.target.value)} value={size} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Cap" />
                    <p className="text-red-500 text-xs italic">Please enter a size</p>
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <input class="form-input mt-8" type="file" name="inpFile" id="inpFile" hidden="hidden" accept="image/*" />
                  <button type="button" onClick={() => beginUpload()} id="custom-button" class="py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">Choose a file</button>
                  <span id="custom-text">No file chosen</span>
                  <section class="m-8 justify-center">
                    {images.map(i => <Image
                      key={i}
                      publicId={i}
                      fetch-format="auto"
                      quality="auto"
                      />)}
                    </section>
                </div> 
              </div>
              <div className="mt-6">
              <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                Submit
              </button>
            </div>
          </form>
        </div>
        {success && <div class='success-message'>Success! Thank you for registering</div>}
      </CloudinaryContext>
    
    </>
    )
}

export default addProduct;
