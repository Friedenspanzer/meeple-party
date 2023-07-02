import DeleteAccount from "@/components/DeleteAccount/DeleteAccount";

export default function Page() {
  return (
    <>
      <div className="row">
        <div className="col-8 offset-md-2">
          <h2>Danger Zone</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-8 offset-md-2">
          <h3>Account deletion</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-8 offset-md-2">
          <DeleteAccount />
        </div>
      </div>
    </>
  );
}
