import Logo from "@/components/Logo/Logo";
import { PropsWithChildren } from "react";

const AuthLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="container align-middle">
      <div className="row justify-content-center">
        <div className="col-md-3 text-center mt-5">
          <Logo size="md" />
        </div>
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;
