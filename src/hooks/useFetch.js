import { useEffect, useState } from "react";

export default function useFetch(url,mode,method,headers) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function requestFetch() {
      try {
        setLoading(true)
        setError(false)
        const response = await fetch(url, {
          mode:mode,
          method: method || "GET",
          headers: headers,
        })
        const data = await response.json()
        setLoading(false)
        setResult(data)
      } catch (err) {
        console.log(err)
        setLoading(false)
        setError(true)
      }
    }
    requestFetch()
  },[url,headers,mode,method])

  return {
    loading,
    error,
    result,
  }
}
