import { IonContent, IonHeader, IonList, IonPage, IonText, IonTitle, IonToolbar, useIonViewWillEnter, useIonAlert, useIonToast } from '@ionic/react';
import './Tab1.css';
import RepoItem from '../components/RepoItem';
import React from 'react';
// 1. Importamos las nuevas funciones del servicio
import { fetchRepositories, deleteRepository, updateRepository } from '../services/GithubService';
import { Repository } from '../interfaces/Repository';
import LoadingSpinner from '../components/LoadingSpinner';

const Tab1: React.FC = () => {
  const [repositoryList, setRepositoryList] = React.useState<Repository[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState('');
  
  // 2. Hooks de Ionic para alertas y notificaciones visuales (Toasts)
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();

  const fetchRepos = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const repos = await fetchRepositories();
      setRepositoryList(Array.isArray(repos) ? repos : []);
    } catch (error) {
      console.error('Error obteniendo repositorios:', error);
      setErrorMsg('Error obteniendo repositorios: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useIonViewWillEnter(() => {
    fetchRepos();
  });

  // 3. Función para manejar la eliminación
  const handleDelete = (owner: string, repoName: string) => {
    // Pedimos confirmación antes de eliminar
    presentAlert({
      header: '¿Estás seguro?',
      message: `Vas a eliminar el repositorio <strong>${repoName}</strong>. Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            setLoading(true);
            try {
              await deleteRepository(owner, repoName);
              // Filtramos la lista para quitar el eliminado de la pantalla
              setRepositoryList(prev => prev.filter(repo => repo.name !== repoName));
              presentToast({ message: 'Repositorio eliminado con éxito', duration: 2000, color: 'success' });
            } catch (error) {
              setErrorMsg('Error eliminando: ' + (error as Error).message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    });
  };

  // 4. Función para manejar la actualización (editar descripción)
  const handleUpdate = (owner: string, repoName: string) => {
    presentAlert({
      header: 'Actualizar Repositorio',
      message: `Nueva descripción para ${repoName}:`,
      inputs: [
        { name: 'description', type: 'text', placeholder: 'Escribe la nueva descripción...' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async (alertData) => {
            setLoading(true);
            try {
              const updatedRepo = await updateRepository(owner, repoName, { description: alertData.description });
              if (updatedRepo) {
                // Actualizamos solo el repositorio modificado en la lista
                setRepositoryList(prev => prev.map(repo => repo.name === repoName ? updatedRepo : repo));
                presentToast({ message: 'Repositorio actualizado con éxito', duration: 2000, color: 'success' });
              }
            } catch (error) {
              setErrorMsg('Error actualizando: ' + (error as Error).message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Listas de Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Listas de Repositorios</IonTitle>
          </IonToolbar>
        </IonHeader>

        {loading && <LoadingSpinner />}
        {errorMsg !== '' && <IonText color="danger"><p>{errorMsg}</p></IonText>}

        {!loading && Array.isArray(repositoryList) && (
          <IonList>
            {repositoryList.map((repo) => (
              <RepoItem 
                {...repo} 
                key={repo.id}
                // 5. Pasamos las funciones a nuestro componente hijo
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </IonList>
        )}

      </IonContent>
    </IonPage>
  );
};

export default Tab1;