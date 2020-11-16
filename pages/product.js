import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
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

  if(!cookies) return { props: { loggedIn: false } }

  if(cookies) return { props: { loggedIn: true } }
  
}


const add_product_mutation = gql `
mutation($name:String!, $description:String!, $price: String!, $size: String!, $image: String!, $gender: String!) {
    addProduct(name: $name, description: $description, price: $price, size: $size, image: $image, gender: $gender ) {
        name, description, image, gender
    }
}`


const addProduct = (props) => {

    const apolloClient = useApolloClient()

    const { register, handleSubmit, errors } = useForm();

    const [images, setImages] = useState([]);
    const [image, setUrl] = useState([]);

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

    const onSubmit = async (data) => {

      const { name, description, price, size, gender }  = data

      const add_product = await apolloClient.mutate(
        {
          mutation: add_product_mutation, variables : {
            name,
            description,
            price,
            size,
            image,
            gender
          }
        }
      )

     Router.reload();

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
      <div className="container lg:w-1/2 mx-auto flex items-center justify-center border-solid border-4 border-orange-600 pb-8 mt-16">
          <form className="mt-24" onSubmit={handleSubmit(onSubmit)} >
              <h1 className="text-3xl text-center font-bold text-white mb-2 pb-8">Add Product</h1>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-name">
                    Name
                    </label>
                    <input ref={register({ required: true })} name="name" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Cap" />
                    {errors.name && (<p className="font-bold text-red-900">Name is required</p>)}
                </div>
                <div className="w-full md:w-1/2 px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
                    Price (£)
                    </label>
                    <input ref={register( { required: true })} name="price" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="2" />
                    {errors.price && (<p className="font-bold text-red-900">Price is required</p>)}
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-description">
                    Description
                    </label>
                    <input ref={register( { required: true })} name="description" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="description" placeholder="******************" />
                    {errors.description && (<p className="font-bold text-red-900">Description is required</p>)}
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                    Size
                    </label>
                    <input ref={register()} name="size" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="1" />
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                    Gender
                    </label> 
                    <select ref={register()} name="gender" onChange={event => setGender(event.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" >
                      <option value="M">M</option>
                      <option value="F">F</option>
                    </select>
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <input ref={register()} class="form-input mt-8" type="file" name="inpFile" id="inpFile" hidden="hidden" accept="image/*" />
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
      </CloudinaryContext>
    </>
    )
}

export default addProduct;
