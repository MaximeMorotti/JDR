import "dotenv/config";
import { creerApp } from "./app";

const port = 3000;

creerApp().listen(port, () => {
  console.log(`Serveur JDR — prêt sur http://localhost:${port}`);
});
