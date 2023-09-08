import DeleteAccount from "@/components/DeleteAccount/DeleteAccount";
import LanguagePicker from "@/components/LanguagePicker/LanguagePicker";

export default function Page() {
  return (
    <div className="grid">
      <div className="row">
        <div className="col-8 offset-md-2">
          <h2>Language</h2>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-8 offset-md-2">
          <h3>Page</h3>
          <LanguagePicker
            availableLanguages={["auto", "en", "de"]}
            type="page"
          />
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-8 offset-md-2">
          <h3>Games</h3>
          <LanguagePicker
            availableLanguages={["follow", "auto", "en"]}
            type="game"
          />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-8 offset-md-2">
          <h2>Danger Zone</h2>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-8 offset-md-2">
          <h3>Account deletion</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-8 offset-md-2">
          <DeleteAccount />
        </div>
      </div>
    </div>
  );
}
