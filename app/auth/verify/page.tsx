export default async function Page() {
  return (
    <>
      <div className="row mt-5 justify-content-center">
        <div className="col-md-6 text-center">
          <h4>Check your email</h4>
          <p className="lead">
            A login link has been sent to the provided email address.
          </p>
          <p>
            If you haven&apos;t received the email in a few minutes check your
            spam folder. If it isn&apos;t there either please try again.
          </p>
          <p>
            You can close this window, you won&apos;t need it for logging in.
          </p>
        </div>
      </div>
    </>
  );
}
