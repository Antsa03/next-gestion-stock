import { useState } from "react";

export const useCreate = <T>(
  url: string,
  onSuccess?: () => void,
  onError?: () => void
) => {
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<Error>();
  const [data, setData] = useState<T>();
  let jsonData;

  const handleAdd = async (data: T) => {
    setIsAdding(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        jsonData = await response.json();
        setData(jsonData);
        if (onSuccess) onSuccess();
        // Optionnel: Rafraîchir la page ou rediriger après l'ajout
      } else {
        setError(new Error(`Erreur lors de l'ajout: ${response.statusText}`));
        if (onError) onError();
      }
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsAdding(false);
    }
  };

  return { isAdding, error, data, handleAdd };
};
