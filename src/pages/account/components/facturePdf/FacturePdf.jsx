import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "../../../../assets/logo.jpg";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
    fontSize: 12,
  },
  section: {
    marginTop: 20,
  },
  image: {
    width: 60,
    height: 60,
    marginLeft: -8,
    marginTop: -10,
  },
  logoText: {
    color: "#76aa70",
    marginTop: -36,
    marginLeft: 50,
    marginBottom: 20,
    fontSize: 15,
  },
  colorGreen: {
    color: "#76aa70",
    fontSize: 15,
    marginTop: 5,
    marginBottom: 8,
  },
  textCenter: {
    textAlign: "center",
  },
  textRight: {
    textAlign: "right",
  },
  table: {
    display: "table",
    width: "auto",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCellHeader: {
    backgroundColor: "#D1D1D1",
    borderWidth: 1,
    borderColor: "#fff",
    padding: 8,
    textAlign: "center",
    width: 140,
  },
  tableCellHeaderProd: {
    backgroundColor: "#D1D1D1",
    borderWidth: 1,
    borderColor: "#fff",
    padding: 8,
    textAlign: "center",
    width: 380,
  },
  tableCell: {
    backgroundColor: "#EFEEEE",
    borderWidth: 1,
    borderColor: "#fff",
    padding: 8,
    width: 140,
  },
  tableCellProd: {
    backgroundColor: "#EFEEEE",
    borderWidth: 1,
    borderColor: "#fff",
    padding: 8,
    width: 380,
  },
  marginTop: {
    marginTop: 5,
  },
  tableCellHidden: {
    backgroundColor: "#fff",
    borderColor: "#fff",
    width: 380,
  },
  tableCellBig: {
    backgroundColor: "#D1D1D1",
    borderWidth: 1,
    borderColor: "#fff",
    padding: 8,
    width: 280,
    textAlign: "right",
  },
});

const FacturePdf = ({ order }) => {
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalDelivry, setTotalDelivry] = useState(0);

  useEffect(() => {
    let totalProductTemp = 0;
    order.productList.forEach((prod) => {
      totalProductTemp += prod.quantity * prod.price;
    });

    setTotalProduct(totalProductTemp);
    setTotalDelivry(order.delivery.price);

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image style={styles.image} src={logo} />
        <Text style={styles.logoText}>M&C Fabric</Text>

        <Text style={styles.section}>
          Merci d'avoir passé commande chez M&C Fabric !
        </Text>

        <View style={styles.section}>
          <Text style={styles.colorGreen}>Informations</Text>
          <Text>Nom: {order.address.identity}</Text>
          <Text style={styles.marginTop}>
            Adresse: {order.address.number} {order.address.address},{" "}
            {order.address.codePostal} {order.address.city}
          </Text>
          <Text style={styles.marginTop}>Email: {order.email}</Text>
          <Text style={styles.marginTop}>Téléphone: +{order.phoneNumber}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.colorGreen}>Détails de la commande</Text>
        </View>
        <Text>Commande passée le {order.orderDate}</Text>
        <Text style={styles.marginTop}>Mode de paiement: Carte bancaire</Text>
        <View style={styles.section}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellHeaderProd}>Produit</Text>
              <Text style={styles.tableCellHeader}>Prix unitaire</Text>
              <Text style={styles.tableCellHeader}>Quantité</Text>
              <Text style={styles.tableCellHeader}>Prix total</Text>
            </View>
            {order.productList.map((product, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCellProd}>
                  <Text style={styles.textCenter}>{product.name}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.textRight}>
                    {product.price.toFixed(2)} €
                  </Text>
                </View>

                <View style={styles.tableCell}>
                  <Text style={styles.textCenter}>{product.quantity}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.textRight}>
                    {parseFloat(product.price * product.quantity).toFixed(2)} €
                  </Text>
                </View>
              </View>
            ))}
            <View style={styles.marginTop}>
              <View style={styles.tableRow}>
                <View style={styles.tableCellHidden}></View>
                <View style={styles.tableCellBig}>
                  <Text style={styles.textRight}>Total produits</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.textRight}>
                    {totalProduct.toFixed(2)} €
                  </Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCellHidden}></View>
                <View style={styles.tableCellBig}>
                  <Text style={styles.textRight}>Frais d'expédition</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.textRight}>
                    {totalDelivry.toFixed(2)} €
                  </Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCellHidden}></View>
                <View style={styles.tableCellBig}>
                  <Text style={styles.textRight}>Total payé</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.textRight}>
                    {(totalProduct + totalDelivry).toFixed(2)} €
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default FacturePdf;
