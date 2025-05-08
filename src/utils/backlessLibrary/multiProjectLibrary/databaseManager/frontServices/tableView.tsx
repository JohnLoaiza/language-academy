import  { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSync, FaPlus } from "react-icons/fa"; // Importar íconos adicionales
import "./Table.css"; // Archivo de estilos para personalizar la tabla
import EditModal, { ModalProps } from "./components/editModal";
import InfoIconTooltip, { identificateVar } from "./components/extraInfo";
import DynamicKeyValue from "./createDb";
import { DatabaseController } from "../databaseController";
import { Admin } from "../../projectsManager";

type Props = {
  project: string;
  collection: string;
};

const Table = (props: Props) => {
  // Obtiene los parámetros de la ruta
  // const { project, collection } = useParams<{ project: string; collection: string }>();
  const { project, collection } = props;
  const [indexList, setIndexList] = useState<string[]>([]);
  const [dataList, setDataList] = useState<any[]>([]);
  const [editModal, setEditModal] = useState<ModalProps>({
    editAs: "",
    flag: false,
    obj: undefined,
    indexEdit: 0,
    mapList: [],
    doc: undefined,
    asEdit: false,
    addDoc: (doc: any) => {doc},
    editDoc: (d: string, doc: any) => {d + doc},
    indexList: [],
    onClose: () => {}
  });


  useEffect(() => {
    getData();
    return () => {};
  }, []);

  const getData = async () => {
   const db: DatabaseController = Admin.projectSelected!.dbConnect;
   const myCollection: any[] | null   = await db.getCollection(collection)

   if (myCollection) {
    setDataList(myCollection);
    setIndexList(Object.keys(myCollection[0].properties));
   } else {
      console.log('No se pudo encontrar la coleccion');
   }
  };

  const deleteDoc = async (id: string) => {
    const db: DatabaseController = Admin.projectSelected!.dbConnect;
    const insert = await db.deleteDocument(id,collection)
    if (insert) {
      const updatedList = dataList.filter((doc) => doc.id !== id);
      setDataList([...updatedList]);
    } else {
      return { success: false };
    }
  };

  const editDoc = async (id: string, doc: any) => {
    const db: DatabaseController = Admin.projectSelected!.dbConnect;
    const insert = await db.addDocument(collection, doc.properties)
    if (insert) {
      const index = dataList.findIndex((doc) => doc.id === id);
      if (index > -1) {
        dataList[index] = doc;
        setDataList([...dataList]);
      }
    }
  };

  const addDoc = async (doc: any) => {
    console.log('requset va');
    console.log(doc);
    console.log(doc.properties);
    const db: DatabaseController = Admin.projectSelected!.dbConnect;
   const insert = await db.addDocument(collection, doc.properties)
    if (insert) {
      getData();
    }
  };


  return (
    <div>
  <div className="table-container content-div">
      {dataList.length > 0 ? (
        <>
          <header className="header">
            <h1
              onClick={() => {
                console.log(dataList);
              }}
            >
              Proyecto: {project}
            </h1>
            <h2>Colección: {collection}</h2>
          </header>
          <div className="action-icons content-div">
            <FaSync
              onClick={async () => await getData()}
              style={{ cursor: "pointer", marginRight: "10px" }}
              title="Reload Data"
            />
            <FaPlus
              onClick={() =>
                setEditModal({
                  flag: true,
                  doc: dataList[0],
                  obj: dataList[0].properties,
                  mapList: [],
                  asEdit: false,
                  addDoc: addDoc,
                  editDoc: editDoc,
                  indexList: indexList
                })
              }
              style={{ cursor: "pointer", marginRight: "10px" }}
              title="Add New"
            />
          </div>

          {/* Envolvemos la tabla dentro del contenedor con scroll horizontal */}
          <div className="table-wrapper content-div">
            <table className="styled-table">
              <thead>
                <tr>
                  {indexList.map((i) => (
                    <th key={i}>{i}</th>
                  ))}
                  <th>Actions</th> {/* Columna para acciones */}
                </tr>
              </thead>
              <tbody>
                {dataList.map((doc, index) => (
                  <tr key={doc.id}>
                    {indexList.map((i) => {
                      const finalValue = doc.properties[i];
                      return (
                        <td key={i}>
                          {identificateVar(
                            finalValue,
                            finalValue,
                            finalValue,
                            <InfoIconTooltip
                              addDoc={addDoc}
                              editDoc={editDoc}
                              doc={doc}
                              setEditModal={setEditModal}
                              mapList={[i]}
                              info={finalValue}
                            />,
                            <InfoIconTooltip
                              addDoc={addDoc}
                              doc={doc}
                              setEditModal={setEditModal}
                              mapList={[i]}
                              info={finalValue}
                            />
                          )}
                        </td>
                      );
                    })}
                    <td>
                      <FaEdit
                        onClick={() =>
                          setEditModal({
                            editAs: "objectList",
                            indexEdit: index,
                            flag: true,
                            obj: doc.properties,
                            mapList: [],
                            doc: doc,
                            asEdit: true,
                            addDoc: addDoc,
                            editDoc: editDoc,
                            indexList: indexList,
                          })
                        }
                        style={{ cursor: "pointer", marginRight: "10px" }}
                      />
                      <FaTrash
                        onClick={() => deleteDoc(doc.id)}
                        style={{ cursor: "pointer", color: "red" }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
        </>
      ) : (
        <DynamicKeyValue addDoc={addDoc}></DynamicKeyValue>
      )}
      
    </div>
    {editModal.flag ? (
        <EditModal
              editAs={editModal.editAs}
              indexEdit={editModal.indexEdit}
              addDoc={editModal.addDoc}
              asEdit={editModal.asEdit}
              editDoc={editModal.editDoc}
              indexList={editModal.indexList}
              doc={editModal.doc}
              onClose={() => setEditModal({
                editAs: "",
                obj: undefined,
                indexEdit: 0,
                mapList: [],
                flag: false,
                doc: undefined,
                asEdit: false,
                addDoc: () => { },
                editDoc: () => { },
                indexList: [],
              })}
              obj={editModal.obj}
              mapList={editModal.mapList} ></EditModal>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Table;
