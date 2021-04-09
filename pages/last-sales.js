
import { useEffect, useState } from 'react';

function lastSalesPage() {

  const [sales, setSales] = useState();
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    setIsLoading(true);
    fetch('https://nextjs-dummydata-default-rtdb.firebaseio.com/sales.json')
    .then(response => response.json())
    .then(data => {


      console.log(data)

      // Transform from an object of objects to an array of objects
      const transformedSales = [];

      for (const key in data) {
          transformedSales.push({
            id: key,
            username: data[key].username,
            volume: data[key].volume
          })
      }
      setSales(transformedSales);
      setIsLoading(false);
    })
  }, []);

console.log(sales)

  return (
    <div>
      <ul>
        <li></li>

      </ul>
    </div>
  )
}

export default lastSalesPage;
