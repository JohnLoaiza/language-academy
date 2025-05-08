import React, { useState } from 'react';
import './createDb.css';
import { identificateVar } from './components/extraInfo';

interface ParClaveValor {
  indice: string;
  valor: any; 
}

interface Props {
  addDoc: (doc: any) => void;
}

const DynamicKeyValue = (props: Props) => {
  const [paresClaveValor, setParesClaveValor] = useState<ParClaveValor[]>([]);
  const [objetoFinal, setObjetoFinal] = useState<Record<string, any>>({});
  const [editorTexto, setEditorTexto] = useState<string>('');

  const manejarCambioInput = (index: number, field: 'indice' | 'valor', value: string) => {
    const nuevosParesClaveValor = [...paresClaveValor];
    try {
      nuevosParesClaveValor[index][field] = JSON.parse(value);
    } catch (error) {
      nuevosParesClaveValor[index][field] = value;
    }
    setParesClaveValor(nuevosParesClaveValor);
    actualizarObjetoFinal(nuevosParesClaveValor);
  };

  const agregarPar = () => {
    setParesClaveValor([...paresClaveValor, { indice: '', valor: '' }]);
  };

  const actualizarObjetoFinal = (pares: ParClaveValor[]) => {
    var objetoResultado: Record<string, any> = {};
    pares.forEach(par => {
      objetoResultado[par.indice] = identificateVar(par.valor, par.valor, par.valor, JSON.parse(par.valor), JSON.parse(par.valor));
    });
    setObjetoFinal(objetoResultado);
    setEditorTexto(JSON.stringify(objetoResultado, null, 2));
  };

  const manejarCambioTexto = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorTexto(e.target.value);
    try {
      const jsonData = JSON.parse(e.target.value);
      setObjetoFinal(jsonData);
      setParesClaveValor(Object.entries(jsonData).map(([key, value]) => ({ indice: key, valor: String(value) })));
    } catch {
    }
  };

  const finalizar = () => {
    console.log('objeto final sale');
    console.log(objetoFinal);
    props.addDoc({ id: 0, properties: objetoFinal });
  };

  return (
    <div className="container editor-wrapper">
      
      
      <div className="editor-wrapper">
      <h1>Editor de JSON / Pares Clave-Valor</h1>
        <div className="editor-container">
          <h2>Editor JSON</h2>
          <textarea
            className="editor-textarea"
            value={editorTexto}
            onChange={manejarCambioTexto}
            placeholder="Escribe el JSON aquí..."
          />
        </div>
        <h2>Pares Dinámicos Índice-Valor</h2>
      <div className="pares-container">
        {paresClaveValor.map((par, index) => (
          <div key={index} className="par-item">
            <input
              type="text"
              placeholder="Índice"
              value={par.indice}
              onChange={(e) => manejarCambioInput(index, 'indice', e.target.value)}
            />
            <input
              type="text"
              placeholder="Valor"
              value={par.valor}
              onChange={(e) => manejarCambioInput(index, 'valor', e.target.value)}
            />
          </div>
        ))}
      </div>
      <button onClick={agregarPar}>Agregar Par</button>
      <br />
      <button onClick={finalizar}>Finalizar</button>
      </div>
      <div className="object-container">
          <h2>Objeto Formado:</h2>
          <pre className="json-output">{JSON.stringify(objetoFinal, null, 2)}</pre>
        </div>
      
    </div>
  );
};

export default DynamicKeyValue;
