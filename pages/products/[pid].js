import { Fragment } from 'react';

import path from 'path';
import fs from 'fs/promises';

function ProductDetailPage(props) {
  const { loadedProduct } = props;

  if (!loadedProduct) {
    return <p>Loading...</p>;
  }

  return (
    <Fragment>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </Fragment>
  );
}

// if use useEffect, there will be no data there when the page is initially rendered
// so search engines wouldn't see it

async function getData() {
  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  return data;
}

export async function getStaticProps(context) {
  const { params } = context;
  // console.log(params); // this returns an object,
  // an example, value may be p1, p2 pr p3 { pid: 'p2' }

  const productId = params.pid;
  // console.log(productId); // example, value may be p1, p2 pr p3
  // can also extract params in the useRouter hook inside the component
  // when extract params in the component function, can use them inside the component
  // for example, use extracted id to send the request to some back end server to fetch
  // data from there
  // but that would only happen in the browser
  // =========================================
  // If want to pre-render a page (with the help of Get Static Props) then need to do
  // this on the server
  // Get Static Props runs before the component runs so use this way of extracting params
  // before the page renders

  const data = await getData();
  // console.log(data.products)

  const product = data.products.find((product) => product.id === productId);
  // console.log(product)

  // Want to return true if the ID of the product we're currently looking at in that array is equal to the product id have here in our parameters
  // If this is equal, know that this is the product we need for this component

  // if fail to find a product for a given id
  if (!product) {
    return { notFound: true };
  }

  return {
    props: {
      loadedProduct: product
    },
    revalidate: 10
  };
}

// NextJs pre generates pages by default
// This is not the case if you have a [dynamic] page like this one
// Then the default behaviour is to not pre generate the page
// because it is a dynamic page so technically may repesent many possible pages
// Next doesn't know in advance which one you are going to want
// Therefore NextJS always generates them 'Just in time' on the server (once it knows which one you want)
// ===========================================================
// For dynamic routes, have to give NextJs more information
// Therefore have to use the following
// for dynamic paths that need to be pre-generated

// This tells NextJS which paths/instances of a dynamic page should be pre-generated
export async function getStaticPaths() {
  // need to export GSPaths to make NextJS aware of it
  // Like GSP and GSSP, can only use GSP on page component files
  const data = await getData();

  const ids = data.products.map((product) => product.id);
  // console.log(ids);

  const pathsWithParams = ids.map((id) => ({ params: { pid: id } }));
  // console.log(pathsWithParams);

  // This puts the data in the same format as the dummy-backend.json file which is more realistic as are unlikely to hard code all supported values ahead of time as won't know what they are
  // But would fetch them from the same data source as the actual data so emulate the same shape as that data

  return {
    paths: pathsWithParams,
    // fallback is helpful if have a lot of pages that would need to be pre generated
    // i.e. Amazon, may have thousands of pages
    // pre rendering them all might not be optimal
    // fallback: true, tells NextJS that even pages that are not listed here
    // can be valid when they are visited
    // they are just not pre-generated, just generated JIT when a request reaches the server
    // still need to prepare a fallback state in your component
    // i.e.
    // if (!loadedProduct) {
    //   return <p>Loading...</p>;
    // }
    // an alternative would be to set fallback to a string with a value of 'blocking'
    // Then don't need to fallback check
    // because then NextJs will wait for the page to be fully generated on the server
    // before the server serves that
    // this will take a little bit longer for the visitor to the page to get a response
    // but the response that is sent back, will be finished
    // then just need to decide which approach need to take, whether need something
    // quickly on the page for the user or it's ok to wait
    fallback: true
  };
}

export default ProductDetailPage;
