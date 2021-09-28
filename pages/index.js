// path is another node.js module; help for building paths
import path from 'path';
// this imports the file system module from Node.js
// (one of core) Node.js modules
// would fail if tried to use it on the client side
// will also be stripped out of the client side code bundle
import fs from 'fs/promises';

import Link from 'next/link';

function HomePage(props) {
  const { products } = props;

  // console.log(products)

  return (
    <ul>
      <p>this is a test</p>
      {products.map((product) => (
        <li key={product.id}>
          <Link href={`/products/${product.id}`}>{product.title}</Link>
        </li>
      ))}
    </ul>
  );
}

export async function getStaticProps(context) {
  // can only use on page component files
  // need to export it to make NextJS aware of it
  // executes when build your project (with Next build)
  // can be an issue for data constantly changing (will become outdated quickly)
  // would need to use useEffect for when any data changes/ fetching updated data from a server
  // however, can use Incremental Static Generation (ISR)

  // With the developement server, will always see the latest page with the latest data
  // So if re load this page this console.log will show each time to prove that is happening
  // It will ignore the revalidate/ISR, it will run every time
  console.log('(Re-)Generating...');

  // ==============
  // context object
  // with GSP get a context parameter,
  // get dynamic params/path segments/values
  // ==============

  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  // This builds an absolute path to the file: 'dummy-backend...'
  // process object is globally available in node.js
  // process.cwd refers to the current working directory of this code file when it is executed
  // this cwd will not be the pages folder
  // when this file is executed, Next.js will be executing it
  // Next.js will treat all the files as if they sit in the root project folder
  // so cwd in this case will be the overall project folder instead of the pages folder

  // fs.readFileSync()
  // synchronously reads a file and blocks app/file execution until it's done

  const jsonData = await fs.readFile(filePath);
  // readFile needs a callBack to continue
  //when use fs from 'fs/promises', readFile returns a promise
  // as this is an async function (as defined above) can then await this
  // then just needs a path to the file want to read

  const data = JSON.parse(jsonData);
  // JSON is a globally available object (just as it is on the browser side)
  // JSON.parse - reads the data and converts it into a regular js object

  // console.log(data.products)

  // ===============================
  // Not found example
  // ===============================
  if (data.products.length === 0) {
    return { notFound: true };
  }

  // ===============================
  // Redirect example
  // ===============================
  // if (!data) {
  //   return {
  //     redirect: {
  //       destination: '/no-data'
  //     }
  //   }
  // }

  return {
    props: {
      products: data.products
    },
    // This enables Incremental Static Generation (ISR)
    // the number is the time in seconds that NextJS should wait until it regenerates the page
    // for development the page will be regenerated for every request no matter what is entered here
    // so with the developement server, will always see the latest page with the latest data
    // In production, this number will matter
    revalidate: 10

    // ============================================
    // also get other keys:
    // -----------
    // notFound: expects a boolean value
    // -----------
    // if true, will render the 404 error page instead of the normal page
    // can possibly use it if there's no data to fetch (as per example above)
    // -----------
    // redirect
    // useful option if something goes wrong with fetching your data
    // ============================================
  };
}
// with this function, always need to return an object with a props key
// this exposes data, through props, to the main component (HomePage in this example)
// The data should be an object

// The server side code doesen't actually run on the server, serving the application, it runs on the local machine when running the NextJs build script

export default HomePage;
