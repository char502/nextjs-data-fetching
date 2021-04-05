
import { Fragment } from 'react';

import path from 'path';
import fs from 'fs/promises';

function ProductDetailPage(props) {

const { loadedProduct } = props;

  return (
    <Fragment>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </Fragment>
  )
}

export async function getStaticProps(context) {

  const { params } = context;

  const productId = params.pid;
  console.log(productId)

  const filePath = path.join(process.cwd(), 'data', 'dummy-backend, json');
  const jsonData = await fs.readFile(filePath)
  const data = JSON.parse(jsonData)

  const product = data.products.find(product => product.id === productId);

  // Want to return true if the ID of the product we're currently looking at in that array is equal to the product id have here in our parameters
  // If this is equal, know that this is the product we need for this component

  return {
    props: {
      loadedProduct: product
    },
    revalidate: 10
  };
}

export default ProductDetailPage;