import classNames from "classnames";
import Image from "next/image";
import { CSSProperties } from "react";
import styles from "./avatar.module.css";

export default function Avatar({
  image,
  name,
  className,
  style,
}: {
  image?: string | null;
  name: string;
  className?: string;
  style?: CSSProperties;
}) {
  if (!!image) {
    return (
      <Image
        src={image}
        width="40"
        height="40"
        alt={!!name ? name : "User avatar"}
        className={classNames([styles.image, className])}
        style={style}
        unoptimized
        referrerPolicy="no-referrer"
      />
    );
  } else {
    const color = getColor(name);
    return (
      <div
        className={classNames([styles.dummy, className])}
        style={{
          ...style,
          backgroundColor: `rgb(${color[0]},${color[1]},${color[2]})`,
        }}
      >
        {name[0]}
      </div>
    );
  }
}

function getColor(name: string) {
  const hash = hashCode(name);
  const r = (hash & 0xff0000) >> 16;
  const g = (hash & 0x00ff00) >> 8;
  const b = hash & 0x0000ff;
  return [r, g, b];
}

function hashCode(str: string): number {
  var h: number = 0;
  for (var i = 0; i < str.length; i++) {
    h = (h + 6700417 * str.charCodeAt(i)) & 0xffffff;
  }
  return h;
}
