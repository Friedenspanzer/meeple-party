import Navbar from "./components/Navbar";

const FriendsLayout: React.FC<{ children: React.Component }> = ({
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
