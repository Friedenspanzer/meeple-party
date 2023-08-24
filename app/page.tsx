import Login from "@/app/components/Login/Login";
import classNames from "classnames";
import Image from "next/image";
import { PropsWithChildren } from "react";
import styles from "./page.module.css";
import { useTranslation } from "@/i18n";

export default async function Home() {
  const { t } = await useTranslation("frontpage");
  return (
    <>
      <div className={classNames("container-fluid", styles.highlight)}>
        <div className="row align-items-center g-5 p-5">
          <div className="col-md-3">
            <Image
              src="/logo.svg"
              width={400}
              height={300}
              alt="Meeple Party"
              className={styles.image}
            />
          </div>
          <div className="col-md-6">
            <h1 className="display-1">Meeple Party</h1>
            <h2 className="display-6">{t("Header.Slogan")}</h2>
          </div>
          <div className="col-md-3">
            <Login />
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row mt-3">
          <div className="col-md-6 offset-md-3 alert alert-warning">
            <h3>👨‍💻 {t("Beta.Heading")}</h3>
            {t("Beta.Text")}
          </div>
        </div>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card text-bg-primary">
              <Image
                src="/highlight-card-1.png"
                className={classNames("card-img-top", styles.feature)}
                alt="Screenshot of combined collection views"
                width={414}
                height={200}
              />
              <div className="card-body">
                <h5 className="card-title">
                  {t("Features.CollectionView.Heading")}
                </h5>
                <p className="card-text">{t("Features.CollectionView.Text")}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-bg-primary">
              <Image
                src="/highlight-card-2.png"
                className={classNames("card-img-top", styles.feature)}
                alt="Screenshot of Meeple Party's filtering feature."
                width={414}
                height={200}
              />
              <div className="card-body">
                <h5 className="card-title">{t("Features.Filters.Heading")}</h5>
                <p className="card-text">{t("Features.Filters.Text")}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-bg-primary">
              <Image
                src="/highlight-card-3.png"
                className={classNames("card-img-top", styles.feature)}
                alt="Screenshot of Meeple Party's activity stream"
                width={414}
                height={200}
              />
              <div className="card-body">
                <h5 className="card-title">{t("Features.Stream.Heading")}</h5>
                <p className="card-text">{t("Features.Stream.Text")}</p>
              </div>
            </div>
          </div>
        </div>
        <Instruction heading={t("Steps.Fill.Heading")} number={1}>
          <p>{t("Steps.Fill.Text")}</p>
        </Instruction>
        <Instruction heading={t("Steps.Friends.Heading")} number={2}>
          <p>{t("Steps.Friends.Text_A")}</p>
          <p>{t("Steps.Friends.Text_B")}</p>
        </Instruction>
        <Instruction heading={t("Steps.Play.Heading")} number={3}>
          <p>{t("Steps.Play.Text")}</p>
        </Instruction>
      </div>
      <div
        className={classNames("container-fluid pt-4 pb-4", styles.highlight)}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h2>{t("Statements.Pricing.Heading")}</h2>
              <p>{t("Statements.Pricing.Text")}</p>
            </div>
            <div className="col-md-6">
              <h2>{t("Statements.Free.Heading")}</h2>
              <p>{t("Statements.Free.Text")}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <h2>{t("Statements.Welcome.Heading")}</h2>
              <p>{t("Statements.Welcome.Text")}</p>
            </div>
            <div className="col-md-6">
              <h2>{t("Statements.Transparency.Heading")}</h2>
              <p>{t("Statements.Transparency.Text")}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

type InstructionProps = PropsWithChildren<{ number: number; heading: string }>;
function Instruction({ number, heading, children }: InstructionProps) {
  return (
    <div className="row mt-4">
      <div className={classNames("col-md-1", styles.number)}>
        <i className={`bi bi-${number}-circle-fill`}></i>
      </div>
      <div className={classNames("col", styles.instruction)}>
        <h3 className={classNames(styles.instructionTitle)}>{heading}</h3>
        {children}
      </div>
    </div>
  );
}
