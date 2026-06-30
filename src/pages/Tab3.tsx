import React from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { GithubUser } from "../interfaces/GithubUser";
import { fetchUserInfo } from "../services/GithubService";
import "./Tab3.css";
import LoadingSpinner from "../components/LoadingSpinner";

const Tab3: React.FC = () => {
  const [userInfo, setUserInfo] = React.useState<GithubUser | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  useIonViewWillEnter(() => {
    setLoading(true);
    fetchUserInfo().then((user) => {
      setUserInfo(user);
    }).catch((error) => {
      setErrorMsg("Error al cargar la información del usuario" + error);
    }).finally(() => {
      setLoading(false);
    });
  });
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil de usuario</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Perfil de usuario</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className="card-container">
          {userInfo && (
            <IonCard className="card">
              <img
                src={userInfo.avatar_url}
                alt={userInfo.name}
              />
              <IonCardHeader>
                <IonCardTitle>{userInfo.name}</IonCardTitle>
                <IonCardSubtitle>{userInfo.login}</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <p>{userInfo.bio}</p>
              </IonCardContent>
            </IonCard>)}
            {errorMsg != '' && <IonText color="danger">{errorMsg}</IonText>}
        </div>
        {loading && <LoadingSpinner />}
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
