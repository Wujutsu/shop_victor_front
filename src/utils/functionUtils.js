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

//Remplace les "," par des "."
export const replaceCommaWithDot = (string) => {
  return string.replace(/,/g, ".");
};
