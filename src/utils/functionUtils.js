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
  const blob = new Blob([byteArray], { type: "image/jpeg" });

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

//Formatteur timestamp
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const realMonth = [
    "Janv.",
    "Févr.",
    "Mars",
    "Avr.",
    "Mai",
    "Juin",
    "Juil.",
    "Août",
    "Sept.",
    "Oct.",
    "Nov.",
    "Déc.",
  ];

  return `${day} ${realMonth[month]} ${year} à ${hours}:${minutes}`;
};
