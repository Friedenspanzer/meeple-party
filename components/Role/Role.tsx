import { Role as RoleEnum } from "@prisma/client";
import classNames from "classnames";

export interface RoleProps {
  role: RoleEnum;
}

const Role: React.FC<RoleProps> = ({ role }) => {
  let name = "Admin";
  let color = "text-bg-primary";
  let icon = "bi-laptop";
  switch (role) {
    case "FRIENDS_FAMILY":
      name = "Friends & Family";
      color = "text-bg-info";
      icon = "bi-house-heart-fill";
      break;
    case "PREMIUM":
      name = "Premium";
      color = "text-bg-warning";
      icon = "bi-star-fill";
      break;
    case "USER":
      name = "User";
      color = "text-bg-secondary";
      icon = "bi-person-fill";
      break;
  }
  return (
    <span className={classNames("badge", color)}>
      <i className={classNames("bi", icon)}></i> {name}
    </span>
  );
};

export default Role;
