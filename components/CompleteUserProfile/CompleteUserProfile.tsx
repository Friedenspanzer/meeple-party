"use client";

import { UserProfile } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./CompleteUserProfile.module.css";
import Image from "next/image";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

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
        name: username,
        realName: realName,
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
      <h2>Complete your user profile</h2>
      <p>
        Hi there! 👋 Sorry to interrupt, but we still need some information from
        you.
      </p>
      <Form className="container-sm row row-cols-3">
        <Form.Group controlId="completeUserProfileName" className="col">
          <Form.Label>Display name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Display name"
            value={username}
            onChange={(e) => {
              setUserName(e.currentTarget.value);
            }}
            disabled={updating}
          />
          <Form.Text className="text-muted">
            What you will be publicly known as
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="completeUserProfileRealName" className="col">
          <Form.Label>Real name (optional)</Form.Label>
          <Form.Control
            type="text"
            placeholder="Display name"
            value={!!realName ? realName : ""}
            onChange={(e) => {
              setRealName(e.currentTarget.value);
            }}
            disabled={updating}
          />
          <Form.Text className="text-muted">
            Only shown to your friends
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="completeUserProfileEmail" className="col">
          <Form.Label>E-Mail address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            disabled
            value={userProfile.email}
          />
        </Form.Group>
      </Form>
      <Button onClick={sendCurrentData} disabled={updating}>
        {updating ? <><Spinner animation="grow" size="sm" />Sending ...</> : "Submit"}
      </Button>
    </>
  );
}
