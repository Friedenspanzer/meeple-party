import { notifications } from "@mantine/notifications";

interface Error {
  title?: string;
  message: string;
}

export function showError(error: Error) {
  notifications.show({
    title: error.title || "Something went wrong.",
    message: error.message,
    color: 'red.8'
  });
}
