import InvitationStage from "./components/InvitationStage";

// Enlace de ubicacion del evento (abre en pestana nueva, solo desde el boton).
const MAPS_URL = "https://maps.app.goo.gl/zhxMEY4R3L6mgZc9A";

const EVENT = {
  guestName: "Mia Isabella Rangel Cárdenas",
  eyebrow: "Estás invitad@ a la celebración de",
  date: "Te esperamos este 14 de julio",
  time: "Hora: 4:00 pm",
  highlight: "¡No faltes!",
  extra: "¡Lluvia de sobres!",
  mapsUrl: MAPS_URL,
} as const;

export default function Home() {
  return <InvitationStage event={EVENT} />;
}
