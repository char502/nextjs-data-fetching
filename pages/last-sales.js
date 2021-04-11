import { useEffect, useState } from 'react';
import useSWR from 'swr'

function lastSalesPage() {

  // const [sales, setSales] = useState();
  // const [isLoading, setIsLoading] = useState(false);

  // useSWR returns an object wihich then then be immediately deconstructed
  const { data, error} = useSWR('https://nextjs-dummydata-default-rtdb.firebaseio.com/sales.json');


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

  if (!data) {
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

export default lastSalesPage;
