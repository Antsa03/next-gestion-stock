import { useState } from "react";

export const useFetchData = <T>(url: string) => {
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data: T = await response.json();
        return data;
      } else {
        setError(new Error(`Error fetching data: ${response.statusText}`));
      }
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataById = async (id: string) => {
    try {
      const response = await fetch(url + id);
      if (response.ok) {
        const data: T = await response.json();
        return data;
      } else {
        setError(new Error(`Error fetching data: ${response.statusText}`));
      }
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, fetchData, fetchDataById };
};
