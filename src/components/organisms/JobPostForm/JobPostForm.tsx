import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import styles from "./JobPostForm.module.css";

import TextInput from "@molecules/formComponents/TextInput";
import TextArea from "@molecules/formComponents/TextArea";
import Select from "@molecules/formComponents/Select";

interface IFormInputs {
  company: string;
  description: string;
  location: string;
  requisites: string[];
  stack: string[];
  title: string;
  url: string;
  source: string;
}

const schema = yup
  .object({
    title: yup.string().required(),
    company: yup.string().required(),
    description: yup.string().required(),
    location: yup.string().required(),
    requisites: yup.array().required(),
    stack: yup.array().max(5).required(),
    url: yup.string().required(),
    source: yup.string().required(),
  })
  .required();

const JobPostForm = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: IFormInputs) => {
    const {
      title,
      company,
      description,
      location,
      requisites,
      stack,
      url,
      source,
    } = data;

    const curator = "Curator"; //This come from outside the form (auth)
    const indicatedBy = ""; //This come from outside the form - and it is optional
    const now = new Date();

    const jobPost = {
      title,
      company,
      description,
      location,
      requisites,
      stack,
      url,
      source,
      closed: false,
      createAt: now,
      modifiedAt: now,
      curator,
      indicatedBy,
      blob: `${title} ${company} ${curator} ${now.getFullYear()} ${now.getMonth()} ${now.getDay()}`,
    };
    console.log("submit->", jobPost);
  };

  const {
    onChange: onChangeTitle,
    onBlur: onBlurTitle,
    name: nameTitle,
    ref: refTitle,
  } = register("title");

  const {
    onChange: onChangeCompany,
    onBlur: onBlurCompany,
    name: nameCompany,
    ref: refCompany,
  } = register("company");

  const {
    onChange: onChangeDescription,
    onBlur: onBlurDescription,
    name: nameDescription,
    ref: refDescription,
  } = register("description");

  const {
    onChange: onChangeLocation,
    onBlur: onBlurLocation,
    name: nameLocation,
    ref: refLocation,
  } = register("location");

  const {
    onChange: onChangeRequisites,
    onBlur: onBlurRequisites,
    name: nameRequisites,
    ref: refRequisites,
  } = register("requisites");

  const {
    onChange: onChangeStack,
    onBlur: onBlurStack,
    name: nameStack,
    ref: refStack,
  } = register("stack");

  const {
    onChange: onChangeUrl,
    onBlur: onBlurUrl,
    name: nameUrl,
    ref: refUrl,
  } = register("url");

  const {
    onChange: onChangeSource,
    onBlur: onBlurSource,
    name: nameSource,
    ref: refSource,
  } = register("source");

  return (
    <div id={styles.root}>
      <p>Cadastrar Vaga</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          onChange={onChangeTitle}
          onBlur={onBlurTitle}
          name={nameTitle}
          ref={refTitle}
          errors={errors}
          placeholder="Título"
        />

        <TextInput
          onChange={onChangeCompany}
          onBlur={onBlurCompany}
          name={nameCompany}
          ref={refCompany}
          errors={errors}
          placeholder="Empresa"
        />

        <TextArea
          onChange={onChangeDescription}
          onBlur={onBlurDescription}
          name={nameDescription}
          ref={refDescription}
          errors={errors}
          placeholder="Descrição"
          rows={5}
          cols={33}
        />

        <TextInput
          onChange={onChangeLocation}
          onBlur={onBlurLocation}
          name={nameLocation}
          ref={refLocation}
          errors={errors}
          placeholder="Localização"
        />

        <Select
          onChange={onChangeRequisites}
          onBlur={onBlurRequisites}
          name={nameRequisites}
          ref={refRequisites}
          errors={errors}
          options={[
            { id: "pcd", value: "Pessoa com Deficiência" },
            { id: "mulher", value: "Mulher" },
            { id: "estagio", value: "Estágio" },
            { id: "negro", value: "Negro" },
          ]}
          multiple
        />

        <Select
          onChange={onChangeStack}
          onBlur={onBlurStack}
          name={nameStack}
          ref={refStack}
          errors={errors}
          options={[
            { id: "javascript", value: "JavaScript" },
            { id: "react", value: "React" },
            { id: "vue", value: "Vue" },
            { id: "php", value: "PHP" },
            { id: "elixir", value: "Elixir" },
            { id: "ruby", value: "Ruby" },
            { id: "laravel", value: "Laravel" },
          ]}
          multiple
        />

        <TextInput
          onChange={onChangeUrl}
          onBlur={onBlurUrl}
          name={nameUrl}
          ref={refUrl}
          errors={errors}
          placeholder="Link"
        />

        <TextInput
          onChange={onChangeSource}
          onBlur={onBlurSource}
          name={nameSource}
          ref={refSource}
          errors={errors}
          placeholder="Fonte"
        />

        <input type="submit" />
      </form>
    </div>
  );
};

export default JobPostForm;
