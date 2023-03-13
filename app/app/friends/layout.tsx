import Navbar from "./components/Navbar";

const FriendsLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default FriendsLayout;
