"use client";

import { UserProfile } from "@prisma/client";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./CompleteUserProfile.module.css";

export interface CompleteUserProfileProps {
  userProfile: UserProfile;
  onUserProfileComplete: (userProfile: UserProfile) => void;
}

export default function CompleteUserProfile(props: CompleteUserProfileProps) {
  const { userProfile, onUserProfileComplete } = props;
  const [username, setUserName] = useState(userProfile.name);
  const [realName, setRealName] = useState(userProfile.realName || "");

  const [updating, setUpdating] = useState(false);

  const router = useRouter();

  const sendCurrentData = () => {
    setUpdating(true);
    fetch("/api/database/activeUserProfile", {
      method: "POST",
      body: JSON.stringify({
        email: userProfile.email,
        name: userProfile.name,
        realName: userProfile.realName,
        picture: userProfile.picture,
      }),
    })
      .then((value) => value.json())
      .then((value) => {
        onUserProfileComplete(value);
      });
  };

  //TODO Input sanitation and validation

  return (
    <>
      <Card title="Complete your user Profile">
        <p>
          Hi there! 👋 Sorry to interrupt, but we still need some information
          from you.
        </p>
        <div className={styles.formContainer}>
          <div className="p-float-label">
            <InputText
              id="email"
              value={userProfile.email}
              disabled
              size={40}
            />
            <label htmlFor="email">E-Mail address</label>
          </div>
          <div className="p-float-label">
            <InputText
              id="username"
              value={username}
              onChange={(e) => {
                setUserName(e.currentTarget.value);
              }}
              size={40}
            />
            <label htmlFor="username">Display name</label>
          </div>
          <div className="p-float-label">
            <InputText
              id="realName"
              value={realName}
              onChange={(e) => {
                setRealName(e.currentTarget.value);
              }}
              size={40}
            />
            <label htmlFor="username">Real name</label>
          </div>
          {!!userProfile.picture && (
            <Avatar image={userProfile.picture} size="large" />
          )}
        </div>
        <Button
          label="Submit"
          icon="pi pi-check"
          loading={updating}
          onClick={sendCurrentData}
        />
      </Card>
    </>
  );
}
