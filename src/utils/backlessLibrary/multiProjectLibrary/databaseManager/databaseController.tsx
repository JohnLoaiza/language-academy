import axios, { AxiosResponse } from "axios";
import { apiRoute } from "../configs";
import { isJSON } from "./frontServices/components/extraInfo";

export class DatabaseController {
  dbName: string;
  constructor(dbName: string) {
    this.dbName = dbName;
  }

  getCollection = async (collection: string) => {
    const response = await axios
      .get(`${apiRoute}/${this.dbName}/${collection}`)
      .catch(() => {
        console.log("no hay que actualizar");
      });

    if (response) {
      const obj = response.data[0].properties;
      //  setIndexList(Object.keys(obj));
      console.log(response.data);
      //  setDataList(response.data);
      return this.toDataFormat(response.data, Object.keys(obj));
    } else {
      return null;
    }
  };

  addDocument = async (collection: string, doc: any) : Promise<AxiosResponse<any, any> | null> => {
    const response = await axios
      .post(`${apiRoute}/${this.dbName}/${collection}/insert`, doc)
      .catch(() => {
        console.log("no hay que actualizar");
      });
    if (response) {
      return response;
    } else {
      return null;
    }
  };

  editDocument = async (collection: string, id: string, doc: any) : Promise<AxiosResponse<any, any> | null> => {
    const response = await axios
      .put(
        `${apiRoute}/${this.dbName}/${collection}/update/${id}`,
        doc.properties
      )
      .catch(() => {
        console.log("no hay que actualizar");
      });
    if (response) {
      return response;
    } else {
      return null;
    }
  };

   deleteDocument = async (id: string, collection: string) : Promise<AxiosResponse<any, any> | null> => {
    const response = await axios
      .delete(`${apiRoute}/${this.dbName}/${collection}/${id}`)
      .catch(() => {
        console.log("no hay que actualizar");
      });
      if (response) {
        return response;
      } else {
        return null;
      }
    }

  toDataFormat = (dataResponse: any[], indexList: string[]): any[] => {
    var finaList: any[] = [];
    dataResponse.forEach((f: any) => {
      var add: any = {};
      indexList.forEach((i) => {
        var finalValue;
        if (isJSON(f.properties[i])) {
          finalValue = f.properties[i];
        } else {
          finalValue = f.properties[i];
        }
        add[i] = finalValue;
      });
      finaList.push({ id: f.id, properties: add });
    });
    console.log(dataResponse);

    console.log("final list es");

    console.log(finaList);
    return finaList;
  };
}
