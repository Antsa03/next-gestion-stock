import { showSwal } from "@/lib/showSwal";
import { useState } from "react";
import Swal from "sweetalert2";

export const useDelete = (url: string, onSuccess?: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error>();

  const handleDelete = async (id: string | number) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimez-le!",
      cancelButtonText: "Non, annulez!",
      // customClass: "custom-alert",
    });
    setIsDeleting(true);
    if (result.isConfirmed) {
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        if (response.ok) {
          showSwal(
            "Supprimé!",
            "Suppression effectuée avec succès.",
            "success"
          );
          if (onSuccess) onSuccess();
          // Optionnel: Rafraîchir la page ou rediriger après la suppression
        } else {
          setError(
            new Error(`Erreur lors de la suppression: ${response.statusText}`)
          );
          showSwal("Annulé", "Echec de la suppression!", "error");
        }
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return { isDeleting, error, handleDelete };
};
