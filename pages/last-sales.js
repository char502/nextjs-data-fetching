import { useEffect, useState } from 'react';
import useSWR from 'swr'

function lastSalesPage(props) {

  const [sales, setSales] = useState(props.sales);
  const [isLoading, setIsLoading] = useState(false);

  // useSWR returns an object wihich then then be immediately deconstructed
  const { data, error} = useSWR('https://nextjs-dummydata-default-rtdb.firebaseio.com/sales.json');

  useEffect(() => {

    setIsLoading(true);

    if (data) {
      const transformedSales = [];
      
      for (const key in data) {
        transformedSales.push({
          id: key,
          username: data[key].username,
          volume: data[key].volume
        })
      }
      setSales(transformedSales)
      setIsLoading(false);
    }
  }, [data])

  // useEffect(() => {
  //   setIsLoading(true);
  //   fetch('https://nextjs-dummydata-default-rtdb.firebaseio.com/sales.json')
  //   .then(response => response.json())
  //   .then(data => {


  //     console.log(data)

  //     // Transform from an object of objects to an array of objects
  //     const transformedSales = [];

  //     for (const key in data) {
  //         transformedSales.push({
  //           id: key,
  //           username: data[key].username,
  //           volume: data[key].volume
  //         })
  //     }
  //     setSales(transformedSales);
  //     setIsLoading(false);
  //   })
  // }, []);

  if (error) {
    return (
      <p>Failed to load</p>
    )
  }

  if (!data && !sales) {
    return (
      <p>Loading...</p>
    )
  }

  return (
    <div>
      <ul>
        {sales.map(sale => (
          <li key={sale.id}>{sale.username} - £{sale.volume}</li>
        ))}
      </ul>
    </div>
  )
}

export async function getStaticProps() {
  const response = await fetch(
    'https://nextjs-dummydata-default-rtdb.firebaseio.com/sales.json'
    )
    const data = await response.json();

      // Transform from an object of objects to an array of objects
      const transformedSales = [];

      for (const key in data) {
          transformedSales.push({
            id: key,
            username: data[key].username,
            volume: data[key].volume
        })
      }
        return {
          props: {
            sales: transformedSales
         }
        //  revalidate: 10
      }
}

export default lastSalesPage;
