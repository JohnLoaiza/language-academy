import { languageAcademy } from './projects/languageAcademy';
import { MultiProjectsRoutes } from './utils/backlessLibrary/multiProjectLibrary/routesManager/multiProjectRoutes';

function App() {
  return (
    <MultiProjectsRoutes
      suscribeProjects={[languageAcademy]}
    ></MultiProjectsRoutes>
  );
}

export default App
