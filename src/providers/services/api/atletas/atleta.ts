import api from '..'
import { IAtletas } from '../../../../models/AtletaModel';



async function createAtletas(payload: IAtletas): Promise<IAtletas> {
    const formData = new FormData()
    Object.keys(payload).forEach((key) => {
        //@ts-ignorets-ignore
        return formData.append(key, payload[key]);
    });
    const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
    }

    const response = await api.post('gerencia/atleta', formData, config)

    return response.data
}