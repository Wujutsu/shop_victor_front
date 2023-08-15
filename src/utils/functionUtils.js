//Permet de convertir la data image en url pour la rendre visible
export const convertDataImg = (dataImg) => {
  // Convertir la chaîne de données d'image en un tableau d'octets
  const byteCharacters = atob(dataImg);

  // Convertir le tableau d'octets en un tableau d'octets sans signe
  const byteArray = new Uint8Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i);
  }

  // Créer un objet Blob à partir du tableau d'octets
  const blob = new Blob([byteArray], { type: "image/png" });

  // Créer une URL blob à partir de l'objet Blob
  const imgUrl = URL.createObjectURL(blob);

  // Définir l'URL blob en tant qu'état d'image
  return imgUrl;
};

//Format du tarif
export const formatTarif = (str) => {
  str = str.toString().replace(/,/g, ".");
  const parsedNumber = parseFloat(str);
  return parsedNumber.toFixed(2);
};

//Formatte numéro téléphone
export const formatPhoneNumber = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/\D/g, ""); // Supprime tous les caractères non numériques
  const match = cleaned.match(
    /^(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})$/
  );

  if (match) {
    const formattedNumber = `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
    return formattedNumber.trim();
  }

  return phoneNumber;
};
