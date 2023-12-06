import Person from "@/components/Person/Person";
import { UserProfile } from "@/datatypes/userProfile";
import { Stack } from "@mantine/core";
import Link from "next/link";
import styles from "./personlist.module.css";

export interface PersonListProps {
  persons: UserProfile[];
}

export default function PersonList({ persons }: Readonly<PersonListProps>) {
  return (
    <Stack>
      {persons.map((f) => (
        <Link href={`app/profile/${f.id}`} key={f.id} className={styles.link}>
          <Person
            name={f.name || ""}
            realName={f.realName || undefined}
            image={f.image || undefined}
          />
        </Link>
      ))}
    </Stack>
  );
}
