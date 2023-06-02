import * as Yup from 'yup';
import { useValidationsBR } from 'validations-br'


Yup.addMethod(Yup.string, 'verifyCnpj', function () {
  return this.test('test-cnpj', 'CNPJ inválido', function (value) {
    if(value){

      const { path, createError } = this;
      
     // Remove punctuation from the CNPJ value
     const cnpjWithoutPunctuation = value.replace(/[^\d]+/g, '');
      
     if (!useValidationsBR('cnpj', cnpjWithoutPunctuation)) {
       return createError({ path, message: 'CNPJ verificado como inválido' });
     }
     
     return true;
   } else {
     return false;
   }
 });
});



export const validation = {
  
  sigla: Yup.string().max(10, 'Limite de 10 caracteres ultrapassado').required('Sigla é obrigatório'),
  nome: Yup.string().max(60, 'Limite de 60 caracteres ultrapassado').required('Nome é obrigatório'),
  fantasia: Yup.string().max(60, 'Limite de 60 caracteres ultrapassado').required('Fantasia é obrigatório'),
  responsavel: Yup.string().max(60, 'Limite de 60 caracteres ultrapassado').required('Responsável é obrigatório'),
  representante: Yup.string().max(60, 'Limite de 60 caracteres ultrapassado').required('Representante é obrigatório'),
  dataFiliacao: Yup.date().required('Data de filiação é obrigatória'),
  dataNascimento: Yup.date().required('Data de nascimento é obrigatória'),
  cep: Yup.string().min(8, 'CEP inválido').max(10,'CEP Invalido').required('CEP é obrigatório'),
  endereco: Yup.string().max(60, 'Limite de 60 caracteres ultrapassado').required('Endereço é obrigatório'),
  bairro: Yup.string().max(30, 'Limite de 30 caracteres ultrapassado').required('Bairro é obrigatório'),
  complemento: Yup.string().max(60, 'Limite de 60 caracteres ultrapassado').notRequired().nullable(),
  cidade: Yup.string().required('Cidade é obrigatório'),
  estado: Yup.string().required('Estado é obrigatório'),
  pais: Yup.string().required('País é obrigatório'),
  telefone: Yup.string()
  .matches(/^\d{10}$|^\d{11}$/, 'Número de telefone inválido')
  .required('Telefone é obrigatório'),
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  // @ts-ignore
  cnpj: Yup.string().verifyCnpj().min(14, 'Número de CNPJ inválido').max(18, 'Número de CNPJ inválido').required('CNPJ é obrigatório'),
  // @ts-ignore
  inscricaoMunicipal: Yup.string().nullable().min(5, 'Número de inscrição inválida').max(11, 'Número de inscrição inválida').notRequired(),
  inscricaoEstadual: Yup.string().nullable().min(9, 'Número de inscrição inválido').max(13, 'Número de inscrição inválida').notRequired(),
  dataCnpj: Yup.date().nullable().notRequired(),
  dataAta: Yup.date().nullable().notRequired(),
  foto: Yup.mixed().notRequired(),
  alvaraLocacao: Yup.boolean().notRequired(),  //.required('Alvará de locação é obrigatório'),
  estatuto: Yup.boolean().notRequired(),  //.required('Estatuto é obrigatório'),
  contratoSocial: Yup.boolean().notRequired(),  //.required('Contrato Social é obrigatório'),
  documentacaoAtualizada: Yup.boolean().notRequired(),  //.required('Documentação atualizada é obrigatória'),
  idRegiao: Yup.number().required('Região é obrigatória'),
  anotacoes: Yup.string().notRequired().nullable(),  //.required('Anotações é obrigatório'),
};