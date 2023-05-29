"use client";

import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";
import styles from "./Slogan.module.css";

export default function Slogan() {
  const [index, setIndex] = useState<number>();

  const newSlogan = (currentIndex: number | undefined) => {
    clearSelection();
    let newIndex = currentIndex;
    while (newIndex === currentIndex) {
      newIndex = Math.floor(Math.random() * slogans.length);
    }
    setIndex(newIndex);
  };

  const slogan = useMemo(
    () => (index !== undefined ? slogans[index] : undefined),
    [index]
  );

  useEffect(() => newSlogan(undefined), []);

  return (
    <h2
      className={classNames("display-6", styles.slogan)}
      dangerouslySetInnerHTML={{ __html: slogan || "" }}
      onClick={() => newSlogan(index)}
    ></h2>
  );
}

const slogans = [
  "When your friend&apos;s collections keep growing.",
  "Spend more time playing, less time browsing.",
  "Please send a Pull request with more slogans.",
  "Share a virtual shelf with your friends.",
  "Yet another place to make an inventory of your games.",
  "Play with the filtering options all day.",
  "MÖRKRET",
  "The place to not talk about games with strangers.",
  "There's not enough purple on the internet.",
  "It's free!",
  "Unclench your jaw.",
] as const;

function clearSelection() {
  window.getSelection()?.removeAllRanges();
}
