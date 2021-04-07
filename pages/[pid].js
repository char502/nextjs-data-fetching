
import { Fragment } from 'react';

import path from 'path';
import fs from 'fs/promises';

function ProductDetailPage(props) {

const { loadedProduct } = props;

  if (!loadedProduct) {
    return (
      <p>Loading...</p>
    )
  }

  return (
    <Fragment>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </Fragment>
  )
}

async function getData() {
  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  const jsonData = await fs.readFile(filePath)
  const data = JSON.parse(jsonData)

  return data;
}

export async function getStaticProps(context) {

  const { params } = context;
  // console.log(params)

  const productId = params.pid;
  // console.log(productId)

  const data = await getData();
  // console.log(data.products)

  const product = data.products.find(product => product.id === productId);
  // console.log(product)

  // Want to return true if the ID of the product we're currently looking at in that array is equal to the product id have here in our parameters
  // If this is equal, know that this is the product we need for this component

  // if fail to find a product for a given id
  if (!product) {
    return (
      { notFound : true }
    )
  }

  return {
    props: {
      loadedProduct: product
    },
    revalidate: 10
  };
}

// for dynamic paths that need to be pre-generated
export async function getStaticPaths() {

  const data = await getData();

  const ids = data.products.map((product) => product.id);
  // console.log(ids)

  const pathsWithParams = ids.map((id) => ({ params: {'pid': id} }));
  // console.log(pathsWithParams)

  // This puts the data in the same format as the dummy-backend.json file which is more realistic as are unlikely to hard code all supported values ahead of time as won't know what they are 
  // But would fetch them from the same data source as the actual data so emulate the same shape as that data

  return {
    paths: pathsWithParams,
    fallback: true
  };
}

export default ProductDetailPage;