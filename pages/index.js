import path from 'path';
// path is another node.js module; help for building paths
import fs from 'fs/promises';
// this imports the file system module from Node.js
import Link from 'next/link';

function HomePage(props) {

  const { products } = props;

  // console.log(products)

  return (
    <ul>
      <p>this is a test</p>
      {products.map(product => (
        <li key={product.id}>
          <Link href={`/products/${product.id}`}>
            {product.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export async function getStaticProps() {

  console.log('(Re-)Generating...')

  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  // This builds an absolute path to the file: 'dummy-backend...'

  // fs.readFileSync()
  // synchronously reads a file and blocks app/file execution until it's done

  const jsonData = await fs.readFile(filePath)
  // readFile needs a callBack to continue
  //when use fs from 'fs/promises', readFile returns a promise
  // as this is an async function (as defined above) can then await this
  // then just needs a path to the file want to read

  const data = JSON.parse(jsonData)
  // JSON.parse - reads the data and converts it into a regular js object

  // console.log(data.products)

  return { 
    props: {
      products: data.products
    },
    revalidate: 10
  }
}
// with this function, always need to return an object with a props key
// this exposes data, through props, to the main component (HomePage in this example)
// The data should be an object

export default HomePage;
