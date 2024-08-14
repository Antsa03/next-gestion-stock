import { useState } from "react";

export const useUpdate = <T>(url: string, onSuccess?: () => void) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error>();
  const [data, setData] = useState<T>();
  let jsonData;

  const handleUpdate = async (data: T) => {
    setIsUpdating(true);
    try {
      const response = await fetch(url, {
        method: "PUT",
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
      }
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsUpdating(false);
    }
  };

  return { isUpdating, error, data, handleUpdate };
};
