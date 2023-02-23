"use client";

import { Game } from "@/datatypes/game";
import { Card } from "primereact/card";

export default function GameBox(props: { game: Game }) {
  const { game } = props;
  return (
    <Card title={game.name} subTitle={game.year}>
    </Card>
  );
}
